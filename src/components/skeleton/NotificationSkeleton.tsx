import React from "react";
import { Paper, Skeleton, Stack } from "@mui/material";

const NotificationSkeleton: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#0a0a0a",
      }}
    >
      <Stack spacing={1}>
        {/* Message line */}
        <Skeleton
          variant="text"
          width="80%"
          height={22}
          sx={{ bgcolor: "grey.800" }}
        />

        {/* Secondary info (username + timestamp) */}
        <Stack direction="row" spacing={2}>
          <Skeleton
            variant="text"
            width="40%"
            height={16}
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            sx={{ bgcolor: "grey.800", ml: "auto" }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NotificationSkeleton;
