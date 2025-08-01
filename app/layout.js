import "./globals.css";
import SessionWrapper from "./SessionWrapper";

export const metadata = {
  title: "Assignment Submission Portal",
  description: "Portal for instructors and students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-800 min-h-screen">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
