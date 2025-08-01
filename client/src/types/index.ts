export interface User {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  name: string
  description?: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  createdAt: string
  updatedAt: string
  userId: number
  tasks?: Task[]
  _count?: {
    tasks: number
  }
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  projectId: number
  project?: {
    id: number
    name: string
  }
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  status?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: string
  priority?: string
  dueDate?: string
  projectId: number
}

export interface AIGenerateTasksResponse {
  tasks: Array<{
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: 'todo'
  }>
  prompt: string
  projectName: string
}

export interface AIChatResponse {
  response: string
  message: string
  timestamp: string
}