# Agentic AI Project Management Assistant

A modern, full-stack project management application powered by AI. Built with React, Node.js, PostgreSQL, and OpenAI integration.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, update, delete, and organize projects
- **Task Management**: Comprehensive task tracking with status, priority, and due dates
- **AI Assistant**: Intelligent task generation and project planning assistance
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Beautiful, mobile-first UI with dark/light theme support

### AI-Powered Features
- **Task Generation**: Generate task lists from natural language descriptions
- **Project Planning**: Get AI-powered suggestions for project structure and timeline
- **Smart Prioritization**: AI-assisted task prioritization and deadline suggestions
- **Chat Interface**: Interactive AI assistant for project management advice

### Technical Features
- **Real-time Updates**: Instant synchronization across all project data
- **Drag & Drop**: Intuitive Kanban-style task management
- **Data Visualization**: Project progress tracking and analytics
- **Export/Import**: Project data export capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for navigation
- **Radix UI** components for accessibility
- **React Hook Form** for form management
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **Prisma** ORM for database management
- **PostgreSQL** database
- **JWT** for authentication
- **OpenAI API** for AI features
- **bcryptjs** for password hashing

### Development Tools
- **Vite** for fast development and building
- **ESLint** for code linting
- **TypeScript** for type safety
- **Concurrently** for running multiple processes

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-ai
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/project_management_db"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # OpenAI API
   OPENAI_API_KEY="your-openai-api-key-here"
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Client Configuration
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start:
   - Frontend development server on http://localhost:5173
   - Backend API server on http://localhost:5000

## 🎯 Usage

### Getting Started
1. Register a new account or log in with existing credentials
2. Create your first project from the dashboard
3. Use the AI assistant to generate initial tasks
4. Organize tasks using the drag-and-drop interface
5. Track progress and get AI-powered insights

### AI Assistant Features
- **Task Generation**: "Create tasks for a mobile app launch"
- **Project Planning**: "How should I structure a 3-month marketing campaign?"
- **Best Practices**: "What are key metrics for software development projects?"
- **Progress Analysis**: Get automated project summaries and recommendations

## 🏗️ Project Structure

```
project-management-ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Button, Input, etc.)
│   │   │   └── layout/     # Layout components (Navbar, Sidebar)
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── .env.example           # Environment variables template
└── package.json           # Root package.json for workspace
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/bulk` - Create multiple tasks

### AI Features
- `POST /api/ai/generate-tasks` - Generate tasks from prompt
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/summarize-project` - Get project summary
- `POST /api/ai/project-suggestions` - Get project planning suggestions

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables:
   - `VITE_API_URL`: Your backend API URL

### Backend (Render/Railway)
1. Connect your repository to your hosting platform
2. Set environment variables as specified in `.env.example`
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`

### Database (Neon/Supabase)
1. Create a PostgreSQL database instance
2. Update `DATABASE_URL` in your environment variables
3. Run `npx prisma db push` to create tables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔧 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend development server
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages

**Frontend (client/):**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend (server/):**
- `npm run dev` - Start with nodemon for auto-restart
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## 🌟 Features Roadmap

- [ ] **Real-time Collaboration**: Multi-user project collaboration
- [ ] **File Attachments**: Upload and manage project files
- [ ] **Time Tracking**: Built-in time tracking for tasks
- [ ] **Calendar Integration**: Sync with Google Calendar/Outlook
- [ ] **Notification System**: Email and in-app notifications
- [ ] **Project Templates**: Pre-built project templates
- [ ] **Advanced Analytics**: Detailed project performance metrics
- [ ] **Mobile App**: Native mobile applications
- [ ] **API Documentation**: Complete API documentation with Swagger
- [ ] **Third-party Integrations**: Slack, Trello, Jira integrations

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section for existing solutions
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce, expected behavior, and screenshots if applicable

## 🎉 Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations