import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Chip,
  TextField,
  Avatar,
  Stack,
  Alert
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// --- Mock Data and Services ---
// In a real application, these would be in separate files (e.g., models.ts, services.ts)

// Data Models
interface User {
  id: string;
  username: string;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  author: User;
  tags: string[];
  upvotes: number;
  views: number;
  createdAt: string;
  upvoted?: boolean; // Simulates if the current user has upvoted
}


// Mock Service Functions
const mockUser1: User = { id: 'user-1', username: 'promptmaster' };
const mockUser2: User = { id: 'user-2', username: 'commentwiz' };
const mockUser3: User = { id: 'user-3', username: 'JaneDev' };


const mockPrompt: Prompt = {
  id: '123',
  title: 'Advanced React Patterns',
  description: 'A deep dive into hooks, context, and performance optimization for complex applications.',
  content: `
// Example: Custom Hook for fetching data
function useData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}`,
  author: mockUser1,
  tags: ['react', 'hooks', 'performance', 'typescript'],
  upvotes: 128,
  views: 2450,
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  upvoted: false,
};

const mockComments: Comment[] = [
  { id: 'c1', content: 'This is a fantastic prompt! Really helped me understand custom hooks.', author: mockUser2, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'c2', content: 'Great explanation. Could you add an example with useReducer?', author: mockUser3, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

const getPromptById = (id: string): Promise<Prompt> => {
  console.log(`Fetching prompt with id: ${id}`);
  return new Promise(resolve => setTimeout(() => resolve(mockPrompt), 500));
};

const getComments = (promptId: string): Promise<Comment[]> => {
    console.log(`Fetching comments for promptId: ${promptId}`);
  return new Promise(resolve => setTimeout(() => resolve(mockComments), 500));
};

const upvotePrompt = (id: string): Promise<Prompt> => {
  console.log(`Upvoting prompt with id: ${id}`);
  mockPrompt.upvoted = !mockPrompt.upvoted;
  mockPrompt.upvotes += mockPrompt.upvoted ? 1 : -1;
  return new Promise(resolve => setTimeout(() => resolve({ ...mockPrompt }), 200));
};

const addComment = (promptId: string, content: string): Promise<Comment> => {
    console.log(`Adding comment to promptId: ${promptId}`);
  const newComment: Comment = {
    id: `c${Date.now()}`,
    content,
    author: { id: 'user-current', username: 'You' },
    createdAt: new Date().toISOString(),
  };
  return new Promise(resolve => setTimeout(() => resolve(newComment), 300));
};

// Utility to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


// --- React Component ---

const PromptDetailPage: React.FC<{ id: string }> = ({ id }) => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch prompt and comments in parallel
        const [promptData, commentsData] = await Promise.all([
          getPromptById(id),
          getComments(id),
        ]);
        setPrompt(promptData);
        setComments(commentsData);
      } catch (err) {
        setError('Failed to fetch prompt data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpvote = async () => {
    if (!prompt) return;
    try {
      const updatedPrompt = await upvotePrompt(prompt.id);
      setPrompt(updatedPrompt);
    } catch (err) {
      console.error('Failed to upvote:', err);
      // Optionally set an error state to show in the UI
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !prompt) return;
    try {
      const comment = await addComment(prompt.id, newComment);
      setComments(prevComments => [...prevComments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      // Optionally set an error state to show in the UI
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );
  }

  if (!prompt) {
     return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="warning">Prompt not found.</Alert>
        </Container>
    );
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
              variant={prompt.upvoted ? 'contained' : 'outlined'}
              size="large"
              startIcon={<ArrowUpwardIcon />}
              onClick={handleUpvote}
            >
              {prompt.upvotes}
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {prompt.description}
          </Typography>

          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, mb: 3, overflowX: 'auto' }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {prompt.content}
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
      <Typography variant="h5" component="h2" gutterBottom>
        Comments ({comments.length})
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {comment.author.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="subtitle2" component="strong">{comment.author.username}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(comment.createdAt)}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>{comment.content}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary">Be the first to comment!</Typography>
        )}
      </Stack>
      
      {/* Add Comment Form */}
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Add a comment"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Post Comment
        </Button>
      </Box>
    </Container>
  );
};

// Main App component to render the detail page
export default function App() {
    // In a real app, the ID would come from react-router-dom's useParams()
    const promptId = "123"; 
    return <PromptDetailPage id={promptId} />;
}
