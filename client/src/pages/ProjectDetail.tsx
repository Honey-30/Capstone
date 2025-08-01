import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Bot
} from 'lucide-react'
import { projectsAPI, tasksAPI, aiAPI } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { formatRelativeTime } from '../utils/date'
import type { Project, Task } from '../types'
import toast from 'react-hot-toast'

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return

      try {
        const response = await projectsAPI.getById(parseInt(id))
        if (response.success) {
          setProject(response.data)
        } else {
          toast.error('Project not found')
          navigate('/projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        toast.error('Failed to load project')
        navigate('/projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id, navigate])

  const handleDeleteProject = async () => {
    if (!project || !confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      await projectsAPI.delete(project.id)
      toast.success('Project deleted successfully')
      navigate('/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleGenerateTasks = async () => {
    if (!project) return

    setIsGeneratingTasks(true)

    try {
      const response = await aiAPI.generateTasks({
        prompt: `Generate tasks for a project called "${project.name}". ${project.description ? `Description: ${project.description}` : ''}`,
        projectName: project.name
      })

      if (response.success && response.data.tasks.length > 0) {
        // Create tasks using the bulk create endpoint
        await tasksAPI.bulkCreate({
          tasks: response.data.tasks.map(task => ({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            projectId: project.id
          })),
          projectId: project.id
        })

        toast.success(`Generated ${response.data.tasks.length} tasks successfully!`)
        
        // Refresh project data
        const updatedProject = await projectsAPI.getById(project.id)
        if (updatedProject.success) {
          setProject(updatedProject.data)
        }
      }
    } catch (error: any) {
      console.error('Error generating tasks:', error)
      toast.error('Failed to generate tasks')
    } finally {
      setIsGeneratingTasks(false)
    }
  }

  const getTasksByStatus = (status: string) => {
    return project?.tasks?.filter(task => task.status === status) || []
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  const todoTasks = getTasksByStatus('todo')
  const inProgressTasks = getTasksByStatus('in-progress')
  const completedTasks = getTasksByStatus('completed')
  const totalTasks = project.tasks?.length || 0
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className={`text-xs px-2 py-1 rounded-full ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : project.status === 'completed'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {project.status}
              </div>
              <span className="text-sm text-muted-foreground">
                Updated {formatRelativeTime(project.updatedAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateTasks}
            disabled={isGeneratingTasks}
          >
            {isGeneratingTasks ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Generating...
              </div>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                AI Generate Tasks
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate(`/projects/${project.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDeleteProject}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Kanban Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* To Do */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              To Do
              <span className="text-sm font-normal text-muted-foreground">
                ({todoTasks.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todoTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No tasks in this column
              </p>
            ) : (
              todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              In Progress
              <span className="text-sm font-normal text-muted-foreground">
                ({inProgressTasks.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {inProgressTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No tasks in this column
              </p>
            ) : (
              inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              Completed
              <span className="text-sm font-normal text-muted-foreground">
                ({completedTasks.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No tasks in this column
              </p>
            ) : (
              completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// Task Card Component
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            Due {formatRelativeTime(task.dueDate)}
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProjectDetail