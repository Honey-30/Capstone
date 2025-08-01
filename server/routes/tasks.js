import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.projectId);

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.user.id
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide task title and project ID'
      });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId)
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, status, priority, dueDate } = req.body;

    // Check if task exists and user owns the project
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.user.id
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const task = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);

    // Check if task exists and user owns the project
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.user.id
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId
      }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk create tasks
// @route   POST /api/tasks/bulk
// @access  Private
router.post('/bulk', protect, async (req, res, next) => {
  try {
    const { tasks, projectId } = req.body;

    if (!tasks || !Array.isArray(tasks) || !projectId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide tasks array and project ID'
      });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const createdTasks = await prisma.task.createMany({
      data: tasks.map(task => ({
        title: task.title,
        description: task.description || null,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        projectId: parseInt(projectId)
      }))
    });

    res.status(201).json({
      success: true,
      data: {
        count: createdTasks.count,
        message: `${createdTasks.count} tasks created successfully`
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;