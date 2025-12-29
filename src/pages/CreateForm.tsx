import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import AIInput from '@/components/AIInput';
import LoadingOverlay from '@/components/LoadingOverlay';
import { generateFormFromPrompt } from '@/lib/ai';
import { useFormStore } from '@/stores/formStore';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const CreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setFormData, saveForm } = useFormStore();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const generatedForm = await generateFormFromPrompt(prompt);
      setFormData(generatedForm);
      saveForm();
      navigate(`/editor/${generatedForm.form_meta.uuid}`);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">新建表单</span>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
          {/* Hero text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4 whitespace-nowrap w-full flex justify-center"
          >
            <span>用一句话 <span className="text-primary">创建精美表单</span></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-12 whitespace-nowrap w-full flex justify-center"
          >
            <span>AI 自动设计问题逻辑，生成高颜值表单。告别繁琐操作，专注内容本身。</span>
          </motion.p>

          {/* AI Input */}
          <AIInput onGenerate={handleGenerate} isLoading={isLoading} />

          {/* Features hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            {['智能问题生成', '4款精美主题', '移动端适配', '一键发布'].map((feature) => (
              <span key={feature} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {feature}
              </span>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateForm;
