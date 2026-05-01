'use client';

import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';
import { useLanguage } from '@/context/LanguageContext';
import LanguageIcon from '@mui/icons-material/Language';

export default function LanguageHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      mb: 3,
      gap: 2
    }}>
      <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LanguageIcon fontSize="small" /> Select Language:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ 
            bgcolor: '#ffffff',
            color: '#1a1a1a', 
            fontWeight: 500,
            fontSize: '0.9rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF9933' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#138808' }
          }}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">हिंदी (Hindi)</MenuItem>
          <MenuItem value="Gujarati">ગુજરાતી (Gujarati)</MenuItem>
          <MenuItem value="Marathi">मराठी (Marathi)</MenuItem>
          <MenuItem value="Tamil">தமிழ் (Tamil)</MenuItem>
          <MenuItem value="Telugu">తెలుగు (Telugu)</MenuItem>
          <MenuItem value="Bengali">বাংলা (Bengali)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
