from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from core.models import Project, Task, Resource, Timeline, Analytics, Comment
import random
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating dummy data...')

        # Create users
        users_data = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'department': 'Development',
                'skills': {'python': 5, 'react': 4, 'django': 4},
            },
            {
                'username': 'jane_smith',
                'email': 'jane@example.com',
                'password': 'password123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'department': 'Design',
                'skills': {'ui_design': 5, 'ux_research': 4, 'figma': 5},
            },
            {
                'username': 'bob_wilson',
                'email': 'bob@example.com',
                'password': 'password123',
                'first_name': 'Bob',
                'last_name': 'Wilson',
                'department': 'Project Management',
                'skills': {'agile': 5, 'scrum': 4, 'risk_management': 4},
            },
        ]

        users = []
        for user_data in users_data:
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                department=user_data['department'],
                skills=user_data['skills'],
            )
            users.append(user)

        # Create projects
        projects_data = [
            {
                'name': 'E-commerce Platform',
                'description': 'Building a modern e-commerce platform with React and Django',
                'status': 'in_progress',
                'health_indicator': 'good',
                'priority_level': 1,
            },
            {
                'name': 'Mobile App Development',
                'description': 'Developing a mobile app for inventory management',
                'status': 'planning',
                'health_indicator': 'warning',
                'priority_level': 2,
            },
            {
                'name': 'Website Redesign',
                'description': 'Redesigning company website with modern UI/UX',
                'status': 'completed',
                'health_indicator': 'good',
                'priority_level': 3,
            },
        ]

        projects = []
        for project_data in projects_data:
            project = Project.objects.create(
                **project_data,
                start_date=timezone.now() - timedelta(days=random.randint(1, 30)),
                end_date=timezone.now() + timedelta(days=random.randint(30, 90)),
            )
            project.team_members.add(*random.sample(users, random.randint(1, 3)))
            projects.append(project)

        # Create tasks
        task_statuses = ['todo', 'in_progress', 'review', 'completed']
        for project in projects:
            for i in range(random.randint(3, 7)):
                task = Task.objects.create(
                    project=project,
                    title=f'Task {i+1} for {project.name}',
                    description=f'Description for task {i+1}',
                    priority=random.randint(1, 3),
                    status=random.choice(task_statuses),
                    progress=random.randint(0, 100),
                    estimated_hours=random.randint(4, 40),
                    actual_hours=random.randint(4, 40),
                )
                task.assignees.add(*random.sample(users, random.randint(1, 2)))

                # Add comments
                for _ in range(random.randint(1, 3)):
                    Comment.objects.create(
                        task=task,
                        user=random.choice(users),
                        content=f'This is a comment on task {task.title}',
                    )

        # Create resources
        resource_types = ['hardware', 'software', 'human']
        for _ in range(5):
            Resource.objects.create(
                name=f'Resource {_+1}',
                resource_type=random.choice(resource_types),
                cost_per_hour=random.randint(50, 200),
                availability={'monday': '9-17', 'tuesday': '9-17', 'wednesday': '9-17'},
                skills=['python', 'react', 'django'] if _ % 2 == 0 else ['design', 'research'],
            )

        # Create analytics
        for project in projects:
            Analytics.objects.create(
                project=project,
                performance_metrics={
                    'completion_rate': random.randint(60, 95),
                    'team_velocity': random.randint(10, 30),
                    'bug_count': random.randint(0, 10),
                },
                resource_utilization={
                    'development': random.randint(70, 90),
                    'design': random.randint(60, 85),
                    'testing': random.randint(50, 80),
                },
                risk_assessments={
                    'technical_risk': 'low',
                    'schedule_risk': 'medium',
                    'budget_risk': 'low',
                },
            )

            # Create timeline
            Timeline.objects.create(
                project=project,
                milestones=[
                    {
                        'name': 'Project Start',
                        'date': (timezone.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                    },
                    {
                        'name': 'Phase 1 Complete',
                        'date': (timezone.now() + timedelta(days=random.randint(15, 45))).isoformat(),
                    },
                    {
                        'name': 'Project End',
                        'date': (timezone.now() + timedelta(days=random.randint(60, 90))).isoformat(),
                    },
                ],
            )

        self.stdout.write(self.style.SUCCESS('Successfully created dummy data'))
