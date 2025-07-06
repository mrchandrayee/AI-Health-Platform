from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..models import User, ProgressLog
from ..schemas import ProgressLogCreate, ProgressLog as ProgressLogSchema, ProgressTrends
from ..auth import get_current_active_user

router = APIRouter(prefix="/progress", tags=["progress"])

@router.post("/log-metric", response_model=ProgressLogSchema)
async def log_metric(
    metric: ProgressLogCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Log any user metric (weight, macros, strength, mood, etc.)"""
    
    try:
        progress_log = ProgressLog(
            user_id=current_user.id,
            log_type=metric.log_type,
            metric_name=metric.metric_name,
            metric_value=metric.metric_value,
            metric_unit=metric.metric_unit,
            additional_data=metric.additional_data,
            notes=metric.notes
        )
        
        db.add(progress_log)
        db.commit()
        db.refresh(progress_log)
        
        return progress_log
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log metric: {str(e)}"
        )

@router.get("/user/{user_id}/metrics", response_model=List[ProgressLogSchema])
async def get_user_metrics(
    user_id: int,
    log_type: Optional[str] = None,
    metric_name: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve all logged metrics for a user with optional filters"""
    
    # Users can only access their own metrics unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Build query
    query = db.query(ProgressLog).filter(ProgressLog.user_id == user_id)
    
    if log_type:
        query = query.filter(ProgressLog.log_type == log_type)
    if metric_name:
        query = query.filter(ProgressLog.metric_name == metric_name)
    if start_date:
        query = query.filter(ProgressLog.logged_at >= start_date)
    if end_date:
        query = query.filter(ProgressLog.logged_at <= end_date)
    
    metrics = query.order_by(ProgressLog.logged_at.desc()).all()
    return metrics

@router.get("/user/{user_id}/trends", response_model=List[ProgressTrends])
async def get_user_trends(
    user_id: int,
    period: str = "weekly",  # weekly, monthly, quarterly
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Calculate and return aggregated trends for various metrics"""
    
    # Users can only access their own trends unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Calculate date range based on period
    end_date = datetime.now()
    if period == "weekly":
        start_date = end_date - timedelta(weeks=8)  # 8 weeks of data
        date_trunc = "week"
    elif period == "monthly":
        start_date = end_date - timedelta(days=180)  # 6 months of data
        date_trunc = "month"
    else:  # quarterly
        start_date = end_date - timedelta(days=365)  # 1 year of data
        date_trunc = "quarter"
    
    try:
        # Get distinct metric names
        metric_names = db.query(ProgressLog.metric_name).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.logged_at >= start_date
        ).distinct().all()
        
        trends = []
        
        for (metric_name,) in metric_names:
            # Get trend data for this metric
            trend_data = db.query(
                func.date_trunc(date_trunc, ProgressLog.logged_at).label('period'),
                func.avg(ProgressLog.metric_value).label('avg_value'),
                func.count(ProgressLog.metric_value).label('count')
            ).filter(
                ProgressLog.user_id == user_id,
                ProgressLog.metric_name == metric_name,
                ProgressLog.logged_at >= start_date
            ).group_by(
                func.date_trunc(date_trunc, ProgressLog.logged_at)
            ).order_by(
                func.date_trunc(date_trunc, ProgressLog.logged_at)
            ).all()
            
            if trend_data:
                # Calculate trend direction and percentage change
                values = [float(row.avg_value) for row in trend_data]
                if len(values) >= 2:
                    percentage_change = ((values[-1] - values[0]) / values[0]) * 100
                    if percentage_change > 5:
                        trend_direction = "increasing"
                    elif percentage_change < -5:
                        trend_direction = "decreasing"
                    else:
                        trend_direction = "stable"
                else:
                    percentage_change = 0
                    trend_direction = "stable"
                
                # Format trend data
                formatted_trend_data = [
                    {
                        "period": row.period.isoformat(),
                        "value": float(row.avg_value),
                        "count": row.count
                    }
                    for row in trend_data
                ]
                
                trends.append(ProgressTrends(
                    metric_name=metric_name,
                    trend_data=formatted_trend_data,
                    trend_direction=trend_direction,
                    percentage_change=percentage_change,
                    period=period
                ))
        
        return trends
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate trends: {str(e)}"
        )

@router.put("/user/{user_id}/goals")
async def update_user_goals(
    user_id: int,
    goals: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user's long-term goals"""
    
    # Users can only update their own goals unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Log goal update as a metric
        goal_log = ProgressLog(
            user_id=user_id,
            log_type="goal_update",
            metric_name="goals_updated",
            metric_value=1,
            metric_unit="update",
            additional_data=goals,
            notes="User goals updated"
        )
        
        db.add(goal_log)
        db.commit()
        
        return {"message": "Goals updated successfully", "goals": goals}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update goals: {str(e)}"
        )

@router.get("/user/{user_id}/milestones")
async def get_user_milestones(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve predefined or AI-generated milestones and user's progress towards them"""
    
    # Users can only access their own milestones unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Get recent weight entries for weight-based milestones
        recent_weights = db.query(ProgressLog).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.metric_name == "weight"
        ).order_by(ProgressLog.logged_at.desc()).limit(10).all()
        
        # Get workout logs for fitness milestones
        workout_logs = db.query(ProgressLog).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.log_type == "workout"
        ).order_by(ProgressLog.logged_at.desc()).limit(20).all()
        
        milestones = []
        
        # Weight-based milestones
        if recent_weights:
            current_weight = recent_weights[0].metric_value
            if len(recent_weights) > 1:
                weight_change = current_weight - recent_weights[-1].metric_value
                milestones.append({
                    "type": "weight_progress",
                    "title": "Weight Change Progress",
                    "current_value": current_weight,
                    "change": weight_change,
                    "unit": "kg",
                    "achievement_level": "good" if weight_change < 0 else "maintain"
                })
        
        # Fitness consistency milestones
        if workout_logs:
            recent_workouts = len([log for log in workout_logs if log.logged_at >= datetime.now() - timedelta(weeks=4)])
            milestones.append({
                "type": "workout_consistency",
                "title": "Monthly Workout Consistency",
                "current_value": recent_workouts,
                "target_value": 12,  # 3 workouts per week for 4 weeks
                "unit": "workouts",
                "achievement_level": "excellent" if recent_workouts >= 12 else "good" if recent_workouts >= 8 else "needs_improvement"
            })
        
        # Add more milestone calculations as needed
        
        return {"milestones": milestones}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve milestones: {str(e)}"
        )

