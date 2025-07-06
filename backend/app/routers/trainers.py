from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..models import User, TrainerClient, NutritionPlan, FitnessPlan, ProgressLog
from ..schemas import TrainerClientAssignment, TrainerClient as TrainerClientSchema, User as UserSchema
from ..auth import get_current_active_user, require_trainer_role

router = APIRouter(prefix="/trainers", tags=["trainers"])

@router.get("/my-clients", response_model=List[UserSchema])
async def get_my_clients(
    current_trainer: User = Depends(require_trainer_role),
    db: Session = Depends(get_db)
):
    """Get a list of clients assigned to the authenticated trainer"""
    
    client_assignments = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == current_trainer.id,
        TrainerClient.is_active == True
    ).all()
    
    clients = []
    for assignment in client_assignments:
        client = db.query(User).filter(User.id == assignment.client_id).first()
        if client:
            clients.append(client)
    
    return clients

@router.get("/clients/{client_id}/progress")
async def get_client_progress(
    client_id: int,
    current_trainer: User = Depends(require_trainer_role),
    db: Session = Depends(get_db)
):
    """Get detailed progress data for a specific client"""
    
    # Verify trainer has access to this client
    assignment = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == current_trainer.id,
        TrainerClient.client_id == client_id,
        TrainerClient.is_active == True
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Client not assigned to this trainer."
        )
    
    # Get client information
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Get recent progress logs
    recent_logs = db.query(ProgressLog).filter(
        ProgressLog.user_id == client_id
    ).order_by(ProgressLog.logged_at.desc()).limit(50).all()
    
    # Get active plans
    active_nutrition_plan = db.query(NutritionPlan).filter(
        NutritionPlan.user_id == client_id,
        NutritionPlan.is_active == True
    ).first()
    
    active_fitness_plan = db.query(FitnessPlan).filter(
        FitnessPlan.user_id == client_id,
        FitnessPlan.is_active == True
    ).first()
    
    return {
        "client": {
            "id": client.id,
            "full_name": client.full_name,
            "email": client.email
        },
        "recent_progress": recent_logs,
        "active_nutrition_plan": active_nutrition_plan,
        "active_fitness_plan": active_fitness_plan,
        "assignment_date": assignment.assigned_at,
        "trainer_notes": assignment.notes
    }

@router.post("/clients/{client_id}/assign-plan")
async def assign_plan_to_client(
    client_id: int,
    plan_data: Dict[str, Any],
    current_trainer: User = Depends(require_trainer_role),
    db: Session = Depends(get_db)
):
    """Assign a custom (or AI-generated) plan to a client"""
    
    # Verify trainer has access to this client
    assignment = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == current_trainer.id,
        TrainerClient.client_id == client_id,
        TrainerClient.is_active == True
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Client not assigned to this trainer."
        )
    
    plan_type = plan_data.get("plan_type")  # "nutrition" or "fitness"
    
    try:
        if plan_type == "nutrition":
            # Create nutrition plan
            nutrition_plan = NutritionPlan(
                user_id=client_id,
                title=plan_data.get("title", "Trainer-Assigned Nutrition Plan"),
                description=plan_data.get("description", "Custom plan assigned by trainer"),
                plan_data=plan_data.get("plan_data", []),
                nutritional_summary=plan_data.get("nutritional_summary", {}),
                duration_days=plan_data.get("duration_days", 7),
                is_active=True
            )
            
            # Deactivate other nutrition plans
            db.query(NutritionPlan).filter(
                NutritionPlan.user_id == client_id,
                NutritionPlan.is_active == True
            ).update({"is_active": False})
            
            db.add(nutrition_plan)
            db.commit()
            db.refresh(nutrition_plan)
            
            return {"message": "Nutrition plan assigned successfully", "plan_id": nutrition_plan.id}
            
        elif plan_type == "fitness":
            # Create fitness plan
            fitness_plan = FitnessPlan(
                user_id=client_id,
                title=plan_data.get("title", "Trainer-Assigned Fitness Plan"),
                description=plan_data.get("description", "Custom plan assigned by trainer"),
                plan_data=plan_data.get("plan_data", []),
                difficulty_level=plan_data.get("difficulty_level", "intermediate"),
                duration_weeks=plan_data.get("duration_weeks", 4),
                is_active=True
            )
            
            # Deactivate other fitness plans
            db.query(FitnessPlan).filter(
                FitnessPlan.user_id == client_id,
                FitnessPlan.is_active == True
            ).update({"is_active": False})
            
            db.add(fitness_plan)
            db.commit()
            db.refresh(fitness_plan)
            
            return {"message": "Fitness plan assigned successfully", "plan_id": fitness_plan.id}
            
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plan type. Must be 'nutrition' or 'fitness'"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to assign plan: {str(e)}"
        )

