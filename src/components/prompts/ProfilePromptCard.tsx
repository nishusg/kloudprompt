import React from 'react';
import { Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { Prompt } from '../../models';

const ProfilePromptCard: React.FC<{
  prompt: Prompt;
  onDelete?: () => void;
  onView: () => void;
}> = ({ prompt, onDelete, onView }) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#121212',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(144,202,249,0.15)',
      borderRadius: 4,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(144,202,249,0.3)',
        borderColor: '#90caf9',
      },
    }}
    onClick={onView}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.3 }}
      >
        {prompt.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {prompt.content}
      </Typography>
    </CardContent>

    {onDelete && (
      <CardActions sx={{ pl: 2, pb: 2, justifyContent: 'flex-start' }}>
        <Button
          size="small"
          sx={{
            color: '#ef5350',
            '&:hover': { color: '#f6685e' },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </Button>
      </CardActions>
    )}
  </Card>
);

export default ProfilePromptCard;
