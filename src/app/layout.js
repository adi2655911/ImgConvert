import Head from "next/head"

export const metadata = {
  title: 'ImgConv',
  description: 'Convert and resize your images quickly and easily.',
};

export default function RootLayout( { children }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Optional Tailwind Config */}
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  purple: {
                    600: '#7e22ce',
                    700: '#6b21a8'
                  }
                }
              }
            }
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}