@router.put("/clients/{client_id}/update-plan/{plan_id}")
async def update_client_plan(
    client_id: int,
    plan_id: int,
    plan_updates: Dict[str, Any],
    current_trainer: User = Depends(require_trainer_role),
    db: Session = Depends(get_db)
):
    """Modify an existing client plan"""
    
    # Verify trainer has access to this client
    assignment = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == current_trainer.id,
        TrainerClient.client_id == client_id,
        TrainerClient.is_active == True
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Client not assigned to this trainer."
        )
    
    plan_type = plan_updates.get("plan_type")
    
    try:
        if plan_type == "nutrition":
            plan = db.query(NutritionPlan).filter(
                NutritionPlan.id == plan_id,
                NutritionPlan.user_id == client_id
            ).first()
            
            if not plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Nutrition plan not found"
                )
            
            # Update plan fields
            for field, value in plan_updates.items():
                if hasattr(plan, field) and field != "plan_type":
                    setattr(plan, field, value)
            
        elif plan_type == "fitness":
            plan = db.query(FitnessPlan).filter(
                FitnessPlan.id == plan_id,
                FitnessPlan.user_id == client_id
            ).first()
            
            if not plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Fitness plan not found"
                )
            
            # Update plan fields
            for field, value in plan_updates.items():
                if hasattr(plan, field) and field != "plan_type":
                    setattr(plan, field, value)
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plan type. Must be 'nutrition' or 'fitness'"
            )
        
        db.commit()
        return {"message": "Plan updated successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update plan: {str(e)}"
        )

@router.post("/assign-client")
async def assign_client_to_trainer(
    assignment: TrainerClientAssignment,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Assign a client to a trainer (admin function or self-assignment)"""
    
    # Check if user is admin or the trainer themselves
    if current_user.role not in ["admin", "trainer"] and current_user.id != assignment.trainer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    
    # Verify trainer exists and has trainer role
    trainer = db.query(User).filter(
        User.id == assignment.trainer_id,
        User.role.in_(["trainer", "admin"])
    ).first()
    
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found"
        )
    
    # Verify client exists
    client = db.query(User).filter(User.id == assignment.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check if assignment already exists
    existing_assignment = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == assignment.trainer_id,
        TrainerClient.client_id == assignment.client_id,
        TrainerClient.is_active == True
    ).first()
    
    if existing_assignment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client is already assigned to this trainer"
        )
    
    # Create new assignment
    new_assignment = TrainerClient(
        trainer_id=assignment.trainer_id,
        client_id=assignment.client_id,
        notes=assignment.notes,
        is_active=True
    )
    
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    
    return {"message": "Client assigned successfully", "assignment_id": new_assignment.id}

@router.post("/messages")
async def send_message_to_client(
    client_id: int,
    message: str,
    current_trainer: User = Depends(require_trainer_role),
    db: Session = Depends(get_db)
):
    """Send messages to clients (basic implementation)"""
    
    # Verify trainer has access to this client
    assignment = db.query(TrainerClient).filter(
        TrainerClient.trainer_id == current_trainer.id,
        TrainerClient.client_id == client_id,
        TrainerClient.is_active == True
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Client not assigned to this trainer."
        )
    
    # For now, we'll store messages as progress logs
    # In a full implementation, you'd have a separate messages table
    message_log = ProgressLog(
        user_id=client_id,
        log_type="trainer_message",
        metric_name="message_received",
        metric_value=1,
        metric_unit="message",
        additional_data={
            "trainer_id": current_trainer.id,
            "trainer_name": current_trainer.full_name,
            "message": message
        },
        notes=f"Message from trainer: {message}"
    )
    
    db.add(message_log)
    db.commit()
    
    return {"message": "Message sent successfully"}

@router.get("/available")
async def get_available_trainers(db: Session = Depends(get_db)):
    """Get a list of available trainers for client assignment"""
    
    trainers = db.query(User).filter(
        User.role.in_(["trainer", "admin"]),
        User.is_active == True
    ).all()
    
    trainer_info = []
    for trainer in trainers:
        # Count current clients
        client_count = db.query(TrainerClient).filter(
            TrainerClient.trainer_id == trainer.id,
            TrainerClient.is_active == True
        ).count()
        
        trainer_info.append({
            "id": trainer.id,
            "full_name": trainer.full_name,
            "email": trainer.email,
            "current_clients": client_count
        })
    
    return {"trainers": trainer_info}
