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
  Button,
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

const PAGE_LIMIT = 10;

const NotificationsPage = () => {
  const { user: loggedInUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchNotifications = async (pageNumber: number) => {
    if (!loggedInUser?._id) return;
    setLoading(true);
    try {
      const { notifications: newNotifications, totalPages: tp } = await getUserNotifications(
        loggedInUser._id,
        pageNumber,
        PAGE_LIMIT
      );

      setNotifications((prev) => [...prev, ...newNotifications]);
      setTotalPages(tp);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setNotifications([]);
    setPage(1);
    fetchNotifications(1);
  }, [loggedInUser?._id]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

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
                bgcolor: "#121212",
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
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Engage with posts and your notifications will appear here!
              </Typography>
            </Paper>
          ) : (
            notifications.map((notification, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{ mb: 3, p: 2.5, borderRadius: 3, cursor: 'pointer', bgcolor: '#121212', color: '#e0e0e0' }}
                onClick={() => handleClick(notification)}
              >
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {!notification.isRead && <CircleIcon sx={{ fontSize: 10, color: '#42a5f5' }} />}
                        <Typography variant="subtitle1" fontWeight="600" color="#fff" component="span">
                          {notification.message}
                        </Typography>
                      </Stack>
                    }
                    primaryTypographyProps={{ component: 'span' }}
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: '#aaa', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/users/${notification.senderId?._id}`);
                          }}
                        >
                          From <Box component="span" sx={{ color: '#42a5f5', fontWeight: 600 }}>{notification.senderId?.userName || DefaultUserName}</Box>
                        </Typography>

                        <Typography variant="caption" component="span" sx={{ color: '#888', ml: 'auto', fontStyle: 'italic' }}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                    }
                    secondaryTypographyProps={{ component: 'span' }}
                  />
                </ListItem>
              </Paper>
            ))
          )}
        </List>

        {/* Load More button */}
        {page < totalPages && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NotificationsPage;
