import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

const ExplorePromptCardSkeleton: React.FC = () => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#121212',
          border: '1px solid rgba(144,202,249,0.15)',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Image Skeleton */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ bgcolor: 'grey.900' }}
          />
        </Box>

        {/* Content Skeleton */}
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Title */}
          <Skeleton
            variant="text"
            width="70%"
            height={24}
            sx={{ bgcolor: 'grey.800', mb: 1 }}
          />

          {/* Content lines */}
          <Skeleton
            variant="text"
            width="100%"
            height={16}
            sx={{ bgcolor: 'grey.800', mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="95%"
            height={16}
            sx={{ bgcolor: 'grey.800', mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={16}
            sx={{ bgcolor: 'grey.800', mb: 2 }}
          />

          {/* Author */}
          <Skeleton
            variant="text"
            width="40%"
            height={14}
            sx={{ bgcolor: 'grey.800' }}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ExplorePromptCardSkeleton;
