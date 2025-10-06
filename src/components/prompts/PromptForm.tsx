// src/components/prompts/PromptForm.tsx
import React, { useState, useCallback } from "react";
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
} from "@mui/material";
import { CreatePromptDto } from "../../models/Prompt";
import { validatePrompt } from "../../utils/Validators";
import {
  GenerationTypeEnum,
  ProviderTypeEnum,
  VerificationStatus,
  PromptCategoryEnum,
} from "../../utils/Enum";
import { useAuth } from "../../context/AuthContext";
import InfoIcon from "@mui/icons-material/Info";

interface PromptFormProps {
  initialData?: CreatePromptDto;
  onSubmit: (data: CreatePromptDto, fd: FormData) => Promise<void>;
  isLoading?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({
  initialData = {
    title: "",
    content: "",
    description: "",
    modelType: ProviderTypeEnum.CHATGPT,
    generationType: GenerationTypeEnum.IMAGE,
    category: PromptCategoryEnum.Productivity,
    tags: [],
    promptUrl: "",
    promptImage: {} as File,
  },
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreatePromptDto>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [imageError, setImageError] = useState("");

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

      const fd = new FormData();
      if (
        formData.generationType === GenerationTypeEnum.IMAGE &&
        formData.promptImage
      ) {
        fd.append("promptImage", formData.promptImage);
      }

      await onSubmit(formData, fd);
    },
    [formData, onSubmit]
  );

  return (
    <>
      {/* Info message if user not verified */}
      {user?.verificationStatus !== VerificationStatus.Verified && (
        <Paper
          sx={{
            p: 2,
            bgcolor: "#121212",
            mb: 3,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InfoIcon sx={{ color: "#90caf9" }} />
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            You cannot create a new prompt until you verify your email.
          </Typography>
        </Paper>
      )}

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
          <Typography variant="h5" fontWeight="bold">
            Compose Your Prompt
          </Typography>

          {/* Title */}
          <TextField
            label="Title"
            name="title"
            required
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

          {/* Model, Generation, Category in one row */}
          <Box>
            <Grid container spacing={2}>
              {/* Model Type */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Model Type"
                  name="modelType"
                  required
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
                        sx: { bgcolor: "#121212", color: "#fff" },
                      },
                      disableScrollLock: true,
                    },
                  }}
                >
                  {Object.values(ProviderTypeEnum).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Generation Type */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Generation Type"
                  name="generationType"
                  required
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
                        sx: { bgcolor: "#121212", color: "#fff" },
                      },
                      disableScrollLock: true,
                    },
                  }}
                >
                  {Object.values(GenerationTypeEnum).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  required
                  value={formData.category || ""}
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
                        sx: { bgcolor: "#121212", color: "#fff" },
                      },
                      disableScrollLock: true,
                    },
                  }}
                >
                  {Object.values(PromptCategoryEnum).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
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
            required
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
            required
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

          {/* Image Upload */}
          {formData.generationType === GenerationTypeEnum.IMAGE && (
            <Box>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                Upload Prompt Image (Max 2MB)
              </Typography>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxSize = 2 * 1024 * 1024; // 2MB
                      if (file.size > maxSize) {
                        setImageError("Image size must be less than 2MB.");
                        e.target.value = "";
                        return;
                      }
                      setImageError("");
                      setFormData((prev) => ({
                        ...prev,
                        promptImage: file,
                      }));
                    }
                  }}
                />
              </Button>

              {formData.promptImage && (
                <Typography variant="body2" sx={{ color: "#90caf9" }}>
                  Selected file: {formData.promptImage.name}
                </Typography>
              )}

              {imageError && (
                <Typography variant="body2" sx={{ color: "red", mt: 1 }}>
                  {imageError}
                </Typography>
              )}
            </Box>
          )}

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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                isLoading ||
                user?.verificationStatus !== VerificationStatus.Verified
              }
              sx={{
                "&.Mui-disabled": {
                  backgroundColor: "gray",
                  color: "#fff",
                },
              }}
            >
              {isLoading ? "Submitting..." : "Submit Prompt"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default PromptForm;
