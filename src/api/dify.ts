import { FormData, Question, QuestionType } from '@/types/form';
import { nanoid } from 'nanoid';

// Dify Workflow API configuration
const DIFY_API_URL = 'https://api.dify.ai/v1/workflows/run';

interface DifyQuestion {
  id?: string;
  type: string;
  title: string;
  required?: boolean;
  options?: Array<{ id?: string; label: string }>;
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
        baseQuestion.options = (q.options || []).map((opt) => ({
          id: opt.id || `o_${nanoid(6)}`,
          label: opt.label || '选项',
        }));
        
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

// Call Dify Workflow API to generate form
export const generateFormFromDify = async (prompt: string): Promise<FormData> => {
  const apiKey = import.meta.env.VITE_DIFY_API_KEY;
  
  if (!apiKey) {
    throw new Error('DIFY_API_KEY is not configured');
  }

  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          prompt: prompt,
        },
        response_mode: 'blocking',
        user: `user_${nanoid(8)}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', response.status, errorText);
      throw new Error(`Dify API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the output from Dify workflow response
    // Dify workflow returns { data: { outputs: { ... } } }
    let formData: DifyFormResponse;
    
    if (result.data?.outputs) {
      // Try to parse if it's a string
      const outputs = result.data.outputs;
      if (typeof outputs === 'string') {
        formData = JSON.parse(outputs);
      } else if (outputs.result && typeof outputs.result === 'string') {
        formData = JSON.parse(outputs.result);
      } else if (outputs.text && typeof outputs.text === 'string') {
        formData = JSON.parse(outputs.text);
      } else {
        formData = outputs;
      }
    } else if (result.outputs) {
      formData = typeof result.outputs === 'string' 
        ? JSON.parse(result.outputs) 
        : result.outputs;
    } else {
      formData = result;
    }

    return parseDifyResponse(formData);
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
