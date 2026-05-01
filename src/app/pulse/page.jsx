'use client';

import { Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Link, Select, MenuItem, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLanguage } from '@/context/LanguageContext';

export default function PulsePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('gemma-2-2b-it');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, modelId: selectedModel })
        });
        if (!res.ok) throw new Error('Failed to fetch pulse data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [language, selectedModel]);

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box mb={4} className="animate-in delay-1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            {t('pulse')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
            {t('pulseDesc')}
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading}
            sx={{ 
              color: 'text.secondary', 
              fontSize: '0.8rem',
              borderRadius: 2,
              height: 36,
              bgcolor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }
            }}
          >
            <MenuItem value="gemma-2-2b-it">Gemma 2 2B (15K/day)</MenuItem>
            <MenuItem value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite (500/day)</MenuItem>
            <MenuItem value="gemini-2.5-flash">Gemini 2.5 Flash (20/day)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress sx={{ color: '#FF9933' }} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ p: 3, bgcolor: 'rgba(211,47,47,0.1)', borderRadius: 2 }}>
          {error}
        </Typography>
      )}

      {data && (
        <Grid container spacing={4} className="animate-in delay-2">
          {/* AI Sentiment Analysis Box */}
          <Grid item xs={12}>
            <Paper className="tiranga-card glow-silver" sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <AutoAwesomeIcon sx={{ fontSize: 150 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: '#FF9933', fontWeight: 800, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AutoAwesomeIcon fontSize="small" /> {t('aiSentiment')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', lineHeight: 1.6, maxWidth: '900px' }}>
                {data.sentiment}
              </Typography>
            </Paper>
          </Grid>

          {/* Live News Feed */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" /> {t('latestNews')}
            </Typography>
            <Grid container spacing={3}>
              {data.articles.map((article, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Card sx={{ 
                    height: '100%', 
                    borderRadius: '16px', 
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="caption" sx={{ color: '#FF9933', fontWeight: 800, textTransform: 'uppercase' }}>
                        {article.source} • {new Date(article.pubDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1.5, lineHeight: 1.3 }}>
                        <Link href={article.link} target="_blank" rel="noopener" sx={{ color: '#1a1a1a', textDecoration: 'none', '&:hover': { color: '#FF9933' } }}>
                          {article.title}
                        </Link>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#5f6368', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
