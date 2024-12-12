# Project Management Tool

A modern project management tool built with Next.js (frontend) and Django (backend).

## 🚀 Features

- User Authentication (JWT-based)
- Project Management
- Task Tracking
- Team Collaboration
- Analytics Dashboard
- Resource Management

## 🛠️ Tech Stack

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (API Client)
- Chart.js (Data Visualization)

### Backend
- Django 4+
- Django REST Framework
- PostgreSQL (Production)
- SQLite (Development)
- JWT Authentication

## 🏗️ Setup

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL (for production)

### Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd pm_tool
```

2. Frontend Setup:
```bash
# Install dependencies
cd src
npm install

# Create .env.local file
cp .env.example .env.local
```

3. Backend Setup:
```bash
# Create virtual environment
cd pm_backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

4. Database Setup:
```bash
# Development (SQLite)
python manage.py migrate

# Production (PostgreSQL)
# Update DATABASE_URL in .env first
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Load demo data (optional):
```bash
python manage.py populate_dummy_data
```

## 🚀 Running the Application

### Development
1. Start the backend:
```bash
cd pm_backend
python manage.py runserver
```

2. Start the frontend:
```bash
cd src
npm run dev
```

### Production
1. Build the frontend:
```bash
cd src
npm run build
```

2. Configure your web server (nginx/apache) to serve the Django application
3. Set up PostgreSQL database
4. Update environment variables
5. Run migrations
6. Collect static files:
```bash
python manage.py collectstatic
```

## 🧪 Testing

### Backend Tests
```bash
cd pm_backend
python manage.py test
```

### Frontend Tests
```bash
cd src
npm run test
```

## 📝 API Documentation

API documentation is available at `/api/docs/` when running the backend server.

## 🔐 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 📦 Database Configuration

The application uses:
- SQLite for development (default)
- PostgreSQL for production (recommended)

To switch to PostgreSQL in development:
1. Update DATABASE_URL in .env
2. Install psycopg2: `pip install psycopg2-binary`
3. Run migrations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
