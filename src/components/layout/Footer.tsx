import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">PromptShare</h3>
            <p className="text-gray-600">Share and discover the best AI prompts</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Resources</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Company</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Connect</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500">
          <p>© {new Date().getFullYear()} PromptShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;