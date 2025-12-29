export type QuestionType = 'radio' | 'checkbox' | 'text' | 'rating';

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Option[];
  placeholder?: string;
  maxRating?: number;
}

export interface FormMeta {
  uuid: string;
  title: string;
  description: string;
  theme_id: 'theme_default' | 'theme_night' | 'theme_warm' | 'theme_fresh';
  created_at: string;
}

export interface FormData {
  form_meta: FormMeta;
  questions: Question[];
}

export const THEME_OPTIONS = [
  { id: 'theme_default', name: '极简白', description: '干净通用', className: '' },
  { id: 'theme_night', name: '深邃夜', description: '科技感', className: 'theme-night' },
  { id: 'theme_warm', name: '暖阳橙', description: '柔和温馨', className: 'theme-warm' },
  { id: 'theme_fresh', name: '清新绿', description: '自然清新', className: 'theme-fresh' },
] as const;

export const DEFAULT_FORM: FormData = {
  form_meta: {
    uuid: '',
    title: '未命名表单',
    description: '',
    theme_id: 'theme_default',
    created_at: new Date().toISOString().split('T')[0],
  },
  questions: [],
};
