import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '../components/PostHogProvider'
import { AuthProvider } from '../lib/authContext'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'VFind - Visual Search Engine',
  description: '',
  generator: '',
}

export default function RootLayout({ children }:
  Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <AuthProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="relative">
              <div className="relative z-10">{children}</div>
            </div>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
