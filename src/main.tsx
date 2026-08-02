import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import '@fontsource-variable/inter'
import '@fontsource-variable/noto-sans-devanagari'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient.ts'
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
      <Analytics />
      <SpeedInsights sampleRate={1} />
    </QueryClientProvider>
  </StrictMode>,
)
