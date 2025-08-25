// src/pages/TodoPage.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const features = [
  {
    phase: "Phase 1 (Launch Fast)",
    items: [
      { text: "Prompt Portfolios (Creator Branding)", done: false },
      { text: "AI Co-Pilot for Prompt Writing", done: false },
      { text: "Prompt Marketplace with Licensing", done: false },
    ],
  },
  {
    phase: "Phase 2 (Next Stage)",
    items: [
      { text: "Cross-Model Compatibility Checker", done: false },
      { text: "Auto-Prompt Testing (Benchmarking)", done: false },
      { text: "Prompt Playground Recording & Replay", done: false },
    ],
  },
  {
    phase: "Phase 3 (Growth Stage)",
    items: [
      { text: "Prompt-to-Workflow Builder", done: false },
      { text: "Collab Mode (Pair Prompting)", done: false },
    ],
  },
  {
    phase: "Optional / Viral Features",
    items: [
      { text: "Live Prompt Battles (Community Game)", done: false },
      { text: "AI-in-the-Loop Suggestions", done: false },
    ],
  },
];

// 🔹 Custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0a", // overall page
      paper: "#121212", // cards
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.6)",
    },
    primary: {
      main: "#90caf9", // light blue highlight
    },
  },
});

const TodoPage: React.FC = () => {
  const [todoState, setTodoState] = useState(features);

  const handleToggle = (phaseIndex: number, itemIndex: number) => {
    const newState = [...todoState];
    newState[phaseIndex].items[itemIndex].done =
      !newState[phaseIndex].items[itemIndex].done;
    setTodoState(newState);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ color: "white" }}
          >
            🚀 Future Roadmap / Todos
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Track upcoming features, prioritize work, and tick off progress as you go.
          </Typography>

          <Stack spacing={3} mt={3}>
            {todoState.map((phase, pIndex) => (
              <Card
                key={phase.phase}
                elevation={4}
                sx={{ bgcolor: "background.paper", borderRadius: 3 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", mb: 1 }}
                    fontWeight="bold"
                  >
                    {phase.phase}
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />

                  <Stack spacing={1}>
                    {phase.items.map((item, iIndex) => (
                      <Box
                        key={item.text}
                        display="flex"
                        alignItems="center"
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: item.done
                            ? "rgba(144, 202, 249, 0.08)"
                            : "transparent",
                          transition: "0.2s",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <Checkbox
                          checked={item.done}
                          onChange={() => handleToggle(pIndex, iIndex)}
                          color="primary"
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: item.done ? "line-through" : "none",
                            color: item.done ? "text.disabled" : "text.primary",
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TodoPage;
