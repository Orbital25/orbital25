<div align="center">
  <img src="https://raw.githubusercontent.com/tabila-dev/nasa-space-exploration/main/public/logo.png" alt="Space Explorer Academy Logo" width="150">
  <h1 align="center">Space Explorer Academy</h1>
  <p align="center">
    An interactive educational platform to experience life as an astronaut, built with React, Vite, TypeScript, and Supabase.
  </p>
</div>

---

## 🚀 Features

- **Homepage**: An immersive landing page with a dynamic starry background.
- **Avatar Customization**: Create your unique astronaut profile.
- **Cupola Mode**: Observe Earth from the ISS with real-time tracking and location info.
- **NBL Training**: Simulate spacewalks in the Neutral Buoyancy Laboratory, including buoyancy control and lunar sample collection.
- **Achievements System**: Earn badges and points for completing missions.
- **User Profiles**: Track your progress, stats, and earned achievements.
- **Supabase Backend**: Securely stores all user data, progress, and mission logs.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: `lucide-react` for icons

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/tabila-dev/nasa-space-exploration.git
    cd nasa-space-exploration
    ```

2.  **Install Project Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Your Supabase Project**
    - Go to supabase.com and create a new project.
    - In your project's dashboard, go to **Project Settings** > **API**. You will need the **Project URL** and the **`anon` `public` key**.

4.  **Configure Environment Variables**
    - Create a new file named `.env.local` in the root of the project.
    - Add your Supabase credentials to this file:
    ```.env.local
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

5.  **Configure Supabase Authentication**
    - In your Supabase project dashboard, navigate to **Authentication** > **Providers**.
    - Click to expand the **Email** provider.
    - Toggle off the **"Confirm email"** option and click **Save**. This is required for the app's guest sign-up flow to work correctly.

6.  **Set Up the Database Schema**
    This project uses the Supabase CLI to manage database migrations. You can install and run it locally without needing `sudo` or root permissions.

    - **Install the CLI locally:**
      ```bash
      npm install supabase --save-dev
      ```

    - **Log in to Supabase:**
      This command will open a browser window for you to grant access.
      ```bash
      npx supabase login
      ```

    - **Link your project:**
      Replace `<your-project-id>` with the "Project Ref" from your Supabase project's settings.
      ```bash
      npx supabase link --project-ref <your-project-id>
      ```

    - **Push the database schema:**
      This command will read the local migration files and create all the necessary tables and policies in your cloud database.
      ```bash
      npx supabase db push
      ```

7.  **Run the Development Server**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
