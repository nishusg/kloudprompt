import React from "react";
import { Container, Paper, Typography, Box, Stack, Link, Divider } from "@mui/material";

const ContactPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, bgcolor: "#121212", color: "white" }}
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
            Contact Us
          </Typography>

          <Divider sx={{ bgcolor: "#2a2a2a", mb: 3 }} />

          <Typography variant="body1" align="center" sx={{ mb: 3, opacity: 0.8 }}>
            We'd love to hear from you! Reach out to us through any of the following:
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              📧 Email:{" "}
              <Link href="mailto:support@kloudprompt.com" underline="hover" color="#42a5f5">
                support@kloudprompt.com
              </Link>
            </Typography>
            {/* <Typography>
              📞 Phone:{" "}
              <Link href="tel:+918791941719" underline="hover" color="#42a5f5">
                +91 87919 41719
              </Link>
            </Typography> */}
            {/* <Typography>
              🏢 Location: Regus, 5th Floor, Tower C, Green Boulevard, Block-B, Sector 62, Noida (UP) India - 201309
            </Typography> */}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactPage;
