import React from 'react';
import { Grid, Skeleton, Box, Stack, Paper } from '@mui/material';

const PAGE_LIMIT = 5;

const ProfilePromptCardSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {[...Array(PAGE_LIMIT)].map((_, i) => (
        <Grid item xs={12} key={i}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#121212',
              border: '1px solid rgba(144,202,249,0.2)',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Image Placeholder */}
            <Skeleton
              variant="rectangular"
              width={100}
              height={100}
              sx={{
                bgcolor: 'grey.900',
                borderRadius: 2,
                flexShrink: 0,
                mr: 2,
              }}
            />

            {/* Right: Text Details */}
            <Box sx={{ flex: 1 }}>
              <Stack spacing={1}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={24}
                  sx={{ bgcolor: 'grey.800' }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={16}
                  sx={{ bgcolor: 'grey.800' }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={16}
                  sx={{ bgcolor: 'grey.800' }}
                />

                {/* Actions (e.g., Delete / Remove) */}
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Skeleton
                    variant="rounded"
                    width={50}
                    height={16}
                    sx={{ bgcolor: 'grey.800' }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={60}
                    height={16}
                    sx={{ bgcolor: 'grey.800' }}
                  />
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfilePromptCardSkeleton;
