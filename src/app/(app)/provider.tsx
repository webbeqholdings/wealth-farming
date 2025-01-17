'use client'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { I18nProvider, useI18n } from '@/i18n/LanguageContext';

interface RootLayoutProps {
    children: React.ReactNode
  }

export default function RootProvider({ children }: RootLayoutProps) {
    return (
        <I18nextProvider i18n={i18n}>
            <I18nProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div vaul-drawer-wrapper="">
                        <div className="relative flex min-h-screen flex-col bg-background">
                            {/* <AuthProvider> */}
                            {children}
                            <Toaster />
                            {/* </AuthProvider> */}
                        </div>
                    </div>
                </ThemeProvider>
            </I18nProvider>
        </I18nextProvider>
    )
}