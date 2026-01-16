import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { THEME_OPTIONS, FormMeta } from '@/types/form';
import { useFormStore } from '@/stores/formStore';
import { cn } from '@/lib/utils';

const ThemeSwitcher: React.FC = () => {
  const { formData, updateMeta } = useFormStore();
  const currentTheme = formData.form_meta.theme_id;

  return (
    <div className="flex items-center gap-3">
      {THEME_OPTIONS.map((theme) => {
        const isActive = currentTheme === theme.id;
        const preview = theme.preview;
        
        return (
          <motion.button
            key={theme.id}
            onClick={() => updateMeta({ theme_id: theme.id as FormMeta['theme_id'] })}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative w-12 h-12 rounded-xl transition-all overflow-hidden group",
              isActive
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                : "border-2 border-border hover:border-primary/50 hover:shadow-md"
            )}
            title={`${theme.name} - ${theme.description}`}
            style={{ backgroundColor: preview?.bg }}
          >
            {/* Theme preview visualization */}
            <div className="absolute inset-0 flex flex-col p-1.5">
              {/* Mini card preview */}
              <div 
                className={cn(
                  "flex-1 rounded-sm mb-1",
                  preview?.style === 'minimalist' && "border-b border-current opacity-30",
                  preview?.style === 'cyber' && "bg-white/10 backdrop-blur border border-purple-500/30",
                  preview?.style === 'soft' && "bg-white/80 rounded-lg shadow-sm",
                  preview?.style === 'professional' && "bg-white border-l-2 shadow-sm"
                )}
                style={{ 
                  borderLeftColor: preview?.style === 'professional' ? preview?.accent : undefined,
                  backgroundColor: preview?.style === 'soft' ? 'rgba(255,255,255,0.9)' : 
                                   preview?.style === 'professional' ? 'white' : undefined
                }}
              />
              
              {/* Mini button preview */}
              <div 
                className={cn(
                  "h-2",
                  preview?.style === 'minimalist' && "rounded-none",
                  preview?.style === 'cyber' && "rounded-full bg-gradient-to-r from-purple-500 to-pink-500",
                  preview?.style === 'soft' && "rounded-full",
                  preview?.style === 'professional' && "rounded-sm"
                )}
                style={{ 
                  backgroundColor: preview?.style !== 'cyber' ? preview?.accent : undefined 
                }}
              />
            </div>
            
            {/* Active indicator */}
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-gray-900" />
                </div>
              </motion.div>
            )}

            {/* Hover tooltip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg">
                {theme.name}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;