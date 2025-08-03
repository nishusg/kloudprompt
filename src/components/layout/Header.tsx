// src/components/layout/Header.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };
  
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}
        >
          PromptShare
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" component={Link} to="/explore">
            Explore
          </Button>

          {loading ? (
            <CircularProgress size={24} sx={{ ml: 2 }} />
          ) : user ? (
            <>
              {/* Main 'Create' button - hidden on mobile */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Create
              </Button>
              
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }} src={user.avatar}>
                    {user.username?.charAt(0).toUpperCase() || 'A'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* ✨ 1. 'Create' button for mobile, hidden on larger screens */}
                <MenuItem
                  onClick={() => handleNavigate('/create')}
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  Create Prompt
                </MenuItem>
                {/* ✨ Add a divider if the mobile 'Create' button is shown */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                   <Divider />
                </Box>
                
                <MenuItem onClick={() => handleNavigate(`/profile/${user._id}`)}>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button variant="contained" component={Link} to="/register" sx={{ ml: 1 }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
