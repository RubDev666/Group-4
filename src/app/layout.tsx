import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header, GridLayout } from "../components/layouts";

import '../styles/index.scss';

export const metadata: Metadata = {
    title: "Group 4",
    description: "Explora, comparte, y expresa lo que quieras con todo el mundo",
}; 

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    //suppressHydrationWarning - remove error in the console
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="text-font">
                <Providers>
                    <Header />

                    <GridLayout>
                        {children}
                    </GridLayout>
                </Providers>
            </body>
        </html>
    );
}
