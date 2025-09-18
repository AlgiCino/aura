import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

export default function BackgroundTuner({ pastel, onPastelChange, white, onWhiteChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // Safe slider component fallback
  const SimpleSlider = ({ value, onChange, max = 100, step = 1 }) => (
    <input
      type="range"
      min="0"
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
      }}
    />
  );

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen && (
        <GlassCard className="mb-3 p-4 min-w-[280px] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">{t('app.bg_tuner.title', 'Background')}</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-white/20"
              aria-label={t('app.actions.close', 'Close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block font-medium">{t('app.bg_tuner.pastel', 'Pastel')}</label>
              <SimpleSlider
                value={pastel * 100}
                onChange={(v) => onPastelChange(v / 100)}
                max={100}
                step={1}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{Math.round(pastel * 100)}%</span>
                <div className="w-4 h-4 rounded-full border border-white/60" 
                     style={{ 
                       background: `linear-gradient(45deg, 
                         rgba(168,85,247,${pastel}), 
                         rgba(59,130,246,${pastel}), 
                         rgba(16,185,129,${pastel}))` 
                     }} 
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-600 mb-2 block font-medium">{t('app.bg_tuner.veil', 'White veil')}</label>
              <SimpleSlider
                value={white * 100}
                onChange={(v) => onWhiteChange(v / 100)}
                max={100}
                step={1}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{Math.round(white * 100)}%</span>
                <div className="w-4 h-4 rounded-full border border-white/60" 
                     style={{ backgroundColor: `rgba(255,255,255,${white})` }} 
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-white/20">
              <label className="text-xs text-gray-600 mb-2 block font-medium">{t('app.bg_tuner.presets', 'Quick Presets')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onPastelChange(0.26);
                    onWhiteChange(0.92);
                  }}
                  className="px-2 py-1 text-xs bg-white/40 hover:bg-white/60 border border-white/60 rounded-md transition-colors"
                >
                  {t('app.bg_tuner.default', 'Default')}
                </button>
                <button
                  onClick={() => {
                    onPastelChange(0.15);
                    onWhiteChange(0.95);
                  }}
                  className="px-2 py-1 text-xs bg-white/40 hover:bg-white/60 border border-white/60 rounded-md transition-colors"
                >
                  {t('app.bg_tuner.minimal', 'Minimal')}
                </button>
                <button
                  onClick={() => {
                    onPastelChange(0.45);
                    onWhiteChange(0.85);
                  }}
                  className="px-2 py-1 text-xs bg-white/40 hover:bg-white/60 border border-white/60 rounded-md transition-colors"
                >
                  {t('app.bg_tuner.vibrant', 'Vibrant')}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center hover:bg-white/80 transition-colors hover:scale-105 transform"
        aria-label={isOpen ? t('app.actions.close', 'Close') : t('app.actions.open', 'Open')}
      >
        <Settings className={`w-5 h-5 text-gray-700 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}
