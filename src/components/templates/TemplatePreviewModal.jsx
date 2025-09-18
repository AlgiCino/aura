import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TemplatePreviewModal({ template, open, onOpenChange }) {
  if (!template) return null;
  const shots = (template.screenshots && template.screenshots.length
    ? template.screenshots
    : (template.preview_image_url ? [template.preview_image_url] : [])
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white/85 backdrop-blur-xl border border-white/70 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{template.name} — Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shots.map((src, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-white/70">
                  <img src={src} alt={`s-${idx}`} className="w-full h-36 object-cover" />
                </div>
              ))}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-800 mb-1">Quick demo JSON</div>
            <pre className="bg-white/70 border border-white/70 rounded-lg p-3 text-xs text-gray-800 overflow-auto max-h-56">
              {JSON.stringify(template.demo_json || template.export_manifest || {}, null, 2)}
            </pre>
          </div>
          {template.changelog && (
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">Changelog</div>
              <pre className="bg-white/70 border border-white/70 rounded-lg p-3 text-xs text-gray-800 whitespace-pre-wrap">
                {template.changelog}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}