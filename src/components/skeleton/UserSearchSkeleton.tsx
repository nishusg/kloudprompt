import React from "react";
import { Skeleton, Paper, Stack, Avatar } from "@mui/material";

const UserSearchSkeleton: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        mb: 2.5,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: "#121212",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
        {/* Avatar Skeleton */}
        <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "grey.800" }} />

        {/* Username Skeleton */}
        <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: "grey.800" }} />
      </Stack>
    </Paper>
  );
};

export default UserSearchSkeleton;
