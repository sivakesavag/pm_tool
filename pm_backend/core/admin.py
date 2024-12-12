from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Project, Task, Resource, Timeline,
    Analytics, Comment, ProjectMember
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'department', 'availability_status')
    list_filter = ('department', 'availability_status')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('department', 'skills', 'availability_status', 'working_hours', 'performance_metrics')}),
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'health_indicator', 'priority_level', 'start_date', 'end_date')
    list_filter = ('status', 'health_indicator', 'priority_level')
    search_fields = ('name', 'description')
    date_hierarchy = 'start_date'

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'priority', 'progress')
    list_filter = ('status', 'priority', 'project')
    search_fields = ('title', 'description')
    filter_horizontal = ('assignees', 'dependencies')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'resource_type', 'cost_per_hour')
    list_filter = ('resource_type',)
    search_fields = ('name',)

@admin.register(Timeline)
class TimelineAdmin(admin.ModelAdmin):
    list_display = ('project', 'created_at', 'updated_at')
    search_fields = ('project__name',)

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('project', 'created_at', 'updated_at')
    search_fields = ('project__name',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'created_at')
    list_filter = ('task__project', 'user')
    search_fields = ('content', 'task__title')

@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'role', 'joined_at')
    list_filter = ('role', 'project')
    search_fields = ('user__username', 'project__name')
