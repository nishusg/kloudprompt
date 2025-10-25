import React from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: "#121212", // ✅ dark card background
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#42a5f5",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem", lg: "3rem" },
            }}
          >
            About Kloudprompt
          </Typography>

          <Divider sx={{ mb: 3, bgcolor: "#A37E2C40" }} />

          <Typography variant="body1" paragraph>
            <strong>
              KloudPrompt
            </strong>{" "}
            is a community-driven platform where creativity meets collaboration. It
            allows people to share, discover, and get inspired by creative
            prompts from around the world.
          </Typography>

          <Typography variant="body1" paragraph>
            Whether you're a writer, artist, developer, or just someone looking
            for inspiration, our platform helps you unlock new ideas and fuel
            your imagination.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mt: 4,
              fontWeight: 600,
              color: "lightblue",
            }}
          >
            What You Can Do
          </Typography>

          <List>
            {[
              "📌 Share your creative prompts with the community",
              "🔥 Discover trending prompts from others",
              "⭐ Bookmark and organize prompts you love",
              "🤝 Connect with like-minded creators",
            ].map((text, index) => (
              <ListItem
                key={index}
                sx={{
                  "&:hover": {
                    bgcolor: "#00603915",
                    transition: "0.3s",
                  },
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    sx: { color: "#F5F5F5", fontSize: "1rem" },
                  }}
                  primary={text}
                />
              </ListItem>
            ))}
          </List>

          <Box mt={4}>
            <Typography variant="body1">
              Our mission is simple:{" "}
              <strong>
                to make creativity accessible to everyone by creating a space
                where ideas can be exchanged, explored, and celebrated.
              </strong>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;