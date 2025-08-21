// src/pages/PlaygroundPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPromptById } from '../services/PromptService';
import { downloadImageBuffer, runPlaygroundPrompt } from '../services/PlaygroundService';
import { Prompt } from '../models/Prompt';
import {
  Box, Container, Typography, TextField, Button, Paper, Stack,
  CircularProgress, Tooltip, IconButton, Divider, MenuItem, Select,
  FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';

const PlaygroundPage: React.FC = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [userApiKey, setUserApiKey] = useState('');
  const [provider, setProvider] = useState<'chatgpt'|'gemini'|'openrouter'|'grok'|'together'>('chatgpt');
  const [type, setType] = useState<'text'|'image'|'video'|'audio'>('text');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);
  const [size, setSize] = useState<'256x256'|'512x512'|'1024x1024'>('512x512');
  const [output, setOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, isError: boolean, message: string}>({open: false, isError: false, message: ''});

  useEffect(() => {
    if (!promptId) return;
    const fetchPrompt = async () => {
      try {
        const promptData = await getPromptById(promptId);
        setPrompt(promptData);

        if (promptData.generationType) setType(promptData.generationType as any);
        if (promptData.modelType) setProvider(promptData.modelType as any);
      } catch (err) {
        console.error('Failed to load prompt', err);
        navigate('/'); 
      }
    };
    fetchPrompt();
  }, [promptId, navigate]);

  const handleRunPrompt = async () => {
    if (!prompt || !userApiKey) return;

    setLoading(true);
    setOutput('');
    setImageUrl('');

    try {
      const data = await runPlaygroundPrompt({
        prompt: prompt.content,
        userApiKey,
        provider,
        model: provider,
        type,
        temperature,
        maxTokens,
        size
      });

      if (type === 'text') setOutput(data.output || '');
      if (type === 'image') setImageUrl(data.imageUrl || '');
    } catch (err) {
      console.error(err);
      setOutput('Error running prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutput = async () => {
    const text = type === 'text' ? output : imageUrl;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, isError: false, message: 'Copied to clipboard!' });
    } catch (err) {
      console.error('Failed to copy output', err);
    }
  };

  // ✅ Fix: use blob download instead of direct link
  const handleDownloadImage = async () => {
    const result = await downloadImageBuffer(imageUrl);

    if (result instanceof Blob) {
      const blobUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "ai-generated.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setSnackbar({ open: true, isError: false, message: "Image downloaded!" });
    } else {
      setSnackbar({ open: true, isError: true, message: result.error });
    }
  };

  if (!prompt) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ bgcolor: '#0d0d0d', color: '#fff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Info Notice */}
        <Paper 
          sx={{ p: 2, bgcolor: '#262626', mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}
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
        <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#90caf9', fontWeight: 600 }}>
            Prompt Content
          </Typography>
          <TextField
            multiline minRows={4} fullWidth
            value={prompt.content}
            InputProps={{ readOnly: true, style: { color: '#fff', fontFamily: 'monospace' } }}
          />
        </Paper>

        {/* Settings Panel */}
        <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4, borderRadius: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Your Model API Key"
              placeholder="Enter your API key"
              value={userApiKey}
              onChange={e => setUserApiKey(e.target.value)}
              fullWidth
              sx={{ input: { color: '#fff' }, label: { color: '#aaa' } }}
            />

            {/* ✅ Fix: responsive Stack */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ color: '#aaa' }}>Provider</InputLabel>
                <Select
                  value={provider}
                  onChange={e => setProvider(e.target.value as any)}
                  sx={{ color: '#fff' }}
                >
                  <MenuItem value="chatgpt">ChatGPT</MenuItem>
                  <MenuItem value="gemini">Gemini</MenuItem>
                  <MenuItem value="openrouter">OpenRouter</MenuItem>
                  <MenuItem value="grok">Grok</MenuItem>
                  <MenuItem value="together">Together</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ color: '#aaa' }}>Type</InputLabel>
                <Select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  sx={{ color: '#fff' }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {type === 'text' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Temperature"
                  type="number"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />
                <TextField
                  label="Max Tokens"
                  type="number"
                  value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />
              </Stack>
            )}

            {type === 'image' && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#aaa' }}>Image Size</InputLabel>
                <Select value={size} onChange={e => setSize(e.target.value as any)} sx={{ color: '#fff' }}>
                  <MenuItem value="256x256">256x256</MenuItem>
                  <MenuItem value="512x512">512x512</MenuItem>
                  <MenuItem value="1024x1024">1024x1024</MenuItem>
                </Select>
              </FormControl>
            )}

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

        {/* Output Section */}
        {(type === 'text' && output) && (
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" sx={{ color: '#90caf9', fontWeight: 600 }}>Output</Typography>
              <Tooltip title="Copy output">
                <IconButton size="small" onClick={handleCopyOutput} sx={{ color: '#fff' }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <Divider sx={{ bgcolor: '#333', my: 1 }} />
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#fff' }}>
              {output}
            </Typography>
          </Paper>
        )}

        {(type === 'image' && imageUrl) && (
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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ open: false, isError: false, message: '' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.isError ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PlaygroundPage;
