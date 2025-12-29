import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText } from 'lucide-react';
import AIInput from '@/components/AIInput';
import LoadingOverlay from '@/components/LoadingOverlay';
import FormEditor from '@/components/FormEditor';
import FormViewer from '@/components/FormViewer';
import EditorHeader from '@/components/EditorHeader';
import { generateFormFromPrompt } from '@/lib/ai';
import { useFormStore } from '@/stores/formStore';
type ViewMode = 'landing' | 'editor' | 'preview';
const Index: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const {
    formData,
    setFormData
  } = useFormStore();
  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const generatedForm = await generateFormFromPrompt(prompt);
      setFormData(generatedForm);
      setViewMode('editor');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    if (viewMode === 'preview') {
      setViewMode('editor');
    } else {
      setViewMode('landing');
    }
  };
  return <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingOverlay key="loading" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {viewMode === 'landing' && <motion.div key="landing" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="min-h-screen flex flex-col items-center justify-center px-6 relative">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
              {/* Logo/Brand */}
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="inline-flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-foreground">​SuperForm </span>
              </motion.div>

              {/* Hero text */}
              <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                用一句话
                <br />
                <span className="text-gradient">创建精美表单</span>
              </motion.h1>

              <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto">
                AI 自动设计问题逻辑，生成高颜值表单。告别繁琐操作，专注内容本身。
              </motion.p>

              {/* AI Input */}
              <AIInput onGenerate={handleGenerate} isLoading={isLoading} />

              {/* Features hint */}
              <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.6
          }} className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                {['智能问题生成', '4款精美主题', '移动端适配', '一键发布'].map((feature, i) => <span key={feature} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    {feature}
                  </span>)}
              </motion.div>
            </div>
          </motion.div>}

        {viewMode === 'editor' && <motion.div key="editor" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <EditorHeader onPreview={() => setViewMode('preview')} onBack={handleBack} />
            <main className="py-8 px-4">
              <FormEditor />
            </main>
          </motion.div>}

        {viewMode === 'preview' && <motion.div key="preview" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="relative">
            {/* Preview header */}
            <div className="sticky top-0 z-50 bg-foreground/90 backdrop-blur-lg text-background">
              <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">预览模式</span>
                <button onClick={handleBack} className="px-4 py-1.5 text-sm font-medium bg-background/20 hover:bg-background/30 rounded-lg transition-colors">
                  返回编辑
                </button>
              </div>
            </div>
            <FormViewer formData={formData} isPreview />
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default Index;