import { Paper, Skeleton, Stack } from "@mui/material";

const LeaderboardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Paper
          key={index}
          elevation={4}
          sx={{
            mb: 2.5,
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            bgcolor: "#0a0a0a",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            {/* Left section → Rank + Username */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
              <Skeleton
                variant="rounded"
                width={40}
                height={25}
                sx={{ borderRadius: "8px", bgcolor: "grey.800" }}
              />
              <Skeleton
                variant="text"
                width={120}
                height={24}
                sx={{ bgcolor: "grey.800" }}
              />
            </Stack>

            {/* Right section → Stats */}
            <Stack direction="row" spacing={2}>
              <Skeleton
                variant="text"
                width={70}
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
              <Skeleton
                variant="text"
                width={70}
                height={20}
                sx={{ bgcolor: "grey.800" }}
              />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </>
  );
};

export default LeaderboardSkeleton;
