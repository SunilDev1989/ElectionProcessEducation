'use client';

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const drawerWidth = 280;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, path: '/' },
    { text: t('assistant'), icon: <SmartToyIcon />, path: '/assistant' },
    { text: t('candidates'), icon: <PeopleIcon />, path: '/candidates' },
    { text: t('pulse'), icon: <TimelineIcon />, path: '/pulse' },
    { text: t('map'), icon: <MapIcon />, path: '/map' },
    { text: t('manifesto'), icon: <DocumentScannerIcon />, path: '/manifesto' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '12px',
          background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 900 }}>V</Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
          Voter Intelligence<br/>Platform
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 1,
                bgcolor: isActive ? '#f4f6f8' : 'transparent',
                color: isActive ? '#1a1a1a' : '#5f6368',
                '&:hover': {
                  bgcolor: '#f4f6f8',
                  color: '#1a1a1a',
                }
              }}
            >
              <ListItemIcon sx={{
                color: isActive ? '#FF9933' : '#9e9e9e',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </ListItem>
          )
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Tooltip title="Gamification Demo: Users earn Civic Points by reading manifestos, completing voter education quizzes, and verifying their polling stations." placement="top" arrow>
          <Box sx={{ bgcolor: '#f4f6f8', p: 2, borderRadius: '16px', border: '1px solid #e0e0e0', cursor: 'help' }}>
            <Typography variant="caption" sx={{ color: '#5f6368', fontWeight: 600 }}>{t('civicScore')}</Typography>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 800 }}>850</Typography>
            <Typography variant="caption" sx={{ color: '#138808', fontWeight: 600 }}>{t('topVoters')}</Typography>
          </Box>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
