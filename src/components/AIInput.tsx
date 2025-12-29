import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AIInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const AIInput: React.FC<AIInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const suggestions = [
    '帮我做一个咖啡口味调研',
    '创建客户满意度调查',
    '设计活动报名表单',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-card rounded-2xl shadow-elevated border border-border/50 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI 表单生成器</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述您想要的表单，例如：帮我做一个咖啡口味调研..."
              className="w-full px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none text-lg min-h-[120px]"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-between px-5 py-4 bg-muted/30">
              <span className="text-xs text-muted-foreground">按 Enter 发送</span>
              <motion.button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse-soft">生成中</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    生成表单
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            onClick={() => setPrompt(suggestion)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="px-4 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors"
            disabled={isLoading}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default AIInput;
