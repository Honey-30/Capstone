import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles, Lightbulb, CheckSquare, BarChart3 } from 'lucide-react'
import { aiAPI } from '../services/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { formatDateTime } from '../utils/date'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI project management assistant. I can help you with:\n\n• Generating task lists from project descriptions\n• Prioritizing tasks and setting deadlines\n• Providing project planning advice\n• Analyzing project progress\n• Suggesting improvements\n\nHow can I help you today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiAPI.chat({
        message: inputMessage.trim(),
        context: null // TODO: Add project context if needed
      })

      if (response.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: response.data.timestamp
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    {
      icon: CheckSquare,
      title: 'Generate Tasks',
      prompt: 'Help me create a task list for launching a new mobile app'
    },
    {
      icon: BarChart3,
      title: 'Project Analysis',
      prompt: 'What are the key metrics I should track for a software development project?'
    },
    {
      icon: Lightbulb,
      title: 'Best Practices',
      prompt: 'What are some project management best practices for remote teams?'
    },
    {
      icon: Sparkles,
      title: 'Planning Help',
      prompt: 'How should I structure a 3-month marketing campaign project?'
    }
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-6 w-6" />
          </div>
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Your intelligent project management companion
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Chat</CardTitle>
              <CardDescription>
                Ask me anything about project management
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {formatDateTime(message.timestamp)}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Quick Prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Common project management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="flex items-start gap-3">
                    <prompt.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {prompt.prompt}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Be Specific</div>
                <div className="text-muted-foreground">
                  Provide context about your project, team size, and timeline for better suggestions.
                </div>
              </div>
              <div>
                <div className="font-medium">Ask Follow-ups</div>
                <div className="text-muted-foreground">
                  Don't hesitate to ask for clarification or more detailed explanations.
                </div>
              </div>
              <div>
                <div className="font-medium">Iterate</div>
                <div className="text-muted-foreground">
                  Refine the AI's suggestions by providing feedback and asking for alternatives.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default AIAssistant