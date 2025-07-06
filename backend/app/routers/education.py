from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import EducationalContent
from ..schemas import EducationalContentCreate, EducationalContent as EducationalContentSchema
from ..auth import get_current_active_user, require_admin_role
from ..ai_service import ai_service

router = APIRouter(prefix="/education", tags=["education"])

@router.get("/articles", response_model=List[EducationalContentSchema])
async def get_articles(
    tag: Optional[str] = Query(None, description="Filter by tag"),
    target_audience: Optional[str] = Query(None, description="Filter by target audience"),
    featured_only: bool = Query(False, description="Show only featured content"),
    limit: int = Query(20, le=100, description="Maximum number of articles to return"),
    db: Session = Depends(get_db)
):
    """Retrieve a list of AI-curated articles"""
    
    query = db.query(EducationalContent).filter(
        EducationalContent.content_type == "article"
    )
    
    if tag:
        query = query.filter(EducationalContent.tags.contains([tag]))
    
    if target_audience:
        query = query.filter(EducationalContent.target_audience.contains([target_audience]))
    
    if featured_only:
        query = query.filter(EducationalContent.is_featured == True)
    
    articles = query.order_by(
        EducationalContent.is_featured.desc(),
        EducationalContent.view_count.desc(),
        EducationalContent.created_at.desc()
    ).limit(limit).all()
    
    return articles

@router.get("/articles/{article_id}", response_model=EducationalContentSchema)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a specific article's content"""
    
    article = db.query(EducationalContent).filter(
        EducationalContent.id == article_id,
        EducationalContent.content_type == "article"
    ).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Increment view count
    article.view_count += 1
    db.commit()
    
    return article

@router.get("/videos", response_model=List[EducationalContentSchema])
async def get_videos(
    tag: Optional[str] = Query(None, description="Filter by tag"),
    target_audience: Optional[str] = Query(None, description="Filter by target audience"),
    featured_only: bool = Query(False, description="Show only featured content"),
    limit: int = Query(20, le=100, description="Maximum number of videos to return"),
    db: Session = Depends(get_db)
):
    """Retrieve a list of short visual explainers"""
    
    query = db.query(EducationalContent).filter(
        EducationalContent.content_type == "video"
    )
    
    if tag:
        query = query.filter(EducationalContent.tags.contains([tag]))
    
    if target_audience:
        query = query.filter(EducationalContent.target_audience.contains([target_audience]))
    
    if featured_only:
        query = query.filter(EducationalContent.is_featured == True)
    
    videos = query.order_by(
        EducationalContent.is_featured.desc(),
        EducationalContent.view_count.desc(),
        EducationalContent.created_at.desc()
    ).limit(limit).all()
    
    return videos

