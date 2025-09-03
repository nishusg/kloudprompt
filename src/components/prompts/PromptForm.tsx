// src/components/prompts/PromptForm.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  Box,
  MenuItem,
  Grid,
  Alert
} from "@mui/material";
import { CreatePromptDto } from "../../models/Prompt";
import { validatePrompt } from "../../utils/Validators";
import { GenerationTypeEnum, ProviderTypeEnum, VerificationStatus } from "../../utils/Enum";
import { useAuth } from "../../context/AuthContext";

interface PromptFormProps {
  initialData?: CreatePromptDto;
  onSubmit: (data: CreatePromptDto) => Promise<void>;
  isLoading?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({
  initialData = {
    title: "",
    content: "",
    description: "",
    modelType: ProviderTypeEnum.CHATGPT,
    generationType: GenerationTypeEnum.TEXT,
    tags: [],
  },
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreatePromptDto>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setFormData(initialData);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validation = validatePrompt(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      await onSubmit(formData);
    },
    [formData, onSubmit]
  );

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "#121212",
        color: "#fff",
        boxShadow: 6,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        {/* Info message if user not verified */}
        {user?.verificationStatus !== VerificationStatus.Verified && (
          <Alert severity="info" sx={{ bgcolor: "#1e1e1e", color: "#90caf9" }}>
            You cannot create a new prompt until you verify your email.
          </Alert>
        )}
        <Typography variant="h5" fontWeight="bold">
          Create a New Prompt
        </Typography>

        {/* Title */}
        <TextField
          label="Title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          variant="outlined"
          placeholder="Title of your prompt"
          InputProps={{
            sx: { color: "white" },
          }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
        />

        {/* Model & Generation in one row always */}
        <Box>
          <Grid container spacing={2}>
            {/* Model Type */}
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Model Type"
                name="modelType"
                value={formData.modelType || ""}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: { color: "white" },
                }}
                InputLabelProps={{
                  sx: { color: "#ccc" },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: { bgcolor: "#1e1e1e", color: "#fff" },
                    },
                    disableScrollLock: true,
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(ProviderTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Generation Type */}
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Generation Type"
                name="generationType"
                value={formData.generationType || ""}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: { color: "white" },
                }}
                InputLabelProps={{
                  sx: { color: "#ccc" },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: { bgcolor: "#1e1e1e", color: "#fff" },
                    },
                    disableScrollLock: true,
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(GenerationTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>


        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Briefly describe your prompt..."
          InputProps={{
            sx: { color: "white" },
          }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
        />

        {/* Content */}
        <TextField
          label="Prompt Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          placeholder="Write the full prompt here..."
          InputProps={{
            sx: { fontFamily: "monospace", color: "white" },
          }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
        />

        {/* Tags */}
        <Box>
          <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
            Tags
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag and press Enter"
              variant="outlined"
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{ sx: { color: "#ccc" } }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTag}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{
                  backgroundColor: "#1e3a8a",
                  color: "#bbdefb",
                  border: "1px solid #1976d2",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Submit */}
        <Box display="flex" justifyContent="flex-end">
          {/* Submit button with tooltip */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              isLoading || user?.verificationStatus !== VerificationStatus.Verified
            }
            sx={{
              "&.Mui-disabled": {
                backgroundColor: "gray", // custom disabled color
                color: "#fff",
              },
            }}
          >
            {isLoading ? "Submitting..." : "Submit Prompt"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PromptForm;
