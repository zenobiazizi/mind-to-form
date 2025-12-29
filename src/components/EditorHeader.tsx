import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Link2, ArrowLeft, Palette } from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import ThemeSwitcher from './ThemeSwitcher';
import { toast } from '@/hooks/use-toast';

interface EditorHeaderProps {
  onPreview: () => void;
  onBack: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onPreview, onBack }) => {
  const { formData } = useFormStore();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/view/${formData.form_meta.uuid}`;
    navigator.clipboard.writeText(url);
    toast({
      title: '链接已复制',
      description: '表单链接已复制到剪贴板',
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <ThemeSwitcher />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Link2 className="w-4 h-4" />
              复制链接
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default EditorHeader;
