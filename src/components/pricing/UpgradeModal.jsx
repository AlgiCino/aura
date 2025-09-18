import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { GlassButton } from "@/components/GlassButton";

export default function UpgradeModal({ isOpen, onClose, plan, onConfirm }) {
  const { t } = useTranslation();
  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? onClose?.() : null)}>
      <DialogContent className="bg-white/90 backdrop-blur-lg border rounded-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            {t('app.upgrade.title', 'Upgrade required')}: {plan.name}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {t('app.upgrade.body', 'This section requires a paid plan.')}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg bg-gray-50 border p-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">{t('app.labels.plan', 'Plan')}:</span>
            <span className="font-bold text-gray-900">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">{t('app.labels.price', 'Price')}:</span>
            <span className="font-bold text-gray-900">
              {plan.price}{plan.frequency || ""}
            </span>
          </div>
          <div className="text-xs text-gray-500 pt-2 border-t" />
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <GlassButton variant="neutral" onClick={onClose}>{t('app.actions.cancel', 'Cancel')}</GlassButton>
          <GlassButton variant="primary" onClick={onConfirm}>{t('app.upgrade.cta', 'Upgrade')}</GlassButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
