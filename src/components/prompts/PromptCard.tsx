import React from 'react';
import { Prompt } from '../../models/Prompt';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/Formatters';

interface PromptCardProps {
  prompt: Prompt;
  onUpvote?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onUpvote,
  onBookmark,
  onClick,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => onClick?.(prompt.id)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{prompt.title}</h3>
          <span className="text-sm text-gray-500">
            {formatDate(prompt.createdAt)}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{prompt.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={prompt.upvoted ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onUpvote?.(prompt.id)}
          >
            ▲ {prompt.upvotes}
          </Button>
          <span className="text-sm text-gray-500">
            {prompt.views} views
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBookmark?.(prompt.id)}
        >
          Bookmark
        </Button>
      </div>
    </Card>
  );
};

export default PromptCard;