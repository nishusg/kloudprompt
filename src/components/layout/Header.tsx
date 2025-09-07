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
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        backgroundColor: '#000',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ position: 'relative' }}>
        {/* Site Name Centered */}
        <Typography
          variant="h6"
          component="button"
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            fontWeight: 'bold',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {(window as any)._env_?.REACT_APP_Website_Title || process.env.REACT_APP_Website_Title}
        </Typography>

        {/* Hamburger Menu */}
        <Box sx={{ marginLeft: 'auto' }}>
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
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
                      color: '#90caf9',
                    },
                  },
                }}
              >
                {/* Explore Section */}
                <MenuItem onClick={() => handleNavigate('/explore')}>
                  <ListItemIcon>
                    <ExploreIcon fontSize="small" />
                  </ListItemIcon>
                  Explore
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/notifications')}>
                  <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  Notification
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/trending')}>
                  <ListItemIcon>
                    <WhatshotIcon fontSize="small" />
                  </ListItemIcon>
                  Trending
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/leaderboard')}>
                  <ListItemIcon>
                    <LeaderboardIcon fontSize="small" />
                  </ListItemIcon>
                  Leaderboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/categories')}>
                  <ListItemIcon>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  Categories
                </MenuItem>

                {/* Account Section */}
                {user ? (
                  [
                    <MenuItem key="create" onClick={() => handleNavigate('/create')}>
                      <ListItemIcon>
                        <AddCircle fontSize="small" />
                      </ListItemIcon>
                      Create Prompt
                    </MenuItem>,
                    <MenuItem key="profile" onClick={() => handleNavigate('/profile/' + user._id)}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      Account Settings
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>,
                  ]
                ) : (
                  [
                    <MenuItem key="login" onClick={() => handleNavigate('/login')}>
                      <ListItemIcon>
                        <LoginIcon fontSize="small" />
                      </ListItemIcon>
                      Login
                    </MenuItem>,
                    <MenuItem key="register" onClick={() => handleNavigate('/register')}>
                      <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                      </ListItemIcon>
                      Register
                    </MenuItem>,
                  ]
                )}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
      {/* Divider below header */}
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
    </AppBar>
  );
};

export default Header;
