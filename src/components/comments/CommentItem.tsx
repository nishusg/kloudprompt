// src/components/comments/CommentItem.tsx
import { Typography, Paper, Avatar, Stack, Link } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { PromptComment } from "../../models/Comment";
import { DefaultUserName } from "../../utils/Constants";

interface CommentItemProps {
  comment: PromptComment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 1,
        bgcolor: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: 2,
      }}
      variant="outlined"
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: "#3080cfff", color: "#fff" }}>
          {(comment.userId?.userName || DefaultUserName).charAt(0).toUpperCase() || "A"}
        </Avatar>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#ccc" }}>
            {comment.userId?.userName ?
            <Link
                component={RouterLink}
                to={`/users/${comment.userId._id}`}
                sx={{ color: '#90caf9', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
            {comment.userId.userName}
            </Link>
              : DefaultUserName}
          </Typography>
          <Typography variant="caption" sx={{ color: "#888" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mt: 0.5 }}>
            {comment.text}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
