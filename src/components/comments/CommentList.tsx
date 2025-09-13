import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Stack,
  TextField,
  Paper,
  Alert,
} from "@mui/material";
import {
  getComments,
  addCommentToPrompt,
  deleteComment,
} from "../../services/CommentService";
import { PromptComment } from "../../models/Comment";
import { CommentItem } from "./CommentItem";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

interface CommentListProps {
  promptId: string;
  limit?: number;
}

export const CommentList: React.FC<CommentListProps> = ({ promptId, limit = 5 }) => {
  const { isAuthenticated, user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [comments, setComments] = useState<PromptComment[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Reset when promptId changes
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [promptId]);

  // Load comments whenever page changes
  useEffect(() => {
    if (!promptId || !hasMore) return;
    const loadComments = async () => {
      setLoading(true);
      try {
        const res = await getComments(promptId, page, limit);
        const commentArray = Array.isArray(res.comments) ? res.comments : [];

        if (commentArray.length < limit) setHasMore(false);
        setComments((prev) => [...prev, ...commentArray]);
        setTotalCount(res.totalCount);
      } catch (err: any) {
        console.error("Failed to load comments", err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [promptId, page, limit, hasMore]);

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;
    try {
      setIsCommenting(true);
      const createdComment = await addCommentToPrompt(promptId, newComment.trim());

      setComments((prev) => [createdComment, ...prev]);
      setTotalCount((prev) => prev + 1);
      setNewComment("");
      showSnackbar("Comment added successfully!", "success");
    } catch (err: any) {
      console.error("Failed to add comment", err);
      showSnackbar("Failed to add comment", "error");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setTotalCount((prev) => prev - 1);
      showSnackbar("Comment deleted successfully!", "success");
    } catch (err: any) {
      console.error("Failed to delete comment", err);
      showSnackbar("Failed to delete comment", "error");
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Comments ({totalCount})
      </Typography>

      {/* Add Comment */}
      {isAuthenticated ? (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#121212",
            borderColor: "#333",
            mb: 2,
          }}
          variant="outlined"
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={`Comment as ${user?.userName}`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isCommenting}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            disabled={isCommenting}
          >
            {isCommenting ? (
              <CircularProgress size={24} sx={{ color: "#000" }} />
            ) : (
              "Post Comment"
            )}
          </Button>
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            bgcolor: "#121212",
            color: "#fff",
            border: "1px solid #333",
            mb: 2,
          }}
        >
          You must be{" "}
          <a href="/login" style={{ color: "#90caf9" }}>
            logged in
          </a>{" "}
          to post a comment.
        </Alert>
      )}

      {/* Comments List */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <Typography color="inherit">Be the first to comment!</Typography>
        )}
      </Stack>

      {loading && (
        <CircularProgress
          size={24}
          sx={{ display: "block", mx: "auto", my: 2 }}
        />
      )}

      {hasMore && !loading && comments.length > 0 && (
        <Button
          onClick={handleLoadMore}
          sx={{ display: "block", mx: "auto", mb: 2 }}
        >
          Load More
        </Button>
      )}
    </Box>
  );
};
