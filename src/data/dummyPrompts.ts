// src/data/dummyPrompts.ts

import { Prompt } from '../models/Prompt';

export const dummyPrompts: Prompt[] = [
  {
    "id": "prompt-001",
    "title": "Catchy Email Subject Line Generator",
    "content": "Generate 5 catchy and click-worthy email subject lines...",
    "description": "This prompt helps you craft compelling email subject lines...",
    "tags": ["email", "marketing", "copywriting", "sales"],
    "author": {
      "id": "user-101",
      "username": "Alice Johnson",
      "avatar": "https://example.com/avatars/alice.png"
    },
    "upvotes": 1254,
    "upvoted": true,
    "views": 15234,
    "createdAt": "2025-07-15T10:30:00Z",
    "updatedAt": "2025-07-28T12:00:00Z",
    // ... other properties
  },
  {
    "id": "prompt-002",
    "title": "Natural Language to SQL Query",
    "content": "Based on the following table schema...",
    "description": "Translate plain English requests into accurate SQL queries...",
    "tags": ["sql", "database", "developer tools"],
    "author": {
      "id": "user-102",
      "username": "Bob Williams",
      "avatar": "https://example.com/avatars/bob.png"
    },
    "upvotes": 3489,
    "upvoted": false,
    "views": 45102,
    "createdAt": "2025-06-20T14:00:00Z",
    "updatedAt": "2025-06-20T14:00:00Z",
    // ... other properties
  }
  // ... include the rest of the prompts here
];