import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Popover,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreIcon from "@mui/icons-material/Explore";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircle from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PolicyIcon from "@mui/icons-material/Policy";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    if (isMobile) setDrawerOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const mainMenu = [
    { text: "Explore", icon: <ExploreIcon />, path: "/explore" },
    { text: "Search User", icon: <PersonSearchIcon />, path: "/users/search" },
    { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
    { text: "Trending", icon: <WhatshotIcon />, path: "/trending" },
    { text: "Leaderboard", icon: <LeaderboardIcon />, path: "/leaderboard" },
    { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
  ];

  const userMenu = [
    {
      text: "Account Settings",
      icon: <AccountCircle />,
      path: "/profile" + (user ? `/${user._id}` : ""),
    },
    { text: "About", icon: <InfoIcon />, path: "/about" },
    { text: "Contact", icon: <ContactMailIcon />, path: "/contact" },
    { text: "Privacy Policy", icon: <PolicyIcon />, path: "/privacy" },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        color: "#fff",
        p: 2,
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Logo / Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          mb: 2,
          cursor: "pointer",
        }}
        onClick={() => handleNavigate("/")}
      >
        <Box
          component="img"
          src="/icon.png"
          alt="Logo"
          sx={{ height: 36, width: 36, objectFit: "contain" }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: 0.3,
          }}
        >
          {(window as any)._env_?.REACT_APP_Website_Title ||
            process.env.REACT_APP_Website_Title}
        </Typography>
      </Box>

      {/* Scrollable menu area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "10px",
          },
        }}
      >
        {/* Create Prompt */}
        {user && (
          <ListItem
            onClick={() => handleNavigate("/create")}
            sx={{
              mb: 1.5,
              mt: 1,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              transition: "0.2s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.12)",
                transform: "scale(1.02)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#7db4ff", minWidth: 40 }}>
              <AddCircle />
            </ListItemIcon>
            <ListItemText
              primary="Create Prompt"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        )}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />

        {/* Main Navigation */}
        <List>
          {mainMenu.map((item, i) => (
            <ListItem
              key={i}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                my: 0.3,
                px: 2,
                transition: "0.25s",
                bgcolor: isActive(item.path)
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#7db4ff", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: isActive(item.path) ? "#7db4ff" : "#fff",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom User Section */}
      <Box
        sx={{
          mt: "auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          pt: { xs: 1, sm: 1.5 },
          pb: { xs: 1, sm: 2.5 }
        }}
      >
        {user ? (
          <ListItem
            onClick={handleUserClick}
            sx={{
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#7db4ff",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={user.userName || "User"}
              secondary={user.email || ""}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.8rem",
              }}
            />
          </ListItem>
        ) : (
          <List>
            <ListItem
              onClick={() => handleNavigate("/login")}
              sx={{
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "#7db4ff" }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              onClick={() => handleNavigate("/register")}
              sx={{
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "#7db4ff" }}>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
        )}
      </Box>

      {/* User Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(18px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.08)",
            mt: -1,
            color: "#fff",
            minWidth: 220,
            borderRadius: 2,
            boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
          },
        }}
      >
        <List dense>
          {userMenu.map((item, i) => (
            <ListItem
              key={i}
              onClick={() => {
                handlePopoverClose();
                item.onClick ? item.onClick() : handleNavigate(item.path!);
              }}
              sx={{
                borderRadius: 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "#7db4ff", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  );

  return (
    <>
      {/* Mobile Header */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            px: 2,
            color: "#fff",
            bgcolor: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(18px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
          }}
        >
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              textAlign: "center",
              flexGrow: 1,
              letterSpacing: 0.3,
            }}
          >
            {(window as any)._env_?.REACT_APP_Website_Title ||
              process.env.REACT_APP_Website_Title}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: 260,
            height: "100vh",
            position: "sticky",
            top: 0,
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Drawer for Mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            color: "#fff",
            background: "rgba(10,10,10,0.8)",
            backdropFilter: "blur(25px) saturate(180%)",
            WebkitBackdropFilter: "blur(25px) saturate(180%)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Header;
