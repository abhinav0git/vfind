import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '../components/PostHogProvider'

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
          <div className="relative">
            {/* <script
              crossOrigin="anonymous"
              src="//unpkg.com/react-scan/dist/auto.global.js"
            /> */}
            <div className="relative z-10">{children}</div>
          </div>
        </PostHogProvider>
      </body>
    </html>
  )
}
