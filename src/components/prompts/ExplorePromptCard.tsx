import React, {  } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent} from '@mui/material';
import { Prompt } from '../../models/Prompt';

const ExplorePromptCard: React.FC<{ prompt: Prompt }> = ({ prompt }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        component={RouterLink}
        to={`/prompts/${prompt._id}`}
        aria-label={`View prompt: ${prompt.title}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          backgroundColor: '#121212',
          color: '#fff',
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
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {prompt.title}
          </Typography>
          <Typography
            variant="body2"
            color="grey.400"
            sx={{
              flexGrow: 1,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt.content}
          </Typography>
          <Typography variant="caption" color="grey.500">
            by @{prompt.author?.userName || 'Unknown'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ExplorePromptCard;