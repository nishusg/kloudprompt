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
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircle from '@mui/icons-material/AddCircle';

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
  };

  return (
    <AppBar position="fixed"   sx={{ width: '100%', backgroundColor: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Site Name Centered */}
        <Typography
          variant="h6"
          component="button"
          onClick={() => navigate('/')}
          sx={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          PromptShare
        </Typography>

        {/* Hamburger Menu */}
        <Box>
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
              >
                {/* Explore Section */}
                <MenuItem onClick={() => handleNavigate('/explore')}>
                  <ListItemIcon>
                    <ExploreIcon fontSize="small" />
                  </ListItemIcon>
                  Explore
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/trending')}>
                  <ListItemIcon>
                    <WhatshotIcon fontSize="small" />
                  </ListItemIcon>
                  Trending
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/latest')}>
                  <ListItemIcon>
                    <NewReleasesIcon fontSize="small" />
                  </ListItemIcon>
                  Latest
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/categories')}>
                  <ListItemIcon>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  Categories
                </MenuItem>
                <Divider />

                {/* Account Section */}
                {user ? (
                  <>
                    <MenuItem onClick={() => handleNavigate('/create')}>
                      <ListItemIcon>
                        <AddCircle fontSize="small" />
                      </ListItemIcon>
                      Create Prompt
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/profile/' + user._id)}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      Account Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavigate('/login')}>
                      <ListItemIcon>
                        <LoginIcon fontSize="small" />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/register')}>
                      <ListItemIcon>
                        <PersonAddIcon fontSize="small" />
                      </ListItemIcon>
                      Register
                    </MenuItem>
                  </>
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
