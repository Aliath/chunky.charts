import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>
  </StrictMode>
);
