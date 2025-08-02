# Prompt Sharing Platform

This is a React application built with TypeScript and Vite that allows users to share and discover creative prompts.

## Project Structure

The project follows a standard feature-based structure to keep the codebase organized and scalable.

-   `public/`: Static assets.
-   `src/`: Application source code.
    -   `services/`: Services for interacting with the backend API.
    -   `data/`: Custom set of data
    -   `components/`: Reusable React components.
    -   `hooks/`: Custom React hooks.
    -   `models/`: TypeScript interfaces for data structures.
    -   `pages/`: Top-level page components.
    -   `utils/`: Utility functions and constants.
-   `package.json`: Project dependencies and scripts.
-   `tsconfig.json`: TypeScript configuration.
-   `vite.config.ts`: Vite configuration.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd prompt-sharing
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev