import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { AuthCallback } from './auth/AuthCallback';

const basename = import.meta.env.MODE === 'production' ? '/dear_editorial_office' : '/';

export function AppRouter() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
