import i18n from '@/i18n/i18n';

import { cn } from '@/lib/utils'
import { I18nProvider, useI18n } from '@/i18n/LanguageContext';
import { Button, buttonVariants } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LucideCheck, LucideLanguages } from "lucide-react";
export default function LanguageSwitch() {
    const { language, changeLanguage } = useI18n();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className={cn(
                        buttonVariants({
                            variant: 'ghost',
                        }),
                        'h-8 w-8 px-0',
                    )}
                >
                    <LucideLanguages size={18} />
                    <span className="sr-only">Facebook</span>
                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    {language == 'en' ? <LucideCheck size={16} className="mr-2 h-4 w-4" /> : <div className="mr-2 h-4 w-4"></div>}
                    <span>English</span>

                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => changeLanguage('vi')}>
                    {language == 'vi' ? <LucideCheck size={16} className="mr-2 h-4 w-4" /> : <div className="mr-2 h-4 w-4"> </div>}
                    <span>VietNamese</span>

                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}