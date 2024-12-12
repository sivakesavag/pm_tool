from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Project, Task, Resource, Timeline, Analytics, 
    Comment, ProjectMember
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'department', 'skills', 'availability_status', 
                 'working_hours', 'performance_metrics']
        read_only_fields = ['performance_metrics']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'content', 'parent', 'replies',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_replies(self, obj):
        if obj.parent is None:  # Only get replies for parent comments
            replies = Comment.objects.filter(parent=obj)
            return CommentSerializer(replies, many=True).data
        return []

class TaskSerializer(serializers.ModelSerializer):
    assignees = UserSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'project', 'title', 'description', 'priority',
                 'status', 'progress', 'assignees', 'dependencies',
                 'estimated_hours', 'actual_hours', 'attachments',
                 'custom_fields', 'comments', 'start_date', 'due_date',
                 'completed_at', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'completed_at']

class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectMember
        fields = ['id', 'project', 'user', 'role', 'joined_at']
        read_only_fields = ['joined_at']

class ProjectSerializer(serializers.ModelSerializer):
    team_members = ProjectMemberSerializer(source='projectmember_set', many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'end_date',
                 'status', 'health_indicator', 'team_members', 'tasks',
                 'budget_allocation', 'priority_level', 'client_information',
                 'documentation_links', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'resource_type', 'availability',
                 'cost_per_hour', 'allocation_details', 'skills',
                 'utilization_metrics', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeline
        fields = ['id', 'project', 'milestones', 'dependencies',
                 'critical_path', 'delay_tracking', 'schedule_adjustments',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['id', 'project', 'performance_metrics',
                 'resource_utilization', 'budget_tracking',
                 'progress_indicators', 'risk_assessments',
                 'predictive_insights', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
