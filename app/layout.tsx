import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}