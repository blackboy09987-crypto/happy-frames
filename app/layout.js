import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://happyframes.online"),
  title: "Happy Frames — Frames that make you happy",
  description:
    "Handcrafted photo frames in Pakistan. Premium quality, custom sizes aur designs — jo har deewar ko muskuraahat de. Free delivery all over Pakistan.",
  keywords: ["photo frames", "picture frames", "custom frames", "Happy Frames", "Pakistan frames"],
  openGraph: {
    title: "Happy Frames — Frames that make you happy",
    description: "Handcrafted photo frames. Premium quality, custom sizes, free delivery in Pakistan.",
    url: "https://happyframes.online",
    siteName: "Happy Frames",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport = { themeColor: "#2E3352" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,600&family=Poppins:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
