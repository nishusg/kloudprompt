import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { Prompt } from '../../models';

interface Props {
  prompts: Prompt[];
  currentStreak: number;
  maxStreak: number;
}

const PromptActivityGraph: React.FC<Props> = ({ prompts, currentStreak, maxStreak }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Prepare chart data based on selected time range
  const chartData = useMemo(() => {
    if (!prompts.length) return [];

    const today = new Date();
    let labels: string[] = [];

    if (timeRange === 'daily') {
      for (let i = 23; i >= 0; i--) {
        const d = new Date(today);
        d.setHours(today.getHours() - i, 0, 0, 0);
        const hourLabel = d.toLocaleDateString('en-CA') + ' ' + d.getHours().toString().padStart(2, '0') + ':00';
        labels.push(hourLabel);
      }
    } else if (timeRange === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(d.toLocaleDateString('en-CA')); // YYYY-MM-DD
      }
    } else if (timeRange === 'monthly') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(d.toLocaleDateString('en-CA'));
      }
    }

    const counts: Record<string, number> = {};
    prompts.forEach((p) => {
      const dateObj = new Date(p.createdAt);

      if (timeRange === 'daily') {
        const hourKey = dateObj.toLocaleDateString('en-CA') + ' ' + dateObj.getHours().toString().padStart(2, '0') + ':00';
        counts[hourKey] = (counts[hourKey] || 0) + 1;
      } else {
        const key = dateObj.toLocaleDateString('en-CA');
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return labels.map((label) => ({
      date: label,
      count: counts[label] || 0,
    }));
  }, [prompts, timeRange]);

  return (
    <Paper sx={{ p: 2, mb: 4, borderRadius: '16px', background: '#121212' }}>
      {/* Streak Counter */}
      <Typography variant="subtitle1" sx={{ color: '#42a5f5', mb: 0.5 }}>
        Current Streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#90caf9', mb: 2 }}>
        Max Streak: {maxStreak} {maxStreak === 1 ? 'day' : 'days'}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        Prompt Activity ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
      </Typography>

      {/* Time Range Selector */}
      <Stack direction="row" spacing={1} mb={2}>
        {['daily', 'weekly', 'monthly'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '50px',
              px: 2,
              fontWeight: 600,
              textTransform: 'capitalize',
              bgcolor: timeRange === range ? '#42a5f5' : 'transparent',
              color: timeRange === range ? '#000' : '#fff',
              borderColor: '#42a5f5',
              '&:hover': {
                bgcolor: '#42a5f5',
                color: '#000',
              },
            }}
            onClick={() => setTimeRange(range as 'daily' | 'weekly' | 'monthly')}
          >
            {range}
          </Button>
        ))}
      </Stack>

      {/* Line Chart */}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#333" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 12 }} />
            <YAxis tick={{ fill: '#fff', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#222',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#42a5f5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {prompts.length === 0 && (
        <Typography
          sx={{ mt: 1, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}
        >
          You haven’t created any prompts yet. Start posting to see your activity here!
        </Typography>
      )}
    </Paper>
  );
};

export default PromptActivityGraph;
