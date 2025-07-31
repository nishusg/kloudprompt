import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/UseAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          PromptShare
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-blue-600">
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/create" className="text-gray-700 hover:text-blue-600">
                Create
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;