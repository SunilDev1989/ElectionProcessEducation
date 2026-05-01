'use client';

import { Box, Typography, Paper } from '@mui/material';
import PollingMap from '@/components/PollingMap';
import { useLanguage } from '@/context/LanguageContext';

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', height: 'calc(100vh - 48px)' }}>
      <Box mb={4} className="animate-in delay-1">
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
          {t('map')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
          {t('mapDesc')}
        </Typography>
      </Box>
      <Paper className="tiranga-card glow-green animate-in delay-2" sx={{ height: 'calc(100% - 120px)', p: 2 }}>
        <PollingMap />
      </Paper>
    </Box>
  );
}
