'use client';

import { ThemeProvider } from 'next-themes';

//el codigo original llevaba esto, pero era un ejemplo con tailwind
//<ThemeProvider attribute="class" defaultTheme='system' enableSystem>
 
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
                {children}
        </ThemeProvider>
    )
}
