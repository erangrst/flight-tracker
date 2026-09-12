import { ExternalToast, toast } from 'sonner';

export type SeverityType = 'success' | 'warning' | 'error' | 'info';

const toastMapper: Record<SeverityType, (msg: string, opts: ExternalToast) => void> = {
  success: toast.success,
  warning: toast.warning,
  info: toast.info,
  error: toast.error,
};

export function showNotification(id: string, severity: SeverityType, primaryMessage: string, secondaryMessage = '') {
  const options: ExternalToast = { id, duration: 3000, richColors: true, closeButton: true, position: 'top-right', description: secondaryMessage };

  const notify = toastMapper[severity] || toast.info;
  notify(primaryMessage, options);
}
