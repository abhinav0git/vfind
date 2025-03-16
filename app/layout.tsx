import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Search from Image',
  description: '',
  generator: '',
}

export default function RootLayout({ children }:
  Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">

      <body>
        <div className="relative">
          {/* <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          /> */}
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
