import React, { useEffect, useState } from 'react';
import { getPrompts, getPopularTags } from '../services/PromptService';
import PromptCard from '../components/prompts/PromptCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Prompt } from '../models/Prompt';
import { Popular } from '../utils/Constants';

const HomePage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsData, tagsData] = await Promise.all([
          getPrompts({ sort: Popular, limit: 9 }),
          getPopularTags(),
        ]);
        setPrompts(promptsData);
        setTags(tagsData);
      } catch (err) {
        setError('Failed to fetch prompts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePromptClick = (id: string) => {
    navigate(`/prompts/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Prompts</h1>
        <p className="text-gray-600">
          Find and share the best prompts for AI tools
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Prompts</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onClick={handlePromptClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;