import { FormData, Question, QuestionType } from '@/types/form';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';

interface DifyQuestion {
  id?: string;
  type: string;
  title: string;
  required?: boolean;
  // Dify can return options as string array or object array
  options?: Array<string | { id?: string; label: string }>;
  placeholder?: string;
  maxRating?: number;
}

interface DifyFormResponse {
  form_meta?: {
    uuid?: string;
    title?: string;
    description?: string;
    theme_id?: string;
  };
  questions?: DifyQuestion[];
}

// Map Dify question type to our QuestionType
const mapQuestionType = (type: string): QuestionType => {
  const typeMap: Record<string, QuestionType> = {
    'radio': 'radio',
    'checkbox': 'checkbox',
    'text': 'text',
    'rating': 'rating',
    'single': 'radio',
    'multiple': 'checkbox',
    'input': 'text',
    'score': 'rating',
  };
  return typeMap[type.toLowerCase()] || 'text';
};

// Parse and map Dify response to our FormData structure
const parseDifyResponse = (difyData: DifyFormResponse): FormData => {
  const formMeta = difyData.form_meta || {};
  const questions = difyData.questions || [];

  return {
    form_meta: {
      uuid: formMeta.uuid || `f_${nanoid(10)}`,
      title: formMeta.title || '调研问卷',
      description: formMeta.description || '感谢您的参与，本问卷仅需1分钟完成。',
      theme_id: (formMeta.theme_id as FormData['form_meta']['theme_id']) || 'theme_default',
      created_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      stat_pv: 0,
      stat_responses: 0,
    },
    questions: questions.map((q): Question => {
      const questionType = mapQuestionType(q.type);
      const baseQuestion: Question = {
        id: q.id || `q_${nanoid(8)}`,
        type: questionType,
        title: q.title || '请回答此问题',
        required: q.required !== false,
      };

      // Add options for radio/checkbox types
      if (questionType === 'radio' || questionType === 'checkbox') {
        const rawOptions = q.options || [];
        
        // Handle both string array and object array formats from Dify
        baseQuestion.options = rawOptions.map((opt) => {
          // If opt is a string, convert to object format
          if (typeof opt === 'string') {
            return {
              id: `o_${nanoid(6)}`,
              label: opt,
            };
          }
          // If opt is an object, use its properties
          return {
            id: opt.id || `o_${nanoid(6)}`,
            label: opt.label || '选项',
          };
        });
        
        // Ensure at least 2 options
        if (!baseQuestion.options || baseQuestion.options.length < 2) {
          baseQuestion.options = [
            { id: `o_${nanoid(6)}`, label: '选项 A' },
            { id: `o_${nanoid(6)}`, label: '选项 B' },
          ];
        }
      }

      // Add placeholder for text type
      if (questionType === 'text') {
        baseQuestion.placeholder = q.placeholder || '请输入...';
      }

      // Add maxRating for rating type
      if (questionType === 'rating') {
        baseQuestion.maxRating = q.maxRating || 5;
      }

      return baseQuestion;
    }),
  };
};

// Call Dify Workflow API via Edge Function
export const generateFormFromDify = async (prompt: string): Promise<FormData> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-form', {
      body: { prompt },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate form');
    }

    if (!data || !data.data) {
      console.error('Invalid response from edge function:', data);
      throw new Error('Invalid response from server');
    }

    return parseDifyResponse(data.data);
  } catch (error) {
    console.error('Failed to generate form from Dify:', error);
    throw error;
  }
};

// Loading messages for Dify generation
export const DIFY_LOADING_MESSAGES = [
  '正在理解您的需求...',
  'AI 正在设计问题逻辑...',
  '正在优化问题结构...',
  '正在匹配视觉主题...',
  '即将完成...',
];
