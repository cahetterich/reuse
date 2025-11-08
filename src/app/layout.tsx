// src/app/layout.tsx
import "./globals.css";
import Chrome from "./Chrome";

export const metadata = {
  title: "ReUse! - Web",
  description: "Plataforma ReUse! – repensar, reaproveitar, reconectar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
                                                                                                                                                                                                                                                                                    