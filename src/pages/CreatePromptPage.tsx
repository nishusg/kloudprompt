import React from 'react';
import { useNavigate } from 'react-router-dom';
import PromptForm from '../components/prompts/PromptForm';
import { createPrompt } from '../services/PromptService';
import { useAuth } from '../hooks/UseAuth';
import Card from '../components/common/Card';
import { CreatePromptDto } from '../models/Prompt';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (data: CreatePromptDto) => {
    try {
      await createPrompt(data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Create New Prompt</h1>
          <PromptForm onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};

export default CreatePromptPage;