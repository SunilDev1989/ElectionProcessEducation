'use client';

import { Box, Typography, Paper, TextField, Button, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ReactMarkdown from 'react-markdown';

export default function ManifestoPage() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('gemma-2-2b-it');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manifestoText: text, modelId: selectedModel, language })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', pb: 8 }}>
      <Box mb={4} className="animate-in delay-1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
            <DocumentScannerIcon fontSize="large" color="primary" /> {t('manifesto')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
            Paste text from any political manifesto. Our AI will instantly extract core promises and evaluate their economic and legislative feasibility.
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 200, bgcolor: '#fff' }}>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading}
            sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <MenuItem value="gemma-2-2b-it">Gemma 2 2B (Balanced)</MenuItem>
            <MenuItem value="gemini-3.1-flash-lite-preview">Gemini Flash Lite (Limit: 500)</MenuItem>
            <MenuItem value="gemini-2.5-flash">Gemini 2.5 Flash (Limit: 20)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper className="tiranga-card glow-silver animate-in delay-2" sx={{ p: 4, mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="Paste manifesto text here (e.g., 'We promise to create 10 million jobs and double farmer income by 2029...')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 3, bgcolor: '#fff' }}
        />
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleAnalyze} 
          disabled={loading || text.length < 50}
          sx={{ 
            bgcolor: '#138808', 
            '&:hover': { bgcolor: '#0f6e06' },
            fontWeight: 700,
            px: 4
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('analyzeManifesto')}
        </Button>
      </Paper>

      {error && (
        <Typography color="error" sx={{ p: 3, bgcolor: 'rgba(211,47,47,0.1)', borderRadius: 2 }}>
          {error}
        </Typography>
      )}

      {analysis && (
        <Paper className="tiranga-card glow-saffron animate-in delay-1" sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 3, borderBottom: '2px solid #f0f0f0', pb: 2 }}>
            Analysis Report
          </Typography>
          <Box sx={{ 
            typography: 'body1', 
            '& h3': { color: '#1a1a1a', mt: 3, mb: 1 },
            '& ul': { pl: 3 },
            '& li': { mb: 2 },
            '& strong': { color: '#1a1a1a' }
          }}>
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
