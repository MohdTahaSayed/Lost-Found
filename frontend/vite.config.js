import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: `${projectDirectory}index.html`,
                login: `${projectDirectory}login.html`,
                register: `${projectDirectory}register.html`,
                userDashboard: `${projectDirectory}user-dashboard.html`,
                adminDashboard: `${projectDirectory}admin-dashboard.html`,
                reportItem: `${projectDirectory}report-item.html`,
                browseItems: `${projectDirectory}browse-items.html`,
            },
        },
    },
    server: { port: 5173, strictPort: false },
});