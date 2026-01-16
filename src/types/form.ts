export type QuestionType = 'radio' | 'checkbox' | 'text' | 'rating';
export type FormStatus = 'draft' | 'published' | 'closed';

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
  status: FormStatus;
  publish_url?: string;
  stat_pv: number;
  stat_responses: number;
}

export interface FormData {
  form_meta: FormMeta;
  questions: Question[];
}

export interface Answer {
  question_id: string;
  value: string | string[] | number;
}

export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
  answers: Answer[];
}

export const THEME_OPTIONS = [
  { 
    id: 'theme_default', 
    name: '极简白', 
    description: '纯白无框，极细字体', 
    className: 'theme-default',
    preview: { bg: '#FFFFFF', accent: '#1a1a1a', style: 'minimalist' }
  },
  { 
    id: 'theme_night', 
    name: '深邃夜', 
    description: '赛博科技，霓虹荧光', 
    className: 'theme-night',
    preview: { bg: '#0f1420', accent: '#a78bfa', style: 'cyber' }
  },
  { 
    id: 'theme_warm', 
    name: '温柔风', 
    description: '米色圆角，柔和舒适', 
    className: 'theme-warm',
    preview: { bg: '#f5f0e8', accent: '#e87f3a', style: 'soft' }
  },
  { 
    id: 'theme_fresh', 
    name: '专业蓝', 
    description: '经典商务，沉稳专业', 
    className: 'theme-fresh',
    preview: { bg: '#f0f2f5', accent: '#1e4a8c', style: 'professional' }
  },
] as const;

export const DEFAULT_FORM: FormData = {
  form_meta: {
    uuid: '',
    title: '未命名表单',
    description: '',
    theme_id: 'theme_default',
    created_at: new Date().toISOString().split('T')[0],
    status: 'draft',
    stat_pv: 0,
    stat_responses: 0,
  },
  questions: [],
};
