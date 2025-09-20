import React from 'react';
import { Grid, Skeleton, Paper } from '@mui/material';

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
                bgcolor: "#121212",
            }}
            >
            <Skeleton variant="text" width="50%" height={28} sx={{ bgcolor: "grey.800" }} />
            <Skeleton variant="text" width="80%" sx={{ bgcolor: "grey.800" }} />
            <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.800" }}  />
            </Paper>
        </Grid>
        ))}
    </Grid>
  );
};

export default ProfilePromptCardSkeleton;
