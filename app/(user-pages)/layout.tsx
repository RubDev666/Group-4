import type { Metadata } from "next";

import { Providers } from "./providers";

import { Header } from "../_components/layouts";

import '../_styles/index.scss';

export const metadata: Metadata = {
    title: "Group 4",
    description: "Explora, comparte y expresa lo que quieras con todo el mundo",
}; 

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 
    //suppressHydrationWarning - elimina el error de la consola
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="text-font">
                <Providers>
                    <Header />
                        {children}
                </Providers>
            </body>
        </html>
    );
}

