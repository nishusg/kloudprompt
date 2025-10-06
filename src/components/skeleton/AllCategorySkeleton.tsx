import React from "react";
import { Card, CardContent, CardMedia, Skeleton, Box, Stack } from "@mui/material";

const AllCategorySkeleton: React.FC = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: "0 0 260px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#121212",
        color: "#fff",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(144,202,249,0.15)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image Placeholder */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={180}
        sx={{ bgcolor: "grey.900" }}
      />

      {/* Text Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="70%"
          height={24}
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
          width="60%"
          height={16}
          sx={{ bgcolor: "grey.800", mb: 2 }}
        />

        {/* Footer (views/info) */}
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
      </CardContent>
    </Card>
  );
};

export default AllCategorySkeleton;
