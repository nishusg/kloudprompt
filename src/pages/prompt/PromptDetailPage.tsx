// src/pages/PromptDetailPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getPromptById, incrementPromptView, toggleBookmarkPrompt } from '../../services/PromptService';
import { useAuth } from '../../context/AuthContext';
import { Prompt } from '../../models/Prompt';

import {
  Container, Typography, Button, CircularProgress, Box, Chip, TextField,
  Stack, Alert, Divider, Paper, IconButton, Tooltip, Link,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem
} from '@mui/material';
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
import { ProviderTypeEnum } from '../../models/Enum';
import { CommentList } from '../../components/comments/CommentList';
import { useSnackbar } from '../../context/SnackbarContext';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      showSnackbar(prompt.isBookmarkedByCurrentUser ? 'Removed from saved' : 'Saved prompt', 'success');
    } catch (err) {
      showSnackbar("Failed to toggle bookmark", 'error');
      setPrompt(prev =>
        prev
          ? { ...prev, isBookmarkedByCurrentUser: !prev.isBookmarkedByCurrentUser }
          : prev
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/prompts/${prompt?._id}`;
      await navigator.clipboard.writeText(shareUrl);
      showSnackbar('Link copied to clipboard!', 'success');
    } catch (err) {
      showSnackbar('Failed to copy link', 'error');
    }
  };

  const handleCopyContent = async (content: string) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      showSnackbar('Prompt content copied!', 'success');
    } catch (err) {
      showSnackbar('Failed to copy prompt content', 'error');
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    const payload: EnhancePromptRequest = {
      provider: modelRef.current?.value || ProviderTypeEnum.CHATGPT,
      apiKey: apiKeyRef.current?.value || '',
      promptContent: prompt.content,
    };
    try {
      const response: EnhancePromptResponse = await enhancePrompt(payload);
      setEnhancedContent(response.enhancedText);
      
      setEnhanceDialogOpen(false);
      showSnackbar('Prompt enhanced successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to enhance prompt', 'error');
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
              {/* Provider Dropdown */}
              <TextField
                select
                label="Select Provider"
                fullWidth
                inputRef={modelRef}
                defaultValue={ProviderTypeEnum.CHATGPT}
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
                {Object.values(ProviderTypeEnum).map((model) => (
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
        <CommentList promptId={prompt._id} limit={5} />

      </Container>
    </Box>
  );
};

export default PromptDetailPage;
