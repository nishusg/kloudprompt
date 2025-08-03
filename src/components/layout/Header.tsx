import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct for your structure

// Import Material-UI components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // Import a loading spinner

const Header: React.FC = () => {
  // Destructure isLoading from the useAuth hook
  const { user, logout, loading } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          PromptShare
        </Typography>

        <nav>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Common Links */}
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/explore">
              Explore
            </Button>

            {/* Conditional links based on auth state */}
            {loading ? (
              // While checking auth, show a small loader
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : user ? (
              // If user is logged in, show profile/create/logout
              <>
                <Button color="inherit" component={Link} to="/create">
                  Create
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  // IMPORTANT: Changed to user._id, which is common for MongoDB.
                  // Verify this matches your User model.
                  to={`/profile/${user._id}`}
                >
                  Profile
                </Button>
                <Button variant="outlined" onClick={logout} sx={{ ml: 1 }}>
                  Logout
                </Button>
              </>
            ) : (
              // If no user, show login/signup
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;