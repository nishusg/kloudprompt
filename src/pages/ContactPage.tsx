import React from "react";
import { Container, Paper, Typography, Box, Stack, Link } from "@mui/material";

const ContactPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 6 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: "#121212", color: "white" }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#42a5f5" }}
          >
            Contact Us
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 3, opacity: 0.8 }}>
            We'd love to hear from you! Reach out to us through any of the following:
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              📧 Email:{" "}
              <Link href="mailto:contact@example.com" underline="hover" color="#42a5f5">
                contact@example.com
              </Link>
            </Typography>
            <Typography>
              📞 Phone:{" "}
              <Link href="tel:+1234567890" underline="hover" color="#42a5f5">
                +1 234 567 890
              </Link>
            </Typography>
            <Typography>
              🏢 Address: 123 Main Street, City, Country
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactPage;
