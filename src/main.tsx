import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Input } from './components/input';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Input />
  </StrictMode>,
);
