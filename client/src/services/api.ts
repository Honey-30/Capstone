import axios from 'axios'
import type { 
  AuthResponse, 
  ApiResponse, 
  User, 
  Project, 
  Task, 
  CreateProjectData, 
  CreateTaskData,
  AIGenerateTasksResponse,
  AIChatResponse
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  me: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/projects')
    return response.data
  },

  getById: async (id: number): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  create: async (data: CreateProjectData): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', data)
    return response.data
  },

  update: async (id: number, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },
}

// Tasks API
export const tasksAPI = {
  getByProject: async (projectId: number): Promise<ApiResponse<Task[]>> => {
    const response = await api.get(`/tasks/project/${projectId}`)
    return response.data
  },

  getById: async (id: number): Promise<ApiResponse<Task>> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  create: async (data: CreateTaskData): Promise<ApiResponse<Task>> => {
    const response = await api.post('/tasks', data)
    return response.data
  },

  update: async (id: number, data: Partial<CreateTaskData>): Promise<ApiResponse<Task>> => {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },

  bulkCreate: async (data: { tasks: CreateTaskData[]; projectId: number }): Promise<ApiResponse<{ count: number; message: string }>> => {
    const response = await api.post('/tasks/bulk', data)
    return response.data
  },
}

// AI API
export const aiAPI = {
  generateTasks: async (data: { prompt: string; projectName?: string }): Promise<ApiResponse<AIGenerateTasksResponse>> => {
    const response = await api.post('/ai/generate-tasks', data)
    return response.data
  },

  chat: async (data: { message: string; context?: any }): Promise<ApiResponse<AIChatResponse>> => {
    const response = await api.post('/ai/chat', data)
    return response.data
  },

  summarizeProject: async (data: { project: Project }): Promise<ApiResponse<{ summary: string; projectName: string; timestamp: string }>> => {
    const response = await api.post('/ai/summarize-project', data)
    return response.data
  },

  getProjectSuggestions: async (data: { projectType?: string; goals?: string; timeframe?: string }): Promise<ApiResponse<{ suggestions: string; projectType?: string; goals?: string; timeframe?: string; timestamp: string }>> => {
    const response = await api.post('/ai/project-suggestions', data)
    return response.data
  },
}

export default api