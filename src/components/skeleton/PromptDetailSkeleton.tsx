// src/components/skeletons/PromptDetailSkeleton.tsx
import React from 'react';
import { Box, Container, Stack, Paper, Skeleton } from '@mui/material';

const PromptDetailSkeleton: React.FC = () => {
  return (
    <Paper
      sx={{
        bgcolor: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Skeleton
            variant="text"
            animation="wave"
            width="60%"
            height={32}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mb: 1, borderRadius: 1 }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="80%"
            height={24}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mb: 1, borderRadius: 1 }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="40%"
            height={20}
            sx={{ bgcolor: 'grey.800', mx: 'auto', borderRadius: 1 }}
          />
        </Box>

        {/* Image Section */}
        <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height={200}
            sx={{ bgcolor: 'grey.900', borderRadius: 2 }}
          />
        </Box>

        {/* Stats */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            width={100}
            height={24}
            sx={{ bgcolor: 'grey.800' }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            width={100}
            height={24}
            sx={{ bgcolor: 'grey.800' }}
          />
        </Stack>

        {/* Prompt Content */}
        <Paper
          sx={{
            bgcolor: '#111',
            p: 2,
            borderRadius: 2,
            border: '1px solid #333',
            mb: 3,
          }}
        >
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height={20}
            sx={{ bgcolor: 'grey.800', mb: 1 }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="95%"
            height={20}
            sx={{ bgcolor: 'grey.800', mb: 1 }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="85%"
            height={20}
            sx={{ bgcolor: 'grey.800' }}
          />
        </Paper>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              animation="wave"
              width={70}
              height={28}
              sx={{ bgcolor: 'grey.800', borderRadius: 1 }}
            />
          ))}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="circular"
              animation="wave"
              width={44}
              height={44}
              sx={{ bgcolor: 'grey.800' }}
            />
          ))}
        </Stack>

        {/* Comments */}
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Paper
              key={i}
              sx={{
                bgcolor: '#111',
                p: 2,
                borderRadius: 2,
                border: '1px solid #333',
                minHeight: 60,
              }}
            >
              <Skeleton
                variant="text"
                animation="wave"
                width="40%"
                height={16}
                sx={{ bgcolor: 'grey.800', mb: 1 }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="100%"
                height={12}
                sx={{ bgcolor: 'grey.800' }}
              />
            </Paper>
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

export default PromptDetailSkeleton;
