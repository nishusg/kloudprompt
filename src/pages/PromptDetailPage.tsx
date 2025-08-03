// src/pages/PromptDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ✨ 1. Import real services, models, and the auth context
import { getPromptById, upvotePrompt } from '../services/PromptService';
import { getComments, addComment } from '../services/CommentService';
import { useAuth } from '../context/AuthContext';
import { Prompt } from '../models/Prompt';
import { PromptComment } from '../models/Comment';

// MUI Imports
import {
  Container, Typography, Button, Card, CardContent, CardActions,
  CircularProgress, Box, Chip, TextField, Avatar, Stack, Alert
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// Utility
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // ✨ 2. Use the authentication context
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
      setLoading(true);
      setError(null);
      try {
        const promptData = await getPromptById(id);
        setPrompt(promptData);
        setComments(promptData.comments || []);
      } catch (err) {
        setError('Failed to fetch prompt data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpvote = async () => {
    if (!prompt || !isAuthenticated) return;
    setIsUpvoting(true);
    try {
      // The backend will identify the user via the auth token
      const updatedPrompt = await upvotePrompt(prompt._id);
      setPrompt(updatedPrompt);
    } catch (err) {
      console.error('Failed to upvote:', err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !prompt || !isAuthenticated) return;
    setIsCommenting(true);
    try {
      // The backend will identify the user via the auth token
      const createdComment = await addComment(prompt._id, newComment);
      // Add the new comment to the list, with author details from the context
      setComments(prevComments => [...prevComments, { ...createdComment, author: user! }]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsCommenting(false);
    }
  };

  // --- Render logic remains similar ---
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Container maxWidth="md" sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }
  if (!prompt) {
    return <Container maxWidth="md" sx={{ py: 4 }}><Alert severity="warning">Prompt not found.</Alert></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Prompt Details Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {prompt.title}
            </Typography>
            <Button
              // ✨ FIX: Use optional chaining (?.) and nullish coalescing (??)
              variant={prompt?.isUpvotedByCurrentUser ? 'contained' : 'outlined'}
              size="large"
              startIcon={isUpvoting ? <CircularProgress size={20} color="inherit"/> : <ArrowUpwardIcon />}
              onClick={handleUpvote}
              disabled={isUpvoting || !isAuthenticated}
            >
              {/* ✨ FIX: Provide a default value of 0 if upvotes is missing */}
              {prompt?.upvotes ?? 0}
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {prompt.description}
          </Typography>

          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, mb: 3, overflowX: 'auto' }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {prompt.promptText}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
            {prompt.tags.map(tag => (
              <Chip key={tag} label={tag} color="primary" variant="outlined" size="small" />
            ))}
          </Stack>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Created by <strong>{prompt.author.username}</strong> on {formatDate(prompt.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {prompt.views} views
          </Typography>
        </CardActions>
      </Card>
      
      {/* Comments Section */}
      <Typography variant="h5" component="h2" gutterBottom>Comments ({comments.length})</Typography>
      {/* ✅ FIX: Added the missing mapping logic to render comments */}
      
      <Stack spacing={2} sx={{ mb: 4 }}>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment._id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {comment.author?.username?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="subtitle2" component="strong">
                        {comment.author?.username || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>{comment.text}</Typography>
                  </Box>
                  </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary">Be the first to comment!</Typography>
        )}
      </Stack>
      
      {/* ✨ 3. Conditionally render the comment form */}
      {isAuthenticated ? (
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={`Comment as ${user?.username}`}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isCommenting}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!newComment.trim() || isCommenting}
          >
            {isCommenting ? <CircularProgress size={24} color="inherit" /> : 'Post Comment'}
          </Button>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>
          You must be <a href="/login">logged in</a> to post a comment.
        </Alert>
      )}
    </Container>
  );
};

export default PromptDetailPage;