import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListChecks, AlignLeft, Star } from 'lucide-react';
import { QuestionType } from '@/types/form';
import { useFormStore } from '@/stores/formStore';
import QuestionCard from './QuestionCard';

const FormEditor: React.FC = () => {
  const { formData, addQuestion, updateMeta } = useFormStore();
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [editingDesc, setEditingDesc] = React.useState(false);

  const addButtons: { type: QuestionType; icon: React.ReactNode; label: string }[] = [
    { type: 'radio', icon: <ListChecks className="w-5 h-5" />, label: '单选题' },
    { type: 'checkbox', icon: <Plus className="w-5 h-5" />, label: '多选题' },
    { type: 'text', icon: <AlignLeft className="w-5 h-5" />, label: '文本题' },
    { type: 'rating', icon: <Star className="w-5 h-5" />, label: '评分题' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        {editingTitle ? (
          <input
            value={formData.form_meta.title}
            onChange={(e) => updateMeta({ title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            autoFocus
            className="text-2xl font-bold text-center w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-2 text-foreground"
          />
        ) : (
          <h1
            onClick={() => setEditingTitle(true)}
            className="text-2xl font-bold text-foreground cursor-text hover:text-primary transition-colors"
          >
            {formData.form_meta.title}
          </h1>
        )}

        {editingDesc ? (
          <textarea
            value={formData.form_meta.description}
            onChange={(e) => updateMeta({ description: e.target.value })}
            onBlur={() => setEditingDesc(false)}
            autoFocus
            className="mt-2 text-muted-foreground text-center w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none py-1 resize-none"
            rows={2}
          />
        ) : (
          <p
            onClick={() => setEditingDesc(true)}
            className="mt-2 text-muted-foreground cursor-text hover:text-foreground transition-colors"
          >
            {formData.form_meta.description || '点击添加描述...'}
          </p>
        )}
      </motion.div>

      {/* Questions list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {formData.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              isFirst={index === 0}
              isLast={index === formData.questions.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {formData.questions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-muted-foreground"
        >
          <p className="text-lg">暂无问题</p>
          <p className="text-sm mt-1">点击下方按钮添加第一个问题</p>
        </motion.div>
      )}

      {/* Add question buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {addButtons.map(({ type, icon, label }) => (
          <motion.button
            key={type}
            onClick={() => addQuestion(type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-card border border-border/50 rounded-xl shadow-card hover:shadow-soft hover:border-primary/30 transition-all text-foreground"
          >
            <span className="text-primary">{icon}</span>
            <span className="font-medium">{label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default FormEditor;
