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
    <div className="flex items-center gap-2">
      {THEME_OPTIONS.map((theme) => (
        <motion.button
          key={theme.id}
          onClick={() => updateMeta({ theme_id: theme.id as FormMeta['theme_id'] })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative w-10 h-10 rounded-xl border-2 transition-all overflow-hidden",
            currentTheme === theme.id
              ? "border-primary shadow-soft"
              : "border-border hover:border-primary/50"
          )}
          title={`${theme.name} - ${theme.description}`}
        >
          {/* Theme preview colors */}
          <div className={cn("absolute inset-0", theme.className)}>
            <div className="absolute inset-0 bg-background" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-primary/20" />
          </div>
          
          {/* Check mark */}
          {currentTheme === theme.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-primary/20"
            >
              <Check className="w-4 h-4 text-primary" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
