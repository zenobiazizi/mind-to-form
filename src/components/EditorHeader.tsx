import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Share2, ArrowLeft, Palette, Save } from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import ThemeSwitcher from './ThemeSwitcher';

interface EditorHeaderProps {
  onPreview: () => void;
  onBack: () => void;
  onPublish?: () => void;
  onSave?: () => void;
  isPublished?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onPreview, onBack, onPublish, onSave, isPublished }) => {
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

            {onSave && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览
            </motion.button>

            {onPublish && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPublish}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
                {isPublished ? '分享' : '发布'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default EditorHeader;
