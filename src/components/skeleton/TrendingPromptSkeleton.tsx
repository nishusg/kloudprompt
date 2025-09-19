import React from "react";
import { Paper, Skeleton, Stack } from "@mui/material";

const TrendingPromptSkeleton: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#121212",
      }}
    >
      <Stack spacing={1.5}>
        {/* Title line */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            sx={{ bgcolor: "grey.800", borderRadius: "6px" }}
          />
          <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: "grey.800" }} />
        </Stack>

        {/* Description */}
        <Skeleton variant="text" width="90%" height={18} sx={{ bgcolor: "grey.800" }} />
        <Skeleton variant="text" width="70%" height={18} sx={{ bgcolor: "grey.800" }} />

        {/* Author + views row */}
        <Stack direction="row" spacing={2}>
          <Skeleton variant="text" width="40%" height={16} sx={{ bgcolor: "grey.800" }} />
          <Skeleton variant="text" width="20%" height={16} sx={{ bgcolor: "grey.800", ml: "auto" }} />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TrendingPromptSkeleton;
