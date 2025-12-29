import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import FormEditor from '@/components/FormEditor';
import FormViewer from '@/components/FormViewer';
import EditorHeader from '@/components/EditorHeader';
import ShareModal from '@/components/ShareModal';
import { useFormStore } from '@/stores/formStore';

type ViewMode = 'editor' | 'preview';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const { formData, loadForm, saveForm, publishForm } = useFormStore();

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id, loadForm]);

  const handleBack = () => {
    if (viewMode === 'preview') {
      setViewMode('editor');
    } else {
      saveForm();
      navigate('/');
    }
  };

  const handlePublish = () => {
    if (id) {
      saveForm();
      if (formData.form_meta.status === 'draft') {
        publishForm(id);
        // After publishing, show the share modal
        setTimeout(() => setShareModalOpen(true), 100);
      } else if (formData.form_meta.status === 'published') {
        // Already published, just show share modal
        setShareModalOpen(true);
      }
    }
  };

  const handleSave = () => {
    saveForm();
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {viewMode === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditorHeader
              onPreview={() => setViewMode('preview')}
              onBack={handleBack}
              onPublish={handlePublish}
              onSave={handleSave}
              isPublished={formData.form_meta.status === 'published'}
            />
            <main className="py-8 px-4">
              <FormEditor />
            </main>
          </motion.div>
        )}

        {viewMode === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Preview header */}
            <div className="sticky top-0 z-50 bg-foreground/90 backdrop-blur-lg text-background">
              <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">预览模式</span>
                <button
                  onClick={handleBack}
                  className="px-4 py-1.5 text-sm font-medium bg-background/20 hover:bg-background/30 rounded-lg transition-colors"
                >
                  返回编辑
                </button>
              </div>
            </div>
            <FormViewer formData={formData} isPreview />
          </motion.div>
        )}
      </AnimatePresence>

      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        publishUrl={formData.form_meta.publish_url}
        isPublished={formData.form_meta.status === 'published'}
      />
    </div>
  );
};

export default Editor;
