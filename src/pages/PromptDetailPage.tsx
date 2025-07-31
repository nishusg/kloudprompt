import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById, upvotePrompt } from '../services/PromptService';
import { getComments, addComment } from '../services/CommentService';
import { Prompt, Comment } from '../models';
import Button from '../components/common/Button';
import { formatDate } from '../utils/Formatters';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptData, commentsData] = await Promise.all([
          getPromptById(id!),
          getComments(id!),
        ]);
        setPrompt(promptData);
        setComments(commentsData);
      } catch (err) {
        setError('Failed to fetch prompt data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpvote = async () => {
    if (!prompt) return;
    try {
      const updatedPrompt = await upvotePrompt(prompt.id);
      setPrompt(updatedPrompt);
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !prompt) return;
    try {
      const comment = await addComment(prompt.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!prompt) return <div>Prompt not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{prompt.title}</h1>
            <Button
              variant={prompt.upvoted ? 'primary' : 'outline'}
              size="sm"
              onClick={handleUpvote}
            >
              ▲ {prompt.upvotes}
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{prompt.description}</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {prompt.content}
              </pre>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.map((tag : any) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Created by{' '}
              <span className="font-medium text-gray-700">
                {prompt.author.username}
              </span>{' '}
              on {formatDate(prompt.createdAt)}
            </div>
            <div>{prompt.views} views</div>
          </div>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.username}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>

        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;