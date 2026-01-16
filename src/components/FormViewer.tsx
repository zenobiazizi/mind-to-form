import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Square, Star, CheckCircle2, Check, Send } from 'lucide-react';
import { FormData, Question } from '@/types/form';
import { THEME_OPTIONS } from '@/types/form';
import { cn } from '@/lib/utils';

interface FormViewerProps {
  formData: FormData;
  isPreview?: boolean;
  onSubmit?: (answers: { question_id: string; value: string | string[] | number }[]) => void;
}

const FormViewer: React.FC<FormViewerProps> = ({ formData, isPreview = false, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentTheme = THEME_OPTIONS.find(t => t.id === formData.form_meta.theme_id);
  const themeClass = currentTheme?.className || 'theme-default';
  const themeStyle = currentTheme?.preview?.style || 'minimalist';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const formattedAnswers = Object.entries(answers).map(([question_id, value]) => ({
        question_id,
        value,
      }));
      onSubmit(formattedAnswers);
    }
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

  // Theme-specific container classes
  const getContainerClasses = () => {
    const base = "min-h-screen bg-background transition-all duration-500";
    switch (themeStyle) {
      case 'cyber':
        return cn(base, "bg-gradient-to-br from-background via-background to-[hsl(265_30%_12%)]");
      case 'soft':
        return cn(base, "noise-overlay");
      default:
        return base;
    }
  };

  if (submitted) {
    return (
      <div className={cn("min-h-screen transition-colors duration-500", themeClass)}>
        <div className={getContainerClasses()}>
          <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={cn(
                  "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
                  themeStyle === 'cyber' 
                    ? "bg-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.4)]" 
                    : "bg-primary/10"
                )}
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className={cn(
                "text-2xl font-bold text-foreground mb-2",
                themeStyle === 'minimalist' && "font-light tracking-wide"
              )}>
                提交成功！
              </h2>
              <p className="text-muted-foreground">感谢您的参与</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Theme-specific font classes
  const getFontClasses = () => {
    switch (themeStyle) {
      case 'minimalist':
        return "font-light tracking-wide text-[15px]";
      case 'cyber':
        return "font-normal tracking-normal text-[14px]";
      case 'soft':
        return "font-serif text-[15px]";
      case 'professional':
        return "font-normal text-[14px]";
      default:
        return "text-base";
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500", themeClass, getFontClasses())}>
      <div className={getContainerClasses()}>
        <div className="max-w-xl mx-auto px-5 py-10">
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h1 className={cn(
                "font-bold text-foreground mb-2 transition-all",
                themeStyle === 'minimalist' && "font-extralight tracking-[0.15em] text-2xl",
                themeStyle === 'cyber' && "text-xl font-semibold text-gradient",
                themeStyle === 'soft' && "font-serif text-xl",
                themeStyle === 'professional' && "text-xl font-semibold"
              )}>
                {formData.form_meta.title}
              </h1>
              <p className={cn(
                "text-muted-foreground leading-relaxed",
                themeStyle === 'minimalist' && "font-light tracking-wide text-sm",
                themeStyle === 'cyber' && "text-sm",
                themeStyle === 'soft' && "font-serif text-sm",
                themeStyle === 'professional' && "text-sm"
              )}>
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
                themeStyle={themeStyle}
              />
            ))}

            {/* Submit button */}
            {formData.questions.length > 0 && (
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full font-medium transition-all flex items-center justify-center gap-2",
                    // Theme-specific button styles
                    themeStyle === 'minimalist' && "py-3 px-5 bg-foreground text-background rounded-none font-light tracking-widest text-sm hover:bg-foreground/90",
                    themeStyle === 'cyber' && "py-3 px-5 bg-gradient-to-r from-primary to-[hsl(290_100%_70%)] text-primary-foreground rounded-xl text-sm shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.7)]",
                    themeStyle === 'soft' && "py-3 px-5 bg-primary text-primary-foreground rounded-2xl shadow-md font-serif text-sm hover:opacity-90",
                    themeStyle === 'professional' && "py-3 px-5 bg-primary text-primary-foreground rounded-md shadow-sm text-sm hover:bg-primary/90"
                  )}
                >
                  <Send className="w-4 h-4" />
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
  themeStyle: string;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  answer,
  onAnswer,
  onToggleCheckbox,
  variants,
  themeStyle,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  // Theme-specific card styles
  const getCardClasses = () => {
    const base = "transition-all duration-300";
    switch (themeStyle) {
      case 'minimalist':
        // 极简：无边框无阴影，仅用极淡的间距分隔
        return cn(base, "bg-transparent py-6");
      case 'cyber':
        return cn(
          base,
          "bg-card/70 backdrop-blur-xl rounded-xl p-5",
          "border border-[hsl(var(--primary)/0.3)]",
          "shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
        );
      case 'soft':
        return cn(
          base,
          "bg-card rounded-xl p-5",
          "shadow-[0_4px_16px_-4px_hsl(25_70%_50%/0.15)]"
        );
      case 'professional':
        return cn(
          base,
          "bg-card rounded-md p-5 border border-border",
          "shadow-sm relative overflow-hidden",
          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
        );
      default:
        return cn(base, "bg-card rounded-xl p-5 shadow-card border border-border/30");
    }
  };

  // Theme-specific option styles
  const getOptionClasses = (isSelected: boolean) => {
    const base = "w-full flex items-center gap-3 transition-all text-left";
    switch (themeStyle) {
      case 'minimalist':
        // 极简：无边框，选中仅高亮文字
        return cn(
          base,
          "bg-transparent py-2 px-0",
          isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        );
      case 'cyber':
        return cn(
          base,
          "rounded-lg border backdrop-blur-sm py-3 px-4",
          isSelected
            ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
            : "border-[hsl(var(--primary)/0.2)] bg-background/30 hover:border-primary/50"
        );
      case 'soft':
        return cn(
          base,
          "rounded-lg border py-3 px-4",
          isSelected
            ? "border-primary bg-primary/5 shadow-[0_2px_8px_hsl(25_90%_55%/0.15)]"
            : "border-border/50 hover:border-primary/30 bg-background/50"
        );
      case 'professional':
        return cn(
          base,
          "rounded-md border py-3 px-4",
          isSelected
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : "border-border hover:border-primary/40 bg-background"
        );
      default:
        return cn(
          base,
          "rounded-lg border py-3 px-4",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border/50 hover:border-primary/30 bg-background/50"
        );
    }
  };

  // Theme-specific indicator styles
  const getIndicatorClasses = (isSelected: boolean, isCheckbox: boolean = false) => {
    const shape = isCheckbox ? "rounded-md" : "rounded-full";
    const base = `flex items-center justify-center w-5 h-5 ${shape} border-2 transition-all`;
    
    switch (themeStyle) {
      case 'minimalist':
        return cn(
          base,
          isSelected
            ? "border-foreground bg-foreground"
            : "border-foreground/30"
        );
      case 'cyber':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
            : "border-primary/40"
        );
      case 'soft':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        );
      case 'professional':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/40"
        );
      default:
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        );
    }
  };

  return (
    <motion.div
      variants={variants}
      className={getCardClasses()}
    >
      <h3 className={cn(
        "font-semibold text-foreground mb-3 leading-relaxed",
        themeStyle === 'minimalist' && "font-light tracking-wide text-base",
        themeStyle === 'cyber' && "text-base font-medium",
        themeStyle === 'soft' && "font-serif text-base",
        themeStyle === 'professional' && "text-base font-medium"
      )}>
        <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
        {question.title}
        {question.required && (
          <span className={cn(
            "ml-1",
            themeStyle === 'professional' ? "text-destructive font-bold" : "text-destructive"
          )}>*</span>
        )}
      </h3>

      {/* Radio options */}
      {question.type === 'radio' && question.options && (
        <div className={cn("space-y-2", themeStyle === 'minimalist' && "space-y-1")}>
          {question.options.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleOptionSelect(option.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                getOptionClasses(selectedOption === option.id),
                selectedOption === option.id && themeStyle !== 'minimalist' && "animate-jelly"
              )}
            >
              <span className={getIndicatorClasses(selectedOption === option.id)}>
                {selectedOption === option.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "rounded-full",
                      themeStyle === 'minimalist' ? "w-1.5 h-1.5 bg-background" : "w-2 h-2 bg-primary-foreground"
                    )}
                  />
                )}
              </span>
              <span className={cn(
                "text-foreground",
                themeStyle === 'minimalist' && "font-light text-sm",
                themeStyle === 'cyber' && "text-sm",
                themeStyle === 'soft' && "font-serif text-sm",
                themeStyle === 'professional' && "text-sm"
              )}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Checkbox options */}
      {question.type === 'checkbox' && question.options && (
        <div className={cn("space-y-2", themeStyle === 'minimalist' && "space-y-1")}>
          {question.options.map((option) => {
            const isChecked = (answer || []).includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => onToggleCheckbox(option.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  getOptionClasses(isChecked),
                  isChecked && themeStyle !== 'minimalist' && "animate-jelly"
                )}
              >
                <span className={getIndicatorClasses(isChecked, true)}>
                  {isChecked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className={cn(
                        "w-3 h-3",
                        themeStyle === 'minimalist' ? "text-background" : "text-primary-foreground"
                      )} />
                    </motion.span>
                  )}
                </span>
                <span className={cn(
                  "text-foreground",
                  themeStyle === 'minimalist' && "font-light text-sm",
                  themeStyle === 'cyber' && "text-sm",
                  themeStyle === 'soft' && "font-serif text-sm",
                  themeStyle === 'professional' && "text-sm"
                )}>
                  {option.label}
                </span>
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
            rows={2}
            className={cn(
              "w-full px-3 py-2 resize-none focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/50",
              // Theme-specific input styles
              themeStyle === 'minimalist' && "bg-transparent border-0 border-b border-border/60 focus:border-foreground rounded-none font-light text-sm",
              themeStyle === 'cyber' && "bg-background/30 backdrop-blur-sm border border-[hsl(var(--primary)/0.3)] rounded-lg focus:border-primary focus:shadow-[0_0_10px_hsl(var(--primary)/0.15)]",
              themeStyle === 'soft' && "bg-background/50 border border-border/50 rounded-lg focus:border-primary font-serif",
              themeStyle === 'professional' && "bg-background border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary/20"
            )}
          />
        </div>
      )}

      {/* Rating */}
      {question.type === 'rating' && (
        <div className="flex gap-1.5 justify-center py-2">
          {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onAnswer(i + 1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "transition-all",
                  themeStyle === 'minimalist' ? "w-6 h-6" : "w-7 h-7",
                  (answer || 0) > i
                    ? cn(
                        "text-primary fill-primary",
                        themeStyle === 'cyber' && "drop-shadow-[0_0_6px_hsl(var(--primary))]"
                      )
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