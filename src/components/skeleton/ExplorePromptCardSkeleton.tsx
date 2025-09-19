import React from 'react';
import { Grid, Card, CardContent, Skeleton } from '@mui/material';

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
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="70%"
            height={28}
            sx={{ bgcolor: 'grey.800', mb: 1 }}
          />

          {/* Content Skeleton */}
          <Skeleton
            variant="text"
            width="100%"
            height={18}
            sx={{ bgcolor: 'grey.800', mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="95%"
            height={18}
            sx={{ bgcolor: 'grey.800', mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={18}
            sx={{ bgcolor: 'grey.800', mb: 2 }}
          />

          {/* Author Skeleton */}
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
