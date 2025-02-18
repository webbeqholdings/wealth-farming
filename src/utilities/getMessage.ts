import { useTranslation } from 'react-i18next'

export const useGetMessage = () => {
    const { t } = useTranslation()
    return (messageField: string | object): string => {
        if (typeof messageField === 'string') {
        try {
            const messageData = JSON.parse(messageField);
            if (messageData.key == null){
                return t(messageField);
            }
            return t(messageData.key, messageData.params || {}) as string;
        } catch (e) {
            return t(messageField);
        }
        }
        return '';
    }
  };