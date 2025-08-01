import express from 'express';
import { OpenAI } from 'openai';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate tasks from natural language prompt
// @route   POST /api/ai/generate-tasks
// @access  Private
router.post('/generate-tasks', protect, async (req, res, next) => {
  try {
    const { prompt, projectName } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a prompt'
      });
    }

    const systemPrompt = `You are a project management AI assistant. Generate a list of tasks based on the user's request. 
    Return ONLY a JSON array of task objects with the following structure:
    [
      {
        "title": "Task title",
        "description": "Task description",
        "priority": "low|medium|high",
        "status": "todo"
      }
    ]
    
    Guidelines:
    - Generate 3-8 relevant tasks
    - Make tasks specific and actionable
    - Include appropriate priorities
    - Keep descriptions concise but informative
    - All tasks should start with status "todo"
    
    Project context: ${projectName || 'General project'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let tasks;
    try {
      tasks = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', completion.choices[0].message.content);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response'
      });
    }

    if (!Array.isArray(tasks)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response format from AI'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        tasks,
        prompt: prompt,
        projectName: projectName || 'General project'
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    next(error);
  }
});

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
router.post('/chat', protect, async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message'
      });
    }

    const systemPrompt = `You are a helpful project management AI assistant. You help users with:
    - Planning and organizing projects
    - Breaking down complex tasks
    - Providing productivity tips
    - Suggesting project management best practices
    - Helping with time management and prioritization
    
    Keep responses concise and actionable. If the user asks about specific projects or tasks, use the provided context.
    
    Current context: ${context ? JSON.stringify(context) : 'No specific project context'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        response,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    next(error);
  }
});

// @desc    Summarize project
// @route   POST /api/ai/summarize-project
// @access  Private
router.post('/summarize-project', protect, async (req, res, next) => {
  try {
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project data'
      });
    }

    const projectData = `
    Project: ${project.name}
    Description: ${project.description || 'No description'}
    Status: ${project.status}
    Total Tasks: ${project.tasks?.length || 0}
    
    Tasks:
    ${project.tasks?.map(task => 
      `- ${task.title} (${task.status}, ${task.priority} priority)`
    ).join('\n') || 'No tasks'}
    `;

    const systemPrompt = `You are a project management AI assistant. Provide a concise summary of the project including:
    - Overall progress assessment
    - Key achievements
    - Areas that need attention
    - Next recommended actions
    
    Keep the summary professional and actionable.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Summarize this project:\n${projectData}` }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const summary = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        summary,
        projectName: project.name,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    next(error);
  }
});

// @desc    Get project suggestions
// @route   POST /api/ai/project-suggestions
// @access  Private
router.post('/project-suggestions', protect, async (req, res, next) => {
  try {
    const { projectType, goals, timeframe } = req.body;

    const prompt = `Generate project management suggestions for:
    Type: ${projectType || 'General project'}
    Goals: ${goals || 'Not specified'}
    Timeframe: ${timeframe || 'Not specified'}
    
    Please provide specific, actionable recommendations.`;

    const systemPrompt = `You are a project management consultant. Provide structured advice including:
    - Project planning recommendations
    - Key milestones to consider
    - Risk mitigation strategies
    - Resource allocation tips
    - Success metrics to track
    
    Keep suggestions practical and implementable.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const suggestions = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        suggestions,
        projectType,
        goals,
        timeframe,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    next(error);
  }
});

export default router;