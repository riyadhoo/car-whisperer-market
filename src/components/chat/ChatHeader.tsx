
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Wrench, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ChatHeader() {
  const { t } = useLanguage();
  
  return (
    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">{t('chat.title')}</CardTitle>
      </div>
      <div className="flex items-center space-x-1 ml-auto text-sm text-muted-foreground">
        <Wrench className="h-4 w-4" />
        <span>{t('chat.troubleshooting')}</span>
        <Car className="h-4 w-4 ml-2" />
        <span>{t('chat.recommendations')}</span>
      </div>
    </CardHeader>
  );
}
