// src/pages/PromptDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById, toggleBookmarkPrompt } from '../services/PromptService';
import { addCommentToPrompt } from '../services/CommentService';
import { useAuth } from '../context/AuthContext';
import { Prompt } from '../models/Prompt';
import { PromptComment } from '../models/Comment';

import {
  Container, Typography, Button, CircularProgress, Box, Chip, TextField,
  Avatar, Stack, Alert, Divider, Paper, Snackbar, IconButton, Tooltip
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [comments, setComments] = useState<PromptComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const promptData = await getPromptById(id);
        setPrompt(promptData);
        setComments(promptData.comments || []);
      } catch (err) {
        setError('Failed to fetch prompt data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookmark = async () => {
    if (!prompt || !isAuthenticated) return;

    try {
      setBookmarkLoading(true);

      // Optimistically update the UI
      setPrompt(prev =>
        prev
          ? {
              ...prev,
              isBookmarkedByCurrentUser: !prev.isBookmarkedByCurrentUser
            }
          : prev
      );

      // Call backend to toggle
      await toggleBookmarkPrompt(prompt._id);

    } catch (err) {
      console.error("Failed to toggle bookmark", err);
      // Rollback if needed
      setPrompt(prev =>
        prev
          ? {
              ...prev,
              isBookmarkedByCurrentUser: !prev.isBookmarkedByCurrentUser
            }
          : prev
      );
    } finally {
      setBookmarkLoading(false);
    }
  };


  const handleAddComment = async () => {
    if (!newComment.trim() || !prompt || !isAuthenticated) return;
    try {
      setIsCommenting(true);

      const createdComment = await addCommentToPrompt(prompt._id, newComment.trim());

      setComments(prev => [
        ...prev,
        {
          ...createdComment,
          text: newComment, // Ensure the UI has text
          createdAt: new Date(), // Immediate timestamp for display
          updatedAt: new Date(),
          author: user!, // Current logged-in user object
        } as PromptComment
      ]);

      setNewComment('');
    } finally {
      setIsCommenting(false);
    }
  };


  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/prompts/${prompt?._id}`;
      await navigator.clipboard.writeText(shareUrl);
      setSnackbarMsg('Link copied to clipboard!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleCopyContent = async () => {
    if (!prompt?.content) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setSnackbarMsg('Prompt content copied!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy prompt content', err);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  if (!prompt)
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Prompt not found.</Alert>
      </Container>
    );

  return (
    <Box sx={{ bgcolor: '#0d0d0d', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {prompt.title}
          </Typography>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
          <Typography variant="subtitle1" sx={{ color: '#bbb' }}>
            {prompt.description}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#bbb' }}>
            By <strong>{prompt.author?.userName || 'anonymous'}</strong> • {formatDate(prompt.createdAt)}
          </Typography>
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#aaa' }}>
            <VisibilityIcon fontSize="small" /> <Typography variant="body2">{prompt.views} views</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#aaa' }}>
            <ForumIcon fontSize="small" /> <Typography variant="body2">{comments.length} comments</Typography>
          </Stack>
        </Stack>

        {/* Prompt Content */}
        <Paper
          sx={{
            bgcolor: '#111',
            p: 2,
            borderRadius: 2,
            border: '1px solid #333',
            overflowX: 'auto',
            position: 'relative',
            mb: 3
          }}
        >
          {/* Copy Button */}
          <Tooltip title="Copy prompt content">
            <IconButton
              size="small"
              onClick={handleCopyContent}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: '#222',
                color: '#c0e1fcff',
                '&:hover': { bgcolor: '#333' }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: '#90caf9'
            }}
          >
            {prompt.content}
          </Typography>
        </Paper>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
          {prompt.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: '#222',
                color: '#90caf9',
                border: '1px solid #333',
                fontWeight: 'bold'
              }}
            />
          ))}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Tooltip title="Share this prompt">
            <IconButton onClick={handleShare} sx={{ bgcolor: '#333', color: '#fff', '&:hover': { bgcolor: '#444' } }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          {isAuthenticated && (
            <Tooltip title={prompt.isBookmarkedByCurrentUser ? 'Remove from saved' : 'Save this prompt'}>
              <IconButton
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                sx={{ bgcolor: '#333', color: '#fff', '&:hover': { bgcolor: '#444' } }}
              >
                {bookmarkLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : prompt.isBookmarkedByCurrentUser ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Comments */}
        <Typography variant="h5" gutterBottom>Comments ({comments.length})</Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Paper
                key={comment._id}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: '#1e1e1e', borderColor: '#333' }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: '#3080cfff', color: '#ffffffff' }}>
                    {comment.author?.userName?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ccc' }}>
                      {comment.author?.userName || 'Anonymous'} - {formatDate(comment.createdAt)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: '#888' }}>{comment.text}</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="inherit">Be the first to comment!</Typography>
          )}
        </Stack>

        {/* Add Comment */}
        {isAuthenticated ? (
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#1e1e1e', borderColor: '#333' }} variant="outlined">
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
                '& .MuiInputBase-root': { color: '#fff' },
                '& .MuiInputLabel-root': { color: '#aaa' }
              }}
            />
            <Button
              variant="contained"
              color='primary'
              onClick={handleAddComment}
            >
              {isCommenting ? (
                <CircularProgress size={24} sx={{ color: '#000' }} />
              ) : (
                'Post Comment'
              )}
            </Button>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ bgcolor: '#1e1e1e', color: '#fff', border: '1px solid #333' }}>
            You must be <a href="/login" style={{ color: '#90caf9' }}>logged in</a> to post a comment.
          </Alert>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default PromptDetailPage;
