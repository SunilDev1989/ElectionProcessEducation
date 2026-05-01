'use client';

import { Box, Typography, Paper } from '@mui/material';
import ChatBot from '@/components/ChatBot';

export default function AssistantPage() {
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', height: 'calc(100vh - 48px)' }}>
      <Box mb={4} className="animate-in delay-1">
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
          Voter Assistant
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
          Ask me anything about the Indian election process, Form 6, or checking your voter status.
        </Typography>
      </Box>
      <Paper className="tiranga-card glow-saffron animate-in delay-2" sx={{ height: 'calc(100% - 120px)', p: 0 }}>
        <ChatBot />
      </Paper>
    </Box>
  );
}
