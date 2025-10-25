import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircle from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CategoryIcon from '@mui/icons-material/Category';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1200 }}>
      {/* Radial glow behind header */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0,115,255,0.35), transparent 70%)',
          filter: 'blur(120px)',
          zIndex: 0,
        }}
      />

      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          background: 'rgba(20,20,30,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo + Title Centered */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1, // spacing between logo and title
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src="/icon.png" // replace with your logo path
              alt="Logo"
              sx={{ height: 35, width: 35, objectFit: 'contain' }}
            />
            <Typography
              variant="body1"
              sx={{ color: '#fff', fontWeight: 'bold', userSelect: 'none' }}
            >
              {(window as any)._env_?.REACT_APP_Website_Title || process.env.REACT_APP_Website_Title}
            </Typography>
          </Box>

          {/* Hamburger Menu */}
          <Box sx={{ marginLeft: 'auto' }}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  sx={{
                    color: '#fff',
                    borderRadius: 2,
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  disableScrollLock
                  PaperProps={{
                    sx: {
                    bgcolor: '#121212',
                      color: '#fff',
                      borderRadius: 2,
                      border: '1px solid #333',
                      boxShadow: '0px 4px 20px rgba(0,0,0,0.6)',
                      '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: '#333',
                      },
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#42a5f5',
                      },
                    },
                  }}
                >
                  {/* Explore Section */}
                  <MenuItem onClick={() => handleNavigate('/explore')}>
                    <ListItemIcon><ExploreIcon fontSize="small" /></ListItemIcon>Explore
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/users/search')}>
                    <ListItemIcon><PersonSearchIcon fontSize="small" /></ListItemIcon>Search User
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/notifications')}>
                    <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>Notification
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/trending')}>
                    <ListItemIcon><WhatshotIcon fontSize="small" /></ListItemIcon>Trending
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/leaderboard')}>
                    <ListItemIcon><LeaderboardIcon fontSize="small" /></ListItemIcon>Leaderboard
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/categories')}>
                    <ListItemIcon><CategoryIcon fontSize="small" /></ListItemIcon>Categories
                  </MenuItem>

                  {/* Account Section */}
                  {user
                    ? [
                      <MenuItem key="create" onClick={() => handleNavigate('/create')}>
                        <ListItemIcon><AddCircle fontSize="small" /></ListItemIcon>Create Prompt
                      </MenuItem>,
                      <MenuItem key="profile" onClick={() => handleNavigate('/profile/' + user._id)}>
                        <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>Account Settings
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Logout
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem key="login" onClick={() => handleNavigate('/login')}>
                        <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>Login
                      </MenuItem>,
                      <MenuItem key="register" onClick={() => handleNavigate('/register')}>
                        <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>Register
                      </MenuItem>,
                    ]}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </AppBar>
    </Box>
  );
};

export default Header;
