export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): {
  valid: boolean;
  message?: string;
} => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  return { valid: true };
};

export const validateUsername = (username: string): {
  valid: boolean;
  message?: string;
} => {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
};

export const validatePrompt = (prompt: {
  title: string;
  content: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!prompt.title.trim()) {
    errors.title = 'Title is required';
  } else if (prompt.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (!prompt.content.trim()) {
    errors.content = 'Prompt content is required';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};