// src/pages/PlaygroundPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPromptById } from '../services/PromptService';
import { Prompt } from '../models/Prompt';
import {
  Box, Container, Typography, TextField, Button, Paper, Stack,
  CircularProgress, Tooltip, IconButton, Divider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const PlaygroundPage: React.FC = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [userApiKey, setUserApiKey] = useState('');
  const [model, setModel] = useState<'openai'|'gemini'|'openrouter'|'grok'>('openai');
  const [type, setType] = useState<'text'|'image'>('text');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);
  const [size, setSize] = useState<'256x256'|'512x512'|'1024x1024'>('512x512');
  const [output, setOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!promptId) return;
    const fetchPrompt = async () => {
      try {
        const promptData = await getPromptById(promptId);
        setPrompt(promptData);
      } catch (err) {
        console.error('Failed to load prompt', err);
        navigate('/'); // fallback
      }
    };
    fetchPrompt();
  }, [promptId]);

  const handleRunPrompt = async () => {
    if (!prompt || !userApiKey) return;

    setLoading(true);
    setOutput('');
    setImageUrl('');

    try {
      const response = await fetch('/api/playground/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.content,
          userApiKey,
          model,
          type,
          temperature,
          maxTokens,
          size
        })
      });
      const data = await response.json();
      if(type === 'text') setOutput(data.output || '');
      if(type === 'image') setImageUrl(data.imageUrl || '');
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
    } catch (err) {
      console.error('Failed to copy output', err);
    }
  };

  if (!prompt) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ bgcolor: '#0d0d0d', color: '#fff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Prompt Header */}
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#fff' }}>
          {prompt.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#ccc' }}>
          {prompt.description}
        </Typography>

        {/* Prompt Content */}
        <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#90caf9', fontWeight: 600 }}>
            Prompt Content
          </Typography>
          <TextField
            multiline minRows={4} fullWidth
            value={prompt.content}
            InputProps={{ readOnly: true, style: { color: '#fff', fontFamily: 'monospace' } }}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', borderColor: '#333' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
            }}
          />
        </Paper>

        {/* Settings Panel */}
        <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <Stack spacing={3}>
            <TextField
              label="Your Model API Key"
              placeholder="Enter your API key"
              value={userApiKey}
              onChange={e => setUserApiKey(e.target.value)}
              fullWidth
              sx={{
                input: { color: '#fff', '&::placeholder': { color: '#aaa', opacity: 1 } },
                label: { color: '#aaa' }
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ color: '#aaa' }}>Model</InputLabel>
                <Select
                  value={model}
                  onChange={e => setModel(e.target.value as any)}
                  sx={{ color: '#fff' }}
                  label="Model"
                >
                  <MenuItem value="openai">OpenAI</MenuItem>
                  <MenuItem value="gemini">Gemini</MenuItem>
                  <MenuItem value="openrouter">OpenRouter</MenuItem>
                  <MenuItem value="grok">Grok</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel sx={{ color: '#aaa' }}>Type</InputLabel>
                <Select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  sx={{ color: '#fff' }}
                  label="Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
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
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
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
              sx={{ bgcolor: '#42a5f5', py: 1.5, fontWeight: 600, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Run Prompt'}
            </Button>
          </Stack>
        </Paper>

        {/* Output Section */}
        {(type === 'text' && output) && (
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', mb: 4, borderRadius: 2, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
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
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', textAlign: 'center', mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            <img src={imageUrl} alt="AI Generated" style={{ maxWidth: '100%', borderRadius: 8 }} />
            <Tooltip title="Copy Image URL">
              <IconButton size="small" onClick={handleCopyOutput} sx={{ color: '#fff', mt: 1 }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PlaygroundPage;
