import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../services/NotificationService";
import { Notification } from "../models/Notification";
import { DefaultUserName } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";

const NotificationsPage = () => {
  const { user: loggedInUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!loggedInUser?._id) return;
      try {
        const data = await getUserNotifications(loggedInUser._id);
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [loggedInUser?._id]);

  const handleClick = async (notification: Notification) => {
    if (notification.promptId) {
      await markNotificationAsRead(notification._id);
      navigate(`/prompts/${notification.promptId}`);
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="md">
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <NotificationsIcon
            sx={{
              fontSize: { xs: 28, sm: 44, md: 50 },
              color: "#fff",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "rotate(-5deg) scale(1.05)" },
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
              background: "#fff",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: { xs: 0.5, md: 1 },
            }}
          >
            Notifications
          </Typography>
        </Box>

        <List disablePadding>
          {notifications.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                color: "#bbb",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ color: "#fff", mb: 1 }}
              >
                No notifications yet 🔔
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Engage with posts and your notifications will appear here!
              </Typography>
            </Paper>
          ) : (
            notifications.map((notification, index) => (
                <Paper
                    key={index}
                    elevation={4}
                    sx={{
                        mb: 3,
                        p: 2.5,
                        borderRadius: 3,
                        cursor: "pointer",
                        bgcolor: "#1e1e1e",
                        color: "#e0e0e0",
                    }}
                    onClick={() => handleClick(notification)}
                >
                    <ListItem alignItems="flex-start" disableGutters>
                    <ListItemText
                        primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {!notification.isRead && (
                                <CircleIcon sx={{ fontSize: 10, color: "#42a5f5" }} />
                                )}
                                <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                color="#fff"
                                component="span"
                                sx={{ mb: 1 }}
                                >
                                {notification.message}
                                </Typography>
                            </Stack>
                        }
                        primaryTypographyProps={{ component: "span" }}
                        secondary={
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ mt: 0.5 }}
                            >
                                <Typography
                                    variant="caption"
                                    component="span"
                                    sx={{ color: "#aaa", cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/users/${notification.senderId?._id}`);
                                    }}
                                    >
                                    From{" "}
                                    <Box component="span" sx={{ color: "#42a5f5", fontWeight: 600 }}>
                                        {notification.senderId?.userName || DefaultUserName}
                                    </Box>
                                </Typography>

                                <Typography
                                variant="caption"
                                component="span"
                                sx={{ color: "#888", ml: "auto", fontStyle: "italic" }}
                                >
                                {new Date(notification.createdAt).toLocaleString()}
                                </Typography>
                            </Stack>
                        }
                        secondaryTypographyProps={{ component: "span" }}
                    />
                    </ListItem>
                </Paper>
            ))
          )}
        </List>
      </Container>
    </Box>
  );
};

export default NotificationsPage;
