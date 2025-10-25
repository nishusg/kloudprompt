import { Typography, Paper, Avatar, Stack, Link, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PromptComment } from "../../models/Comment";
import { DefaultUserName } from "../../utils/Constants";
import { DeleteOutline } from "@mui/icons-material";

interface CommentItemProps {
  comment: PromptComment;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDelete,
}) => {
  const canDelete = currentUserId && comment.userId?._id === currentUserId;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 1,
        bgcolor: "#121212",
        border: "1px solid #333",
        borderRadius: 2,
      }}
      variant="outlined"
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: "#42a5f5", color: "#fff" }}>
          {(comment.userId?.userName || DefaultUserName).charAt(0).toUpperCase() || "A"}
        </Avatar>
        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#ccc" }}
            >
              {comment.userId?.userName ? (
                <Link
                  component={RouterLink}
                  to={`/users/${comment.userId._id}`}
                  sx={{
                    color: "#90caf9",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {comment.userId.userName}
                </Link>
              ) : (
                DefaultUserName
              )}
            </Typography>
            {canDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete?.(comment._id)}
                sx={{ color: "red" }}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            )}
          </Stack>

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
