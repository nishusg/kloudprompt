// src/pages/PromptDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById, upvotePrompt } from '../services/PromptService';
import { getComments, addComment } from '../services/CommentService';
import { useAuth } from '../context/AuthContext';
import { Prompt } from '../models/Prompt';
import { PromptComment } from '../models/Comment';

import {
  Container, Typography, Button, Card, CardContent, CardActions,
  CircularProgress, Box, Chip, TextField, Avatar, Stack, Alert, Divider, Paper
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

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

  const handleUpvote = async () => {
    if (!prompt || !isAuthenticated) return;
    try {
      setIsUpvoting(true);
      const updatedPrompt = await upvotePrompt(prompt._id);
      setPrompt(updatedPrompt);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !prompt || !isAuthenticated) return;
    try {
      setIsCommenting(true);
      const createdComment = await addComment(prompt._id, newComment);
      setComments(prev => [...prev, { ...createdComment, author: user! }]);
      setNewComment('');
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  if (error) return <Container maxWidth="md" sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!prompt) return <Container maxWidth="md" sx={{ py: 4 }}><Alert severity="warning">Prompt not found.</Alert></Container>;

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Main Prompt Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#1c1c1c', color: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {prompt.title}
            </Typography>
            <Button
              variant={prompt.isUpvotedByCurrentUser ? 'contained' : 'outlined'}
              size="large"
              startIcon={isUpvoting ? <CircularProgress size={20} color="inherit" /> : <ArrowUpwardIcon />}
              onClick={handleUpvote}
              disabled={isUpvoting || !isAuthenticated}
              sx={{ borderRadius: 3, color: '#fff', borderColor: '#fff' }}
            >
              {prompt.upvotes ?? 0}
            </Button>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {prompt.description}
          </Typography>

          <Paper sx={{ bgcolor: '#121212', p: 2, borderRadius: 2, mb: 3, overflowX: 'auto', border: '1px solid #333' }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: '#ccc' }}>
              {prompt.promptText}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
            {prompt.tags.map(tag => (
              <Chip key={tag} label={tag} color="primary" variant="outlined" size="small" />
            ))}
          </Stack>

          <Divider sx={{ my: 2, borderColor: '#333' }} />

          <Stack direction="row" spacing={3} alignItems="center" sx={{ color: '#aaa' }}>
            <Typography variant="body2">
              By <strong>{prompt.author.username}</strong> • {formatDate(prompt.createdAt)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <VisibilityIcon fontSize="small" /> <Typography variant="body2">{prompt.views} views</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ForumIcon fontSize="small" /> <Typography variant="body2">{comments.length} comments</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Comments */}
        <Typography variant="h5" gutterBottom>Comments ({comments.length})</Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Paper key={comment._id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#1e1e1e', color: '#fff', borderColor: '#333' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {comment.author?.username?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.author?.username || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{comment.text}</Typography>
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
              label={`Comment as ${user?.username}`}
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
              onClick={handleAddComment}
              sx={{
                backgroundColor: '#fff', 
                color: '#000', 
                '&:hover': { backgroundColor: '#ddd' }
              }}
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
    </Box>
  );
};

export default PromptDetailPage;
