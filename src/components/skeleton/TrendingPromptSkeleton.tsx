import React from "react";
import { Paper, Skeleton, Stack, Box } from "@mui/material";

const TrendingPromptSkeleton: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#121212",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Left side - Image Skeleton */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: 2,
          mr: 2.5,
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ bgcolor: "grey.800" }}
        />
      </Box>

      {/* Right side - Content Skeleton */}
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        {/* Title with rank */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            animation="wave"
            sx={{ bgcolor: "grey.800", borderRadius: "6px" }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={24}
            animation="wave"
            sx={{ bgcolor: "grey.800" }}
          />
        </Stack>

        {/* Description lines */}
        <Skeleton
          variant="text"
          width="90%"
          height={18}
          animation="wave"
          sx={{ bgcolor: "grey.800" }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={18}
          animation="wave"
          sx={{ bgcolor: "grey.800" }}
        />

        {/* Author + Views */}
        <Stack direction="row" spacing={2}>
          <Skeleton
            variant="text"
            width="40%"
            height={16}
            animation="wave"
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="text"
            width="20%"
            height={16}
            animation="wave"
            sx={{ bgcolor: "grey.800", ml: "auto" }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TrendingPromptSkeleton;
