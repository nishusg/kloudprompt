import React from "react";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Avatar,
  Grid,
} from "@mui/material";

const PAGE_LIMIT = 5;

const ProfileSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        py: 4,
        background: "#0a0a0a",
      }}
    >
      <Container maxWidth="md">
        {/* Profile Header Skeleton */}
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: "24px",
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Avatar */}
            <Skeleton variant="circular" sx={{ bgcolor: "grey.800" }}>
              <Avatar sx={{ width: 100, height: 100 }} />
            </Skeleton>

            {/* User Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="40%" height={32} sx={{ bgcolor: "grey.800" }} />
              <Skeleton variant="text" width="25%" sx={{ bgcolor: "grey.800" }} />
              <Skeleton variant="text" width="50%" sx={{ bgcolor: "grey.800" }} />
              <Skeleton variant="text" width="30%" sx={{ bgcolor: "grey.800" }} />
            </Box>
          </Stack>
        </Paper>

        {/* Stats Skeleton */}
        <Box sx={{ display: "flex", gap: 3, mt: 2, mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              borderRadius: 2,
              bgcolor: "#121212",
            }}
          >
            <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.800" }} />
            <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.800" }} />
          </Paper>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              borderRadius: 2,
              bgcolor: "#121212",
            }}
          >
            <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.800" }} />
            <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.800" }} />
          </Paper>
        </Box>

        {/* Graph Skeleton */}
        <Paper
          sx={{
            p: 2,
            mb: 4,
            borderRadius: "16px",
            background: "#121212",
          }}
        >
          {/* Streak Counter */}
          <Skeleton
            variant="text"
            width={180}
            height={24}
            sx={{ bgcolor: "grey.800", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={140}
            height={20}
            sx={{ bgcolor: "grey.800", mb: 2 }}
          />

          {/* Time Range Selector */}
          <Stack direction="row" spacing={1} mb={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={80}
                height={36}
                sx={{ borderRadius: "50px", bgcolor: "grey.800" }}
              />
            ))}
          </Stack>

          {/* Chart placeholder */}
          <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: "12px", bgcolor: "grey.800" }}
            />
          </Box>
        </Paper>

        {/* Prompts/Bookmarks List Skeleton */}
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
      </Container>
    </Box>
  );
};

export default ProfileSkeleton;