@router.get("/user/{user_id}/dashboard")
async def get_progress_dashboard(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive progress dashboard data"""
    
    # Users can only access their own dashboard unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    try:
        # Get recent metrics summary
        recent_metrics = {}
        
        # Weight data
        recent_weight = db.query(ProgressLog).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.metric_name == "weight"
        ).order_by(ProgressLog.logged_at.desc()).first()
        
        if recent_weight:
            recent_metrics["current_weight"] = {
                "value": recent_weight.metric_value,
                "unit": recent_weight.metric_unit,
                "date": recent_weight.logged_at
            }
        
        # Workout summary (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        workout_count = db.query(ProgressLog).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.log_type == "workout",
            ProgressLog.logged_at >= thirty_days_ago
        ).count()
        
        recent_metrics["monthly_workouts"] = workout_count
        
        # Average daily calories (last 7 days)
        seven_days_ago = datetime.now() - timedelta(days=7)
        avg_calories = db.query(func.avg(ProgressLog.metric_value)).filter(
            ProgressLog.user_id == user_id,
            ProgressLog.metric_name == "calories_consumed",
            ProgressLog.logged_at >= seven_days_ago
        ).scalar()
        
        if avg_calories:
            recent_metrics["avg_daily_calories"] = float(avg_calories)
        
        return {
            "user_id": user_id,
            "summary": recent_metrics,
            "last_updated": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard data: {str(e)}"
        )
