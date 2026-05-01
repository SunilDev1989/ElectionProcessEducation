'use client';

import { Box, Typography, Paper, Grid, Card, CardContent, Chip, TextField, InputAdornment, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import candidatesData from '@/data/candidates.json';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const filteredCandidates = candidatesData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.constituency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3
    }).format(amount);
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box mb={4} className="animate-in delay-1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            {t('candidates')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mt: 1 }}>
            {t('candidatesDesc')}
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search candidates, parties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: '300px' }, bgcolor: '#fff', borderRadius: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            sx: { borderRadius: 2 }
          }}
        />
      </Box>

      {/* Compliance Disclaimer */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff4eb', borderLeft: '4px solid #FF9933', borderRadius: 2 }} className="animate-in delay-2">
        <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: t('complianceNotice') }}>
        </Typography>
      </Paper>

      <Grid container spacing={3} className="animate-in delay-3">
        {filteredCandidates.map((candidate) => (
          <Grid item xs={12} md={6} xl={4} key={candidate.id}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a' }}>{candidate.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 600, mt: 0.5 }}>
                      {candidate.party}
                    </Typography>
                  </Box>
                  <Chip 
                    label={candidate.constituency} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255, 153, 51, 0.1)', color: '#FF9933', fontWeight: 700, borderRadius: '8px' }} 
                  />
                </Box>
              </Box>

              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                
                {/* Financials */}
                <Box>
                  <Typography variant="overline" sx={{ color: '#9e9e9e', fontWeight: 700, letterSpacing: '0.05em' }}>{t('financialDec')}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box sx={{ flex: 1, p: 2, bgcolor: '#f4f6f8', borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccountBalanceIcon sx={{ color: '#138808', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: '#5f6368', fontWeight: 600 }}>{t('assets')}</Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a1a' }}>{formatCurrency(candidate.assets)}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2, bgcolor: '#f4f6f8', borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccountBalanceIcon sx={{ color: '#d32f2f', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: '#5f6368', fontWeight: 600 }}>{t('liabilities')}</Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a1a' }}>{formatCurrency(candidate.liabilities)}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Demographics & Criminal */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" sx={{ color: '#9e9e9e', fontWeight: 700, letterSpacing: '0.05em' }}>{t('education')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <SchoolIcon sx={{ color: '#5f6368', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>{candidate.education}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" sx={{ color: '#9e9e9e', fontWeight: 700, letterSpacing: '0.05em' }}>{t('criminalRecord')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {candidate.criminal_cases > 0 ? (
                        <Chip 
                          icon={<WarningIcon style={{ color: '#d32f2f' }} />} 
                          label={`${candidate.criminal_cases} ${t('pendingCases')}`} 
                          size="small"
                          sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f', fontWeight: 700, borderRadius: '8px', '& .MuiChip-icon': { color: '#d32f2f' } }} 
                        />
                      ) : (
                        <Chip 
                          icon={<SecurityIcon style={{ color: '#138808' }} />} 
                          label={t('cleanRecord')} 
                          size="small"
                          sx={{ bgcolor: 'rgba(19, 136, 8, 0.1)', color: '#138808', fontWeight: 700, borderRadius: '8px', '& .MuiChip-icon': { color: '#138808' } }} 
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Legislative Performance (If available) */}
                {candidate.attendance !== null && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="overline" sx={{ color: '#9e9e9e', fontWeight: 700, letterSpacing: '0.05em' }}>{t('legisPerf')}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HowToRegIcon sx={{ color: '#FF9933', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>{candidate.attendance}% {t('attendance')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GavelIcon sx={{ color: '#5f6368', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>{candidate.debates} {t('debates')}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
