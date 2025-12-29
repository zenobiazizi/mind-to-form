import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Square, Star, CheckCircle2, Check, Send } from 'lucide-react';
import { FormData, Question } from '@/types/form';
import { THEME_OPTIONS } from '@/types/form';
import { cn } from '@/lib/utils';

interface FormViewerProps {
  formData: FormData;
  isPreview?: boolean;
}

const FormViewer: React.FC<FormViewerProps> = ({ formData, isPreview = false }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const themeClass = THEME_OPTIONS.find(t => t.id === formData.form_meta.theme_id)?.className || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: current.includes(optionId)
          ? current.filter((id: string) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (submitted) {
    return (
      <div className={cn("min-h-screen", themeClass)}>
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative noise-overlay">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">提交成功！</h2>
            <p className="text-muted-foreground">感谢您的参与</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", themeClass)}>
      <div className="min-h-screen bg-background relative noise-overlay">
        <div className="max-w-xl mx-auto px-6 py-12">
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {formData.form_meta.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {formData.form_meta.description}
              </p>
            </motion.div>

            {/* Questions */}
            {formData.questions.map((question, index) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                onAnswer={(value) => updateAnswer(question.id, value)}
                onToggleCheckbox={(optionId) => toggleCheckbox(question.id, optionId)}
                variants={itemVariants}
              />
            ))}

            {/* Submit button */}
            {formData.questions.length > 0 && (
              <motion.div variants={itemVariants} className="pt-6">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-soft hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  提交问卷
                </motion.button>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

interface QuestionRendererProps {
  question: Question;
  index: number;
  answer: any;
  onAnswer: (value: any) => void;
  onToggleCheckbox: (optionId: string) => void;
  variants: any;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  answer,
  onAnswer,
  onToggleCheckbox,
  variants,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  return (
    <motion.div
      variants={variants}
      className="bg-card rounded-2xl p-6 shadow-card border border-border/30"
    >
      <h3 className="text-xl font-semibold text-foreground mb-4 leading-relaxed">
        <span className="text-muted-foreground mr-2">{index + 1}.</span>
        {question.title}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </h3>

      {/* Radio options */}
      {question.type === 'radio' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleOptionSelect(option.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                selectedOption === option.id
                  ? "border-primary bg-primary/5 animate-jelly"
                  : "border-border/50 hover:border-primary/30 bg-background/50"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all",
                  selectedOption === option.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {selectedOption === option.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary-foreground"
                  />
                )}
              </span>
              <span className="text-foreground font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Checkbox options */}
      {question.type === 'checkbox' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isChecked = (answer || []).includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => onToggleCheckbox(option.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  isChecked
                    ? "border-primary bg-primary/5 animate-jelly"
                    : "border-border/50 hover:border-primary/30 bg-background/50"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all",
                    isChecked ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isChecked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </motion.span>
                  )}
                </span>
                <span className="text-foreground font-medium">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Text input */}
      {question.type === 'text' && (
        <div className="relative">
          <textarea
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full px-4 py-3 bg-background/50 border-2 border-border/50 rounded-xl resize-none focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      )}

      {/* Rating */}
      {question.type === 'rating' && (
        <div className="flex gap-2 justify-center py-2">
          {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onAnswer(i + 1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              <Star
                className={cn(
                  "w-10 h-10 transition-all",
                  (answer || 0) > i
                    ? "text-primary fill-primary"
                    : "text-muted-foreground/30 hover:text-primary/50"
                )}
              />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FormViewer;
