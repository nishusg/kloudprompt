// src/components/skeletons/PromptDetailSkeleton.tsx
import React from 'react';
import { Box, Container, Stack, Paper, CircularProgress, Skeleton } from '@mui/material';

const PromptDetailSkeleton: React.FC = () => {
  return (
    <Paper sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Skeleton sx={{ height: 32, bgcolor: "grey.800", borderRadius: 1, width: '60%', mx: 'auto', mb: 1 }} />
          <Skeleton sx={{ height: 24, bgcolor: "grey.800", borderRadius: 1, width: '80%', mx: 'auto', mb: 1 }} />
          <Skeleton sx={{ height: 20, bgcolor: "grey.800", borderRadius: 1, width: '40%', mx: 'auto' }} />
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Skeleton sx={{ width: 80, height: 24, bgcolor: "grey.800", borderRadius: 1 }} />
        </Stack>

        {/* Prompt Content */}
        <Paper
          sx={{
            bgcolor: '#111',
            p: 2,
            borderRadius: 2,
            border: '1px solid #333',
            mb: 3,
            minHeight: 120,
          }}
        >
          <Skeleton sx={{ width: '100%', height: 100, bgcolor: "grey.800", borderRadius: 1 }} />
        </Paper>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} sx={{ width: 60, height: 24, bgcolor: "grey.800", borderRadius: 1 }} />
          ))}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {[...Array(2)].map((_, i) => (
            <Box key={i} sx={{ width: 40, height: 40, bgcolor: "grey.800", borderRadius: '50%' }} />
          ))}
        </Stack>

        {/* Comments */}
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Paper
              key={i}
              sx={{ bgcolor: '#111', p: 2, borderRadius: 2, border: '1px solid #333', minHeight: 60 }}
            >
              <Skeleton sx={{ width: '40%', height: 16, bgcolor: "grey.800", borderRadius: 1, mb: 1 }} />
              <Skeleton sx={{ width: '100%', height: 12, bgcolor: "grey.800", borderRadius: 1 }} />
            </Paper>
          ))}
        </Stack>

        {/* Loading indicator at bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="inherit" />
        </Box>
      </Container>
    </Paper>
  );
};

export default PromptDetailSkeleton;
