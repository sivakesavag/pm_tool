from typing import List, Dict, Any
from django.contrib.auth import get_user_model
from .models import Task, User, Project

User = get_user_model()

def calculate_user_workload(user: User) -> float:
    """Calculate current workload percentage for a user based on assigned tasks."""
    assigned_tasks = Task.objects.filter(assignees=user)
    total_hours = sum(task.estimated_hours for task in assigned_tasks)
    # Assuming 8 working hours per day
    workload_percentage = (total_hours / (8 * 5)) * 100  # Weekly workload
    return min(workload_percentage, 100)

def suggest_task_assignee(task: Task) -> List[User]:
    """Suggest best users for a task based on skills and workload."""
    required_skills = task.custom_fields.get('required_skills', [])
    
    # Find users with matching skills
    potential_users = User.objects.filter(skills__has_any_keys=required_skills)
    
    # Calculate scores based on skill match and current workload
    user_scores = []
    for user in potential_users:
        skill_match = len(set(user.skills.keys()) & set(required_skills))
        workload = calculate_user_workload(user)
        
        # Score formula: skill match weighted higher than available capacity
        score = (skill_match * 0.7) + ((100 - workload) * 0.3)
        user_scores.append((user, score))
    
    # Sort by score and return top 3 users
    return [user for user, _ in sorted(user_scores, key=lambda x: x[1], reverse=True)[:3]]

def predict_project_completion(project: Project) -> Dict[str, Any]:
    """Predict project completion date and potential delays."""
    tasks = Task.objects.filter(project=project)
    total_tasks = tasks.count()
    completed_tasks = tasks.filter(status='completed').count()
    
    if total_tasks == 0:
        return {
            'completion_percentage': 0,
            'estimated_completion_date': project.end_date,
            'risk_level': 'unknown'
        }
    
    completion_percentage = (completed_tasks / total_tasks) * 100
    
    # Calculate average task completion time
    completed_tasks_list = tasks.filter(status='completed')
    if completed_tasks_list.exists():
        avg_completion_time = sum(
            (task.updated_at - task.created_at).days 
            for task in completed_tasks_list
        ) / completed_tasks_list.count()
    else:
        avg_completion_time = 0
    
    # Estimate remaining time
    remaining_tasks = total_tasks - completed_tasks
    estimated_remaining_days = remaining_tasks * avg_completion_time
    
    from datetime import datetime, timedelta
    estimated_completion_date = datetime.now() + timedelta(days=estimated_remaining_days)
    
    # Calculate risk level
    if project.end_date:
        days_until_deadline = (project.end_date.date() - datetime.now().date()).days
        if estimated_remaining_days > days_until_deadline:
            risk_level = 'high'
        elif estimated_remaining_days > days_until_deadline * 0.7:
            risk_level = 'medium'
        else:
            risk_level = 'low'
    else:
        risk_level = 'unknown'
    
    return {
        'completion_percentage': completion_percentage,
        'estimated_completion_date': estimated_completion_date,
        'risk_level': risk_level,
        'estimated_remaining_days': estimated_remaining_days
    }

def analyze_resource_utilization(project: Project) -> Dict[str, Any]:
    """Analyze resource utilization and efficiency."""
    tasks = Task.objects.filter(project=project)
    team_members = project.team_members.all()
    
    utilization_data = {
        'team_utilization': {},
        'project_metrics': {
            'total_estimated_hours': 0,
            'total_actual_hours': 0,
            'overall_efficiency': 0,
            'average_utilization': 0
        }
    }
    
    total_utilization = 0
    for member in team_members:
        member_tasks = tasks.filter(assignees=member)
        if member_tasks.exists():
            estimated_hours = sum(task.estimated_hours for task in member_tasks)
            actual_hours = sum(task.actual_hours for task in member_tasks)
            
            utilization_data['project_metrics']['total_estimated_hours'] += float(estimated_hours)
            utilization_data['project_metrics']['total_actual_hours'] += float(actual_hours)
            
            if estimated_hours > 0:
                efficiency = (estimated_hours / actual_hours * 100) if actual_hours > 0 else 100
                utilization = calculate_user_workload(member)
                total_utilization += utilization
            else:
                efficiency = 0
                utilization = 0
                
            utilization_data['team_utilization'][member.username] = {
                'estimated_hours': float(estimated_hours),
                'actual_hours': float(actual_hours),
                'efficiency': round(efficiency, 2),
                'utilization': round(utilization, 2),
                'skills': member.skills
            }
    
    # Calculate project-level metrics
    if utilization_data['project_metrics']['total_actual_hours'] > 0:
        utilization_data['project_metrics']['overall_efficiency'] = round(
            (utilization_data['project_metrics']['total_estimated_hours'] / 
             utilization_data['project_metrics']['total_actual_hours']) * 100, 2
        )
    
    if team_members.count() > 0:
        utilization_data['project_metrics']['average_utilization'] = round(
            total_utilization / team_members.count(), 2
        )
    
    return utilization_data
