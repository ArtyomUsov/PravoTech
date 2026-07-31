import React from 'react'
import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material'
import { CalendarEvent } from '../../models/CalendarEvent'

const eventColors: Record<string, string> = {
  deadline: '#d32f2f',
  hearing: '#1976d2',
  meeting: '#00897b',
  reminder: '#757575',
}

const eventLabels: Record<string, string> = {
  deadline: 'Срок',
  hearing: 'Заседание',
  meeting: 'Встреча',
  reminder: 'Напоминание',
}

export const CalendarPanel = ({ events }: { events: CalendarEvent[] }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (sortedEvents.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: '#999' }}>
        <Typography variant="body2">Нет событий</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ px: 1, mb: 1, fontWeight: 600 }}>
        Календарь
      </Typography>
      <List dense disablePadding>
        {sortedEvents.map(event => (
          <ListItem
            key={event.id}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label={eventLabels[event.type]}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: eventColors[event.type],
                      color: '#fff',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                    {event.title}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {new Date(event.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                  })}
                  {event.priority === 'high' && ' • 🔴 Важно'}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}