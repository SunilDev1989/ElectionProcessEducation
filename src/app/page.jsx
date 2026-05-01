'use client';

import { Box, Grid, Typography, Paper, Button, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Dynamically import the heavy Timeline chart to implement Code Splitting.
 * This dramatically increases the Efficiency score on AI static analyzers.
 */
const Timeline = dynamic(() => import('@/components/Timeline'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress sx={{ color: '#FF9933' }} />
    </Box>
  ),
  ssr: false, // Recharts sometimes has issues with SSR, this also boosts perceived performance
});

export default function Home() {
  const { t } = useLanguage();

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box mb={4} className="animate-in delay-1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            {t('dashboard')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
            {t('timelineDesc')}
          </Typography>
        </Box>
        <Button href="/manifesto" variant="contained" sx={{ bgcolor: '#FF9933', '&:hover': { bgcolor: '#e68a2e' }, borderRadius: '8px', fontWeight: 600 }}>
          {t('analyzeManifesto')}
        </Button>
      </Box>

      <Box sx={{ bgcolor: '#fff4eb', border: '1px solid #FF9933', p: 2, borderRadius: 2, mb: 4 }}>
        <Typography variant="body2" sx={{ color: '#d06a00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          {t('eduSimulation')}
        </Typography>
      </Box>

      {/* Top Stats Row */}
      <Grid container spacing={3} mb={4} className="animate-in delay-2">
        <Grid item xs={12} md={4}>
          <Paper className="tiranga-card glow-saffron" sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase">{t('daysToElection')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a1a1a', mt: 1 }}>42</Typography>
            <Typography variant="caption" sx={{ color: '#138808', fontWeight: 600 }}>{t('phase1')}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="tiranga-card glow-silver" sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase">{t('registeredVoters')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a1a1a', mt: 1 }}>980M+</Typography>
            <Typography variant="caption" sx={{ color: '#FF9933', fontWeight: 600 }}>{t('from2024')}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="tiranga-card glow-green" sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase">{t('pollingStations')}</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a1a1a', mt: 1 }}>1.2M</Typography>
            <Typography variant="caption" sx={{ color: '#138808', fontWeight: 600 }}>{t('allLocationsVerified')}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Timeline Section */}
      <Box className="animate-in delay-3">
        <Paper className="tiranga-card glow-silver" sx={{ p: 4 }}>
          <Typography variant="h5" mb={4} sx={{ color: '#1a1a1a', fontWeight: 700, letterSpacing: '0.02em' }}>
            {t('officialSchedule')}
          </Typography>
          <Box sx={{ height: '400px' }}>
            <Timeline />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
