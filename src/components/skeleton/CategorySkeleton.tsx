import { Grid, Paper, Skeleton } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        sx={{
          p: 2,
          bgcolor: "#1e1e1e",
          borderRadius: 3,
          border: "1px solid #333",
        }}
      >
        {/* Title Skeleton */}
        <Skeleton variant="text" width="70%" height={28} sx={{ bgcolor: "#333" }} />

        {/* Subtitle Skeleton */}
        <Skeleton variant="text" width="90%" sx={{ bgcolor: "#333", mt: 1 }} />

        {/* Rectangular Image/Block Skeleton */}
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{ bgcolor: "#333", mt: 2, borderRadius: 2 }}
        />
      </Paper>
    </Grid>
  );
};

export default CategorySkeleton;
