import { Grid, Paper, Skeleton, Box, Stack } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "#121212",
          color: "#fff",
          display: "flex",
          alignItems: "stretch",
          border: "1px solid rgba(144,202,249,0.15)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        {/* Left — Image Placeholder */}
        <Skeleton
          variant="rectangular"
          width={120}
          height={120}
          sx={{
            borderRadius: 2,
            bgcolor: "grey.900",
            mr: 2.5,
            flexShrink: 0,
          }}
        />

        {/* Right — Content Placeholder */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Skeleton
            variant="text"
            width="60%"
            height={22}
            sx={{ bgcolor: "grey.800", mb: 1 }}
          />

          {/* Description (3 lines) */}
          <Skeleton
            variant="text"
            width="100%"
            height={16}
            sx={{ bgcolor: "grey.800", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="95%"
            height={16}
            sx={{ bgcolor: "grey.800", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={16}
            sx={{ bgcolor: "grey.800", mb: 1.5 }}
          />

          {/* Footer (author + views) */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton
              variant="text"
              width="40%"
              height={14}
              sx={{ bgcolor: "grey.800" }}
            />
            <Skeleton
              variant="text"
              width="20%"
              height={14}
              sx={{ bgcolor: "grey.800", ml: "auto" }}
            />
          </Stack>
        </Box>
      </Paper>
    </Grid>
  );
};

export default CategorySkeleton;
