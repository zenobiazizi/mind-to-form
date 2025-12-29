import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  X, 
  GripVertical,
  Circle,
  Square,
  Star
} from 'lucide-react';
import { Question, QuestionType } from '@/types/form';
import { useFormStore } from '@/stores/formStore';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, isFirst, isLast }) => {
  const { updateQuestion, deleteQuestion, moveQuestion, addOption, updateOption, deleteOption } = useFormStore();
  const [isHovered, setIsHovered] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [editingTitle]);

  const typeIcons: Record<QuestionType, React.ReactNode> = {
    radio: <Circle className="w-4 h-4" />,
    checkbox: <Square className="w-4 h-4" />,
    text: <span className="text-xs font-medium">Aa</span>,
    rating: <Star className="w-4 h-4" />,
  };

  const typeLabels: Record<QuestionType, string> = {
    radio: '单选',
    checkbox: '多选',
    text: '文本',
    rating: '评分',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="flex gap-2">
        {/* Side controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="flex flex-col items-center gap-1 pt-4"
        >
          <button
            onClick={() => moveQuestion(question.id, 'up')}
            disabled={isFirst}
            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <GripVertical className="w-4 h-4 text-muted-foreground/50" />
          <button
            onClick={() => moveQuestion(question.id, 'down')}
            disabled={isLast}
            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Card content */}
        <div className="flex-1 bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary">
                {typeIcons[question.type]}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {typeLabels[question.type]}
              </span>
              {question.required && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-destructive/10 text-destructive rounded">
                  必填
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuestion(question.id, { required: !question.required })}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  question.required 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {question.required ? '必填' : '选填'}
              </button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                onClick={() => deleteQuestion(question.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Title */}
          <div className="px-4 py-4">
            {editingTitle ? (
              <input
                ref={titleRef}
                value={question.title}
                onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="w-full text-lg font-medium bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-1 text-foreground"
              />
            ) : (
              <h3
                onClick={() => setEditingTitle(true)}
                className="text-lg font-medium text-foreground cursor-text hover:text-primary transition-colors"
              >
                {question.title}
                {question.required && <span className="text-destructive ml-1">*</span>}
              </h3>
            )}
          </div>

          {/* Options for radio/checkbox */}
          {(question.type === 'radio' || question.type === 'checkbox') && question.options && (
            <div className="px-4 pb-4 space-y-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-3 group/option">
                  <span className="text-muted-foreground">
                    {question.type === 'radio' ? (
                      <Circle className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </span>
                  {editingOptionId === option.id ? (
                    <input
                      value={option.label}
                      onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                      onBlur={() => setEditingOptionId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingOptionId(null)}
                      autoFocus
                      className="flex-1 bg-transparent border-b border-primary/30 focus:border-primary outline-none py-1 text-foreground"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingOptionId(option.id)}
                      className="flex-1 cursor-text text-foreground hover:text-primary transition-colors"
                    >
                      {option.label}
                    </span>
                  )}
                  {question.options && question.options.length > 1 && (
                    <button
                      onClick={() => deleteOption(question.id, option.id)}
                      className="p-1 opacity-0 group-hover/option:opacity-100 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addOption(question.id)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                添加选项
              </button>
            </div>
          )}

          {/* Preview for text */}
          {question.type === 'text' && (
            <div className="px-4 pb-4">
              <div className="border-b border-border/50 py-2 text-muted-foreground/60 text-sm">
                {question.placeholder || '用户将在此输入回答...'}
              </div>
            </div>
          )}

          {/* Preview for rating */}
          {question.type === 'rating' && (
            <div className="px-4 pb-4">
              <div className="flex gap-2">
                {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-muted-foreground/30" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
