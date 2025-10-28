// src/pages/PlaygroundPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPromptById } from '../services/PromptService';
import { downloadImageBuffer, runPlaygroundPrompt } from '../services/PlaygroundService';
import { Prompt } from '../models/Prompt';
import {
  Box, Container, Typography, TextField, Button, Paper, Stack,
  CircularProgress, Tooltip, IconButton, MenuItem, 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { ProviderTypeEnum } from '../utils/Enum';
import { useSnackbar } from '../context/SnackbarContext';

const PlaygroundPage: React.FC = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [userApiKey, setUserApiKey] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const modelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!promptId) return;
    const fetchPrompt = async () => {
      try {
        const promptData = await getPromptById(promptId);
        setPrompt(promptData);
      } catch (err: any) {
        console.error('Failed to load prompt', err);
        navigate('/'); 
      }
    };
    fetchPrompt();
  }, [promptId, navigate]);

  const handleRunPrompt = async () => {
    if (!prompt || !userApiKey) return;

    setLoading(true);
    setImageUrl('');

    try {
      const data = await runPlaygroundPrompt({
        prompt: prompt.content,
        userApiKey,
        provider: modelRef.current?.value || ProviderTypeEnum.CHATGPT,
      });

      setImageUrl(data.imageUrl || '');
      showSnackbar('Prompt executed successfully!', 'success');
    } catch (err: any) {
      showSnackbar(err?.message || 'Failed to run prompt. Please check your API key and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = async () => {
    const text = imageUrl;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar('Image URL copied to clipboard!', 'success');
    } catch (err: any) {
      showSnackbar('Failed to copy to clipboard', 'error');
    }
  };

  // ✅ Fix: use blob download instead of direct link
  const handleDownloadImage = async () => {
    const result = await downloadImageBuffer(imageUrl);

    if (result instanceof Blob) {
      const blobUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showSnackbar('Image downloaded successfully!', 'success');
    } else {
      showSnackbar(result.error || 'Failed to download image', 'error');
    }
  };

  if (!prompt) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: '#0a0a0a', py: 4 }}>
      <Container maxWidth="lg">
        {/* Info Notice */}
        <Paper 
          sx={{ p: 2, bgcolor: '#121212', mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <InfoIcon sx={{ color: '#90caf9' }} />
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            We don’t store your API key — it’s only used locally in this session.
          </Typography>
        </Paper>

        {/* Prompt Header */}
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#fff' }}>
          {prompt.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#ccc' }}>
          {prompt.description}
        </Typography>

        {/* Prompt Content */}
        <Paper sx={{ p: 3, bgcolor: '#121212', mb: 4, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#90caf9', fontWeight: 600 }}>
            Prompt Content
          </Typography>
          <TextField
            multiline minRows={4} fullWidth
            value={prompt.content}
            InputProps={{ readOnly: true, style: { color: '#fff', fontFamily: 'monospace' } }}
          />
        </Paper>

        {/* Playground Section */}
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 2, 
            fontWeight: "bold", 
            color: "primary.contrastText", 
            letterSpacing: 0.5 
          }}
        >
          Try it out!
        </Typography>
      
        {/* Settings Panel */}
        <Paper sx={{ p: 3, bgcolor: '#121212', mb: 4, borderRadius: 2 }}>
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
              InputProps={{
                sx: { color: "white" },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { bgcolor: "#121212", color: "#fff" },
                  },
                  disableScrollLock: true,
                },
              }}
            >
              {Object.values(ProviderTypeEnum).map((model) => (
                <MenuItem key={model} value={model}>
                  {model.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="API Key"
              placeholder="Enter your API key"
              value={userApiKey}
              onChange={e => setUserApiKey(e.target.value)}
              fullWidth
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

            <Button
              variant="contained"
              onClick={handleRunPrompt}
              disabled={loading}
              sx={{ bgcolor: '#42a5f5' }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Run Prompt'}
            </Button>
          </Stack>
        </Paper>

        {(imageUrl) && (
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', textAlign: 'center', mb: 4 }}>
            <img src={imageUrl} alt="AI Generated" style={{ maxWidth: '100%', borderRadius: 8 }} />
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Tooltip title="Copy Image URL">
                <IconButton size="small" onClick={handleCopyOutput} sx={{ color: '#fff' }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download image">
                <IconButton size="small" onClick={handleDownloadImage} sx={{ color: '#fff' }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PlaygroundPage;
