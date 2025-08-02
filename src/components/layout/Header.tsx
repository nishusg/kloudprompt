import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';

// Import Material-UI components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1, // Pushes the navigation links to the right
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
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/create">
                  Create
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to={`/profile/${user.id}`}
                >
                  Profile
                </Button>
                <Button variant="outlined" onClick={logout} sx={{ ml: 1 }}>
                  Logout
                </Button>
              </>
            ) : (
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