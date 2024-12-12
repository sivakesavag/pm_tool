from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Project, Task, Comment
from datetime import datetime, timedelta

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_can_login(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_wrong_credentials(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ProjectTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            status='planning',
            priority_level=1
        )
        self.project.team_members.add(self.user, through_defaults={'role': 'manager'})

    def test_create_project(self):
        url = reverse('project-list')
        data = {
            'name': 'New Project',
            'description': 'New Description',
            'status': 'planning',
            'priority_level': 1
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_list_projects(self):
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        data = {
            'name': 'Updated Project',
            'description': 'Updated Description'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Project')

class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            status='planning',
            priority_level=1
        )
        self.project.team_members.add(self.user, through_defaults={'role': 'manager'})
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            project=self.project,
            status='todo',
            priority=1
        )
        self.task.assignees.add(self.user)

    def test_create_task(self):
        url = reverse('task-list')
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'project': self.project.id,
            'status': 'todo',
            'priority': 1
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_list_tasks(self):
        url = reverse('task-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_task_status(self):
        url = reverse('task-detail', kwargs={'pk': self.task.pk})
        data = {'status': 'in_progress'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.status, 'in_progress')

class CommentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            status='planning',
            priority_level=1
        )
        self.project.team_members.add(self.user, through_defaults={'role': 'manager'})
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            project=self.project,
            status='todo',
            priority=1
        )
        self.task.assignees.add(self.user)
        self.comment = Comment.objects.create(
            task=self.task,
            content='Test Comment',
            user=self.user
        )

    def test_create_comment(self):
        url = reverse('comment-list')
        data = {
            'task': self.task.id,
            'content': 'New Comment'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_list_task_comments(self):
        url = reverse('task-comments', kwargs={'pk': self.task.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
