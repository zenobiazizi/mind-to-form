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

  return (
    <div className={cn("min-h-screen transition-colors duration-500", themeClass)}>
      <div className={getContainerClasses()}>
        <div className="max-w-lg mx-auto px-5 py-8">
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn("space-y-5", themeStyle === 'minimalist' && "space-y-8")}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className={cn("text-center", themeStyle === 'minimalist' ? "mb-10" : "mb-6")}>
              <h1 className={cn(
                "text-2xl font-semibold text-foreground mb-2 transition-all",
                themeStyle === 'minimalist' && "font-light tracking-[0.08em] text-3xl",
                themeStyle === 'soft' && "font-serif",
                themeStyle === 'cyber' && "text-gradient"
              )}>
                {formData.form_meta.title}
              </h1>
              <p className={cn(
                "text-base text-muted-foreground",
                themeStyle === 'minimalist' && "font-light tracking-wide text-sm",
                themeStyle === 'soft' && "font-serif"
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
              <motion.div variants={itemVariants} className={cn("pt-4", themeStyle === 'minimalist' && "pt-8")}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "w-full py-3 px-5 font-medium text-sm transition-all flex items-center justify-center gap-2",
                    // Theme-specific button styles
                    themeStyle === 'minimalist' && "bg-foreground text-background rounded-none font-light tracking-widest text-xs py-3 hover:bg-foreground/90",
                    themeStyle === 'cyber' && "bg-gradient-to-r from-primary to-[hsl(290_100%_70%)] text-primary-foreground rounded-md shadow-[0_0_12px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]",
                    themeStyle === 'soft' && "bg-primary text-primary-foreground rounded-lg shadow-md font-serif hover:opacity-90",
                    themeStyle === 'professional' && "bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90"
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
    const base = "transition-all duration-200";
    switch (themeStyle) {
      case 'minimalist':
        // 极简：完全无框设计，纯白背景，无边框无阴影
        return cn(base, "bg-transparent");
      case 'cyber':
        return cn(
          base,
          "bg-card/60 backdrop-blur-md rounded-md px-4 py-3",
          "border border-[hsl(var(--primary)/0.25)]",
          "shadow-[0_0_8px_hsl(var(--primary)/0.08)]"
        );
      case 'soft':
        return cn(
          base,
          "bg-card rounded-lg px-4 py-3",
          "shadow-[0_2px_8px_-2px_hsl(25_70%_50%/0.12)]"
        );
      case 'professional':
        return cn(
          base,
          "bg-card rounded px-4 py-3 border border-[#e5e5e5]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden",
          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary"
        );
      default:
        return cn(base, "bg-card rounded-lg px-4 py-3 shadow-sm border border-[#e8e8e8]");
    }
  };

  // Theme-specific option styles
  const getOptionClasses = (isSelected: boolean) => {
    const base = "w-full flex items-center gap-2.5 transition-all text-left text-sm";
    switch (themeStyle) {
      case 'minimalist':
        // 极简：完全无框，选中时仅极浅灰背景
        return cn(
          base,
          "bg-transparent py-1.5 px-0 rounded-none",
          isSelected 
            ? "text-foreground bg-foreground/[0.03]" 
            : "text-muted-foreground hover:text-foreground"
        );
      case 'cyber':
        return cn(
          base,
          "rounded py-2 px-3 border backdrop-blur-sm",
          isSelected
            ? "border-primary bg-primary/10 shadow-[0_0_8px_hsl(var(--primary)/0.2)]"
            : "border-[hsl(var(--primary)/0.15)] bg-background/20 hover:border-primary/40"
        );
      case 'soft':
        return cn(
          base,
          "rounded-md py-2 px-3 border",
          isSelected
            ? "border-primary/60 bg-primary/5"
            : "border-[#e5e5e5] hover:border-primary/30 bg-background/30"
        );
      case 'professional':
        return cn(
          base,
          "rounded py-2 px-3 border",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-[#e5e5e5] hover:border-primary/30 bg-background"
        );
      default:
        return cn(
          base,
          "rounded py-2 px-3 border",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-[#e5e5e5] hover:border-primary/20 bg-background/50"
        );
    }
  };

  // Theme-specific indicator styles
  const getIndicatorClasses = (isSelected: boolean, isCheckbox: boolean = false) => {
    const shape = isCheckbox ? "rounded-sm" : "rounded-full";
    const base = `flex-shrink-0 flex items-center justify-center w-4 h-4 ${shape} border transition-all`;
    
    switch (themeStyle) {
      case 'minimalist':
        return cn(
          base,
          isSelected
            ? "border-foreground bg-foreground"
            : "border-foreground/25"
        );
      case 'cyber':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
            : "border-primary/35"
        );
      case 'soft':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/25"
        );
      case 'professional':
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        );
      default:
        return cn(
          base,
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/25"
        );
    }
  };

  return (
    <motion.div
      variants={variants}
      className={getCardClasses()}
    >
      <h3 className={cn(
        "text-base font-medium text-foreground mb-2.5 leading-normal",
        themeStyle === 'minimalist' && "font-light tracking-wide text-sm mb-3",
        themeStyle === 'soft' && "font-serif"
      )}>
        <span className="text-muted-foreground/70 mr-1.5 text-sm">{index + 1}.</span>
        {question.title}
        {question.required && (
          <span className={cn(
            "ml-0.5 text-xs",
            themeStyle === 'professional' ? "text-destructive font-medium" : "text-destructive/70"
          )}>*</span>
        )}
      </h3>

      {/* Radio options */}
      {question.type === 'radio' && question.options && (
        <div className={cn("space-y-1.5", themeStyle === 'minimalist' && "space-y-0.5")}>
          {question.options.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleOptionSelect(option.id)}
              whileTap={{ scale: 0.995 }}
              className={getOptionClasses(selectedOption === option.id)}
            >
              <span className={getIndicatorClasses(selectedOption === option.id)}>
                {selectedOption === option.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "rounded-full w-1.5 h-1.5",
                      themeStyle === 'minimalist' ? "bg-background" : "bg-primary-foreground"
                    )}
                  />
                )}
              </span>
              <span className={cn(
                "text-foreground",
                themeStyle === 'minimalist' && "font-light",
                themeStyle === 'soft' && "font-serif"
              )}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Checkbox options */}
      {question.type === 'checkbox' && question.options && (
        <div className={cn("space-y-1.5", themeStyle === 'minimalist' && "space-y-0.5")}>
          {question.options.map((option) => {
            const isChecked = (answer || []).includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => onToggleCheckbox(option.id)}
                whileTap={{ scale: 0.995 }}
                className={getOptionClasses(isChecked)}
              >
                <span className={getIndicatorClasses(isChecked, true)}>
                  {isChecked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className={cn(
                        "w-2.5 h-2.5",
                        themeStyle === 'minimalist' ? "text-background" : "text-primary-foreground"
                      )} />
                    </motion.span>
                  )}
                </span>
                <span className={cn(
                  "text-foreground",
                  themeStyle === 'minimalist' && "font-light",
                  themeStyle === 'soft' && "font-serif"
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
              "w-full px-2.5 py-1.5 resize-none focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground/40",
              // Theme-specific input styles
              themeStyle === 'minimalist' && "bg-transparent border-0 border-b border-foreground/10 focus:border-foreground/40 rounded-none font-light",
              themeStyle === 'cyber' && "bg-background/20 backdrop-blur-sm border border-[hsl(var(--primary)/0.2)] rounded focus:border-primary",
              themeStyle === 'soft' && "bg-background/30 border border-[#e5e5e5] rounded-md focus:border-primary font-serif",
              themeStyle === 'professional' && "bg-background border border-[#e5e5e5] rounded focus:border-primary"
            )}
          />
        </div>
      )}

      {/* Rating */}
      {question.type === 'rating' && (
        <div className="flex gap-1 justify-center py-1">
          {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onAnswer(i + 1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "w-7 h-7 transition-all",
                  (answer || 0) > i
                    ? cn(
                        "text-primary fill-primary",
                        themeStyle === 'cyber' && "drop-shadow-[0_0_5px_hsl(var(--primary))]"
                      )
                    : "text-muted-foreground/20 hover:text-primary/40"
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