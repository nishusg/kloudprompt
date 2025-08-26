// src/pages/PromptDetailPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getPromptById, incrementPromptView, toggleBookmarkPrompt } from '../../services/PromptService';
import { addCommentToPrompt } from '../../services/CommentService';
import { useAuth } from '../../context/AuthContext';
import { Prompt } from '../../models/Prompt';
import { PromptComment } from '../../models/Comment';

import {
  Container, Typography, Button, CircularProgress, Box, Chip, TextField,
  Avatar, Stack, Alert, Divider, Paper, Snackbar, IconButton, Tooltip, Link,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { DefaultUserName } from '../../utils/Constants';
import { enhancePrompt } from "../../services/PromptService";
import { EnhancePromptRequest, EnhancePromptResponse } from "../../models/EnhancePrompt";
import { ModelTypeEnum } from '../../models/Enum';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const [enhanceDialogOpen, setEnhanceDialogOpen] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<string | null>(null);
  
  const hasIncremented = useRef(false);
  const modelRef = useRef<HTMLInputElement>(null);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  // Fetch prompt
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const promptData = await getPromptById(id);
        setPrompt(promptData);
        setComments(promptData.comments || []);
        if (id && !hasIncremented.current) {
          incrementPromptView(id);
          hasIncremented.current = true;
        }
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
      setPrompt(prev =>
        prev
          ? { ...prev, isBookmarkedByCurrentUser: !prev.isBookmarkedByCurrentUser }
          : prev
      );
      await toggleBookmarkPrompt(prompt._id);
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
      setPrompt(prev =>
        prev
          ? { ...prev, isBookmarkedByCurrentUser: !prev.isBookmarkedByCurrentUser }
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
          text: newComment,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: user!,
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

  const handleCopyContent = async (content: string) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setSnackbarMsg('Prompt content copied!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy prompt content', err);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    const payload: EnhancePromptRequest = {
      model: modelRef.current?.value || '',
      apiKey: apiKeyRef.current?.value || '',
      promptContent: prompt.content,
    };
    try {
      const response: EnhancePromptResponse = await enhancePrompt(payload);
      setEnhancedContent(response.enhancedText);
      // test prompt
      //setEnhancedContent("A bustling neon-lit cyberpunk street at night, rain-slick pavement reflecting vibrant holographic billboards and glowing advertisements, crowds of people in futuristic, high-tech outfits, some with cybernetic implants, flying cars and drones zipping through the sky above, steam rising from street vents, cinematic neon lighting casting deep reflections and shadows, puddles shimmering with multicolored light, intricate futuristic architecture with towering skyscrapers, ultra-realistic 8K detail, cinematic wide-angle perspective, hyper-detailed textures, moody atmosphere with subtle fog and lens flare");
      
      setEnhanceDialogOpen(false);
    } catch (err) {
      console.error('Failed to enhance prompt', err);
    }
  };

  const handleTryPrompt = () => {
    if (!prompt) return;
    navigate(`/playground/${prompt._id}`);
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
    <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{prompt.title}</Typography>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
          <Typography variant="subtitle1" sx={{ color: '#bbb' }}>{prompt.description}</Typography>
          <Typography variant="subtitle2" sx={{ color: '#bbb' }}>
            By{' '}
            {prompt.author ? (
              <Link
                component={RouterLink}
                to={`/users/${prompt.author._id}`}
                sx={{ color: '#90caf9', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {prompt.author.userName}
              </Link>
            ) : (
              DefaultUserName
            )}
            {' '}• {formatDate(prompt.createdAt)}
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
            mb: 3,
            display: 'flex',
            alignItems: 'center', // vertical centering
            gap: 2
          }}
        >
          {/* Content */}
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: '#90caf9',
              flex: 1
            }}
          >
            {prompt.content}
          </Typography>

          <Stack direction="column" spacing={1} alignItems="center">
            {/* Enhance Prompt Button */}
            <Tooltip title="Enhance prompt content">
              <IconButton
                size="small"
                onClick={() => setEnhanceDialogOpen(true)}
                sx={{
                  bgcolor: '#222',
                  color: '#4cafef',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <AutoFixHighIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Try Prompt Button */}
            <Tooltip title="Try Prompt content">
              <IconButton
                size="small"
                onClick={handleTryPrompt}
                sx={{
                  bgcolor: '#222',
                  color: '#4cafef',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Copy Button */}
            <Tooltip title="Copy prompt content">
              <IconButton
                size="small"
                onClick={() => handleCopyContent(prompt.content)}
                sx={{
                  bgcolor: '#222',
                  color: '#4cafef',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Enhance Dialog Popup */}
        <Dialog
          open={enhanceDialogOpen}
          onClose={() => setEnhanceDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1c1c1c', // darker background
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#121212',
              color: '#90caf9',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              borderBottom: '1px solid #333',
            }}
          >
            Enhance Prompt
          </DialogTitle>

          <DialogContent dividers sx={{ bgcolor: '#1c1c1c', py: 3 }}>
            <Stack spacing={3}>
              {/* Model Dropdown */}
              <TextField
                select
                label="Select Model"
                fullWidth
                inputRef={modelRef}
                InputLabelProps={{ style: { color: '#bbb' } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#fff' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#777' },
                    '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                    borderRadius: 1.5,
                  },
                }}
              >
                {Object.values(ModelTypeEnum).map((model) => (
                  <MenuItem key={model} value={model}>
                    {model.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>

              {/* API Key */}
              <TextField
                label="API Key"
                type="text"
                fullWidth
                inputRef={apiKeyRef}
                InputLabelProps={{ style: { color: '#bbb' } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#fff' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#777' },
                    '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                    borderRadius: 1.5,
                  },
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ bgcolor: '#1c1c1c', px: 3, py: 2 }}>
            <Button
              onClick={() => setEnhanceDialogOpen(false)}
              sx={{
                color: '#90caf9',
                borderColor: '#90caf9',
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'rgba(144,202,249,0.1)' },
              }}
              variant="outlined"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={async () => handleEnhancePrompt()}
              sx={{
                bgcolor: '#42a5f5',
                '&:hover': { bgcolor: '#1e88e5' },
                color: '#fff',
                borderRadius: 1.5,
                px: 3,
                py: 1,
                fontWeight: 'bold',
              }}
            >
              Enhance
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhance Prompt Dialog */}
        {enhancedContent && (
          <Paper
            sx={{
              bgcolor: '#1a1a1a',
              p: 2,
              borderRadius: 2,
              border: '1px solid #444',
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                color: '#a5d6a7',
                flex: 1,
              }}
            >
              {enhancedContent}
            </Typography>

            <Tooltip title="Copy enhanced content">
              <IconButton
                size="small"
                onClick={() => handleCopyContent(enhancedContent)}
                sx={{
                  bgcolor: '#222',
                  color: '#4cafef',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
        )}

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
          {prompt.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#222', color: '#90caf9', border: '1px solid #333', fontWeight: 'bold' }} />
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
              <IconButton onClick={handleBookmark} disabled={bookmarkLoading} sx={{ bgcolor: '#333', color: '#fff', '&:hover': { bgcolor: '#444' } }}>
                {bookmarkLoading ? <CircularProgress size={20} color="inherit" /> : prompt.isBookmarkedByCurrentUser ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Comments */}
        <Typography variant="h5" gutterBottom>Comments ({comments.length})</Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Paper key={comment._id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#1e1e1e', borderColor: '#333' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: '#3080cfff', color: '#fff' }}>
                    {(comment.user?.userName || DefaultUserName).charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ccc' }}>
                      {comment.user?.userName || DefaultUserName} - {formatDate(comment.createdAt)}
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
              sx={{ mb: 2, '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#aaa' } }}
            />
            <Button variant="contained" color='primary' onClick={handleAddComment}>
              {isCommenting ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Post Comment'}
            </Button>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ bgcolor: '#1e1e1e', color: '#fff', border: '1px solid #333' }}>
            You must be <a href="/login" style={{ color: '#90caf9' }}>logged in</a> to post a comment.
          </Alert>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </Box>
  );
};

export default PromptDetailPage;
