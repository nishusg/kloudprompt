import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { Prompt } from '../../models';

const ProfilePromptCard: React.FC<{
  prompt: Prompt;
  onDelete?: () => void;
  onRemoved?: () => void;
  onView: () => void;
}> = ({ prompt, onDelete, onRemoved, onView }) => (
  <Box
    onClick={onView}
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      p: 2,
      borderRadius: 2,
      bgcolor: '#121212',
      border: '1px solid rgba(144,202,249,0.2)',
      cursor: 'pointer',
      transition: '0.3s',
      '&:hover': {
        borderColor: '#42a5f5',
      },
    }}
  >
    {/* Left: Image */}
    <Box
      component="img"
      src={prompt.promptUrl || '/default-image.jpg'}
      alt={prompt.title}
      sx={{
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: 2,
        mr: 2,
      }}
    />

    {/* Right: Details */}
    <Box sx={{ flex: 1 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle1" fontWeight={600} color="#fff">
          {prompt.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#bbb',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {prompt.description || prompt.content}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {onDelete && (
            <Typography
              variant="caption"
              sx={{ color: '#ef5350', ml: 2, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Typography>
          )}

          {onRemoved && (
            <Typography
              variant="caption"
              sx={{ color: '#ef5350', ml: 2, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoved();
              }}
            >
              Remove
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  </Box>
);

export default ProfilePromptCard;
