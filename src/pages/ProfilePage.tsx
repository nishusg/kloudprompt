import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, getUserPrompts } from '../services/UserService';
import { Prompt } from '../models/Prompt';
import PromptCard from '../components/prompts/PromptCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { User } from '../models/User';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, promptsData] = await Promise.all([
          getUserById(id!),
          getUserPrompts(id!),
        ]);
        setUser(userData);
        setPrompts(promptsData);
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-500">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
              <div className="flex gap-4 mt-4">
                <div>
                  <span className="font-semibold">{user.followersCount}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{user.followingCount}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Prompts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
        {prompts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No prompts created yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;