@router.get("/videos/{video_id}", response_model=EducationalContentSchema)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    """Get a specific video's details/link"""
    
    video = db.query(EducationalContent).filter(
        EducationalContent.id == video_id,
        EducationalContent.content_type == "video"
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    # Increment view count
    video.view_count += 1
    db.commit()
    
    return video

@router.post("/search")
async def search_educational_content(
    keywords: List[str],
    content_type: Optional[str] = None,
    target_audience: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Search educational content using keywords"""
    
    query = db.query(EducationalContent)
    
    if content_type:
        query = query.filter(EducationalContent.content_type == content_type)
    
    if target_audience:
        query = query.filter(EducationalContent.target_audience.contains([target_audience]))
    
    # Search in title, summary, and tags
    search_results = []
    
    for keyword in keywords:
        keyword_lower = keyword.lower()
        
        # Search in title
        title_matches = query.filter(
            EducationalContent.title.ilike(f"%{keyword}%")
        ).all()
        
        # Search in summary
        summary_matches = query.filter(
            EducationalContent.summary.ilike(f"%{keyword}%")
        ).all()
        
        # Search in tags
        tag_matches = query.filter(
            EducationalContent.tags.contains([keyword_lower])
        ).all()
        
        # Combine and deduplicate results
        all_matches = title_matches + summary_matches + tag_matches
        unique_matches = {content.id: content for content in all_matches}
        search_results.extend(unique_matches.values())
    
    # Remove duplicates and sort by relevance (view count as proxy)
    unique_results = {content.id: content for content in search_results}
    sorted_results = sorted(
        unique_results.values(),
        key=lambda x: (x.is_featured, x.view_count, x.created_at),
        reverse=True
    )
    
    return {
        "query": keywords,
        "results": sorted_results[:20],  # Limit to 20 results
        "total_found": len(sorted_results)
    }

@router.post("/curate-topic")
async def curate_topic(
    topic: str,
    target_audience: List[str] = ["general"],
    sources: List[str] = ["NHS", "WHO", "USDA", "ACSM"],
    current_user = Depends(require_admin_role),
    db: Session = Depends(get_db)
):
    """Admin endpoint to trigger AI curation of articles/explainers on a specific topic"""
    
    try:
        # Generate AI-curated content
        curated_content = await ai_service.curate_educational_content(
            topic, target_audience, sources
        )
        
        # Save to database
        content = EducationalContent(
            title=curated_content["title"],
            content_type="article",
            content=curated_content["content"],
            summary=curated_content["summary"],
            tags=curated_content["tags"],
            source=", ".join(curated_content["sources_cited"]),
            target_audience=target_audience,
            is_featured=False
        )
        
        db.add(content)
        db.commit()
        db.refresh(content)
        
        return {
            "message": "Content curated successfully",
            "content_id": content.id,
            "title": content.title
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to curate content: {str(e)}"
        )

@router.post("/content", response_model=EducationalContentSchema)
async def create_educational_content(
    content: EducationalContentCreate,
    current_user = Depends(require_admin_role),
    db: Session = Depends(get_db)
):
    """Admin endpoint to manually create educational content"""
    
    db_content = EducationalContent(**content.dict())
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    
    return db_content

@router.put("/content/{content_id}/feature")
async def toggle_featured_content(
    content_id: int,
    is_featured: bool,
    current_user = Depends(require_admin_role),
    db: Session = Depends(get_db)
):
    """Admin endpoint to toggle featured status of content"""
    
    content = db.query(EducationalContent).filter(
        EducationalContent.id == content_id
    ).first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    content.is_featured = is_featured
    db.commit()
    
    return {"message": f"Content {'featured' if is_featured else 'unfeatured'} successfully"}

@router.get("/recommendations")
async def get_personalized_recommendations(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get personalized educational content recommendations based on user profile"""
    
    # Get user's profile and recent activity to personalize recommendations
    # For now, return general recommendations
    
    recommendations = {
        "featured_articles": db.query(EducationalContent).filter(
            EducationalContent.content_type == "article",
            EducationalContent.is_featured == True
        ).limit(5).all(),
        
        "popular_videos": db.query(EducationalContent).filter(
            EducationalContent.content_type == "video"
        ).order_by(EducationalContent.view_count.desc()).limit(5).all(),
        
        "recent_additions": db.query(EducationalContent).order_by(
            EducationalContent.created_at.desc()
        ).limit(5).all()
    }
    
    return recommendations

@router.get("/categories")
async def get_content_categories(db: Session = Depends(get_db)):
    """Get all available content categories/tags"""
    
    # Get all unique tags from content
    all_content = db.query(EducationalContent.tags).all()
    
    all_tags = set()
    for content in all_content:
        if content.tags:
            all_tags.update(content.tags)
    
    categories = {
        "nutrition": ["meal_planning", "macro_tracking", "cultural_nutrition", "special_diets"],
        "fitness": ["strength_training", "cardio", "flexibility", "adaptive_exercise"],
        "health": ["weight_management", "chronic_conditions", "mental_health", "sleep"],
        "lifestyle": ["stress_management", "habit_formation", "motivation", "goal_setting"]
    }
    
    return {
        "categories": categories,
        "all_tags": sorted(list(all_tags))
    }
