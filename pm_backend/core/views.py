from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from .models import (
    Project, Task, Resource, Timeline, Analytics, 
    Comment, ProjectMember
)
from .serializers import (
    UserSerializer, ProjectSerializer, TaskSerializer,
    ResourceSerializer, TimelineSerializer, AnalyticsSerializer,
    CommentSerializer, ProjectMemberSerializer
)
from .utils import (
    suggest_task_assignee,
    predict_project_completion,
    analyze_resource_utilization,
    calculate_user_workload
)

User = get_user_model()

def home(request):
    return HttpResponse("<h1>Welcome to the Project Management Tool</h1>")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'department', 'skills']

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        user = self.get_object()
        tasks = Task.objects.filter(assignees=user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def workload(self, request, pk=None):
        user = self.get_object()
        workload = calculate_user_workload(user)
        return Response({'workload_percentage': workload})

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'status']
    ordering_fields = ['start_date', 'end_date', 'priority_level']

    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        project = self.get_object()
        analytics = Analytics.objects.get(project=project)
        serializer = AnalyticsSerializer(analytics)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def timeline(self, request, pk=None):
        project = self.get_object()
        timeline = Timeline.objects.get(project=project)
        serializer = TimelineSerializer(timeline)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def predict_completion(self, request, pk=None):
        project = self.get_object()
        prediction = predict_project_completion(project)
        return Response(prediction)

    @action(detail=True, methods=['get'])
    def resource_analysis(self, request, pk=None):
        project = self.get_object()
        analysis = analyze_resource_utilization(project)
        return Response(analysis)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'status']
    ordering_fields = ['priority', 'created_at', 'updated_at']

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        task = self.get_object()
        user_ids = request.data.get('user_ids', [])
        users = User.objects.filter(id__in=user_ids)
        task.assignees.add(*users)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def suggest_assignees(self, request, pk=None):
        task = self.get_object()
        suggestions = suggest_task_assignee(task)
        serializer = UserSerializer(suggestions, many=True)
        return Response(serializer.data)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'resource_type', 'skills']

class TimelineViewSet(viewsets.ModelViewSet):
    queryset = Timeline.objects.all()
    serializer_class = TimelineSerializer
    permission_classes = [permissions.IsAuthenticated]

class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['content']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        parent_comment = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                task=parent_comment.task,
                parent=parent_comment
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ProjectMemberViewSet(viewsets.ModelViewSet):
    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'role']
