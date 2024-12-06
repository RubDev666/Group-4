import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Header, GridLayout } from "../components/layouts";

import '../styles/index.scss';

export const metadata: Metadata = {
    title: "Group 4",
    description: "Explore, share, and express what you want with everyone",
    icons: [
        {rel: 'icon', url: '/icons/favicon-16x16.png', type: 'image/svg+xml'},
        {rel: 'icon', url: '/icons/favicon-32x32.png', type: 'image/svg+xml'},
        {rel: 'icon', url: '/icons/apple-touch-icon.png', type: 'image/svg+xml'},
    ]
}; 

/*export const viewport: Viewport = {
    themeColor: '#070F2B'
}
*/
/*
            <Head>
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-status-bar-style" content="#070F2B" />
                <meta name="theme-color" content="#070F2B" />
                <link rel="icon" type="image/svg+xml" href="/icons/favicon-16x16.png" />
                <link rel="icon" type="image/svg+xml" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/svg+xml" href="/icons/apple-touch-icon.png" />
            </Head>
*/

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
