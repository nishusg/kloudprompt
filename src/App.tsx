import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PromptDetailPage from './pages/PromptDetailPage';
import CreatePromptPage from './pages/CreatePromptPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
//import { AuthProvider } from './hooks/UseAuth';
//import ProtectedRoute from './components/common/ProtectedRoute';

const App: React.FC = () => {
  return (
    //<AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prompts/:id" element={<PromptDetailPage />} />
              <Route
                path="/create"
                element={
                  //<ProtectedRoute>
                    <CreatePromptPage />
                  //</ProtectedRoute>
                }
              />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    //</AuthProvider>
  );
};

export default App;