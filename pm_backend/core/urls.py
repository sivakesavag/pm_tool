from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserViewSet, ProjectViewSet, TaskViewSet,
    ResourceViewSet, TimelineViewSet, AnalyticsViewSet,
    CommentViewSet, ProjectMemberViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'timelines', TimelineViewSet)
router.register(r'analytics', AnalyticsViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'project-members', ProjectMemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
