'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useLanguage } from '@/context/LanguageContext';

export default function Timeline() {
  const { t } = useLanguage();

  const data = [
    { name: t('t1'), daysLeft: 300, color: '#FF9933' },
    { name: t('t2'), daysLeft: 210, color: '#FFB366' },
    { name: t('t3'), daysLeft: 120, color: '#FFD700' },
    { name: t('t4'), daysLeft: 60, color: '#4CAF50' },
    { name: t('t5'), daysLeft: 30, color: '#138808' },
  ];
  return (
    <Box sx={{ width: '100%', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#5f6368', fontSize: 13, fontWeight: 500 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e0e0', borderRadius: 8, color: '#1a1a1a', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="daysLeft" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

Timeline.propTypes = {
  /** Optional custom styling for the timeline container */
  sx: PropTypes.object,
};
