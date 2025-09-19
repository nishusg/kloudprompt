import React from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  Skeleton,
  Avatar,
  Grid,
} from "@mui/material";

const PAGE_LIMIT = 5;

const UserProfileSkeleton: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* User Info Skeleton */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: "#111", borderRadius: 2 }}>
          <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="center">
            {/* Avatar Skeleton */}
            <Skeleton variant="circular">
              <Avatar sx={{ width: 100, height: 100 }} />
            </Skeleton>

            {/* Text Skeletons */}
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="25%" />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Stack>
        </Paper>

        {/* User Stats Skeleton */}
        <Box sx={{ display: "flex", gap: 3, mt: 2, mb: 3 }}>
          <Paper sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "#121212" }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </Paper>
          <Paper sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "#121212" }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </Paper>
        </Box>

        {/* Prompts Section Skeleton */}
        <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {[...Array(PAGE_LIMIT)].map((_, i) => (
            <Grid item xs={12} key={i}>
              <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#121212" }}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="60%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfileSkeleton;
