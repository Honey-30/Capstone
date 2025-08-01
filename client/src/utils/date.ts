import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'

export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(dateObj)) {
    return 'Today'
  }
  
  if (isTomorrow(dateObj)) {
    return 'Tomorrow'
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }
  
  return format(dateObj, 'MMM d, yyyy')
}

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM d, yyyy - h:mm a')
}