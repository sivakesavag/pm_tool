from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    department = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=dict)
    availability_status = models.CharField(max_length=50, default='available')
    working_hours = models.JSONField(default=dict)
    performance_metrics = models.JSONField(default=dict)

    class Meta:
        db_table = 'pm_user'

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='planning')
    health_indicator = models.CharField(max_length=50, default='good')
    team_members = models.ManyToManyField(User, through='ProjectMember')
    budget_allocation = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    priority_level = models.IntegerField(default=1)
    client_information = models.JSONField(default=dict)
    documentation_links = models.JSONField(default=list)
    vector_embedding = models.BinaryField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    joined_at = models.DateTimeField(auto_now_add=True)

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.IntegerField(default=1)
    status = models.CharField(max_length=50, default='todo')
    progress = models.IntegerField(default=0)
    assignees = models.ManyToManyField(User, related_name='assigned_tasks')
    dependencies = models.ManyToManyField('self', symmetrical=False, blank=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    actual_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    attachments = models.JSONField(default=list)
    custom_fields = models.JSONField(default=dict)
    vector_embedding = models.BinaryField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != 'completed':
            self.completed_at = None
        super().save(*args, **kwargs)

class Resource(models.Model):
    name = models.CharField(max_length=200)
    resource_type = models.CharField(max_length=50)  # human/material
    availability = models.JSONField(default=dict)
    cost_per_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    allocation_details = models.JSONField(default=dict)
    skills = models.JSONField(default=list)
    utilization_metrics = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Timeline(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    milestones = models.JSONField(default=list)
    dependencies = models.JSONField(default=list)
    critical_path = models.JSONField(default=list)
    delay_tracking = models.JSONField(default=dict)
    schedule_adjustments = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Analytics(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    performance_metrics = models.JSONField(default=dict)
    resource_utilization = models.JSONField(default=dict)
    budget_tracking = models.JSONField(default=dict)
    progress_indicators = models.JSONField(default=dict)
    risk_assessments = models.JSONField(default=dict)
    predictive_insights = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.task.title}'
