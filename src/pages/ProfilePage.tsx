import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

// --- INTERFACES ---
// User interface as provided
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// A simple interface for prompts
export interface Prompt {
  id: string;
  title: string;
  description: string;
  likes: number;
}


// --- DUMMY DATA ---
// A sample user object based on the User interface
const dummyUser: User = {
  id: 'user-123',
  username: 'Alex_Stark',
  email: 'alex.stark@example.com',
  avatar: 'https://i.pravatar.cc/150?u=alexstark', // Using a placeholder image service
  bio: 'Creative writer & AI enthusiast exploring the future of storytelling. Follow for unique prompts and creative inspiration.',
  followersCount: 1450,
  followingCount: 210,
  isFollowing: false,
  createdAt: '2024-05-10T10:00:00Z',
  updatedAt: '2024-08-01T15:30:00Z',
};

// A sample array of prompts created by the user
const dummyPrompts: Prompt[] = [
  { id: 'prompt-01', title: 'The Last Sunset on Mars', description: 'Describe the final moments of a lone astronaut watching the last sunset before returning to Earth.', likes: 152 },
  { id: 'prompt-02', title: 'A City Powered by Dreams', description: 'In a world where dreams are the primary energy source, what happens when people start having nightmares?', likes: 278 },
  { id: 'prompt-03', title: 'The Sentient Forest', description: 'A lost hiker discovers that the ancient forest they are in is a single, conscious entity. How do they communicate?', likes: 98 },
  { id: 'prompt-04', title: 'Detective in a Time Loop', description: 'A detective has to solve a murder but is stuck in a 24-hour time loop that resets every time they fail.', likes: 410 },
];


// --- COMPONENTS ---

/**
 * A simple card component to display a prompt.
 */
const PromptCard: React.FC<{ prompt: Prompt }> = ({ prompt }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {prompt.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {prompt.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 2, pb: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          {prompt.likes} Likes
        </Typography>
      </CardActions>
    </Card>
  );
};

/**
 * The main profile page component that fetches and displays user data.
 */
const App: React.FC = () => {
  // State to hold the user and their prompts
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect to simulate fetching data when the component mounts
  useEffect(() => {
    // Simulate an API call with a timeout
    const timer = setTimeout(() => {
      // Set the dummy data into the state
      setUser(dummyUser);
      setPrompts(dummyPrompts);
      setLoading(false); // Set loading to false after data is "fetched"
    }, 1500); // 1.5-second delay

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>User not found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
          <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{ width: 96, height: 96, fontSize: '2.5rem', border: '2px solid white' }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left'} }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {user.username}
            </Typography>
            {user.bio && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {user.bio}
              </Typography>
            )}
            <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: { xs: 'center', md: 'flex-start'} }}>
              <Typography variant="body2">
                <Box component="span" fontWeight="fontWeightMedium">{user.followersCount}</Box> Followers
              </Typography>
              <Typography variant="body2">
                <Box component="span" fontWeight="fontWeightMedium">{user.followingCount}</Box> Following
              </Typography>
            </Stack>
          </Box>
          
          <Button variant="contained" size="medium" sx={{ mt: { xs: 2, md: 0 }, width: { xs: '100%', sm: 'auto' }}}>
            {user.isFollowing ? 'Following' : 'Follow'}
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        Prompts
      </Typography>

      <Grid container spacing={3}>
        {prompts.map((prompt) => (
          <Grid key={prompt.id}>
            <PromptCard prompt={prompt} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
