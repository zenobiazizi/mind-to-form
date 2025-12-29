import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { FormData, Question, QuestionType, Option } from '@/types/form';
import { DEFAULT_FORM } from '@/types/form';

interface FormStore {
  formData: FormData;
  setFormData: (data: FormData) => void;
  updateMeta: (updates: Partial<FormData['form_meta']>) => void;
  addQuestion: (type: QuestionType) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  moveQuestion: (id: string, direction: 'up' | 'down') => void;
  addOption: (questionId: string) => void;
  updateOption: (questionId: string, optionId: string, label: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  resetForm: () => void;
}

const createDefaultQuestion = (type: QuestionType): Question => {
  const base = {
    id: `q_${nanoid(8)}`,
    type,
    title: type === 'radio' ? '单选题' : type === 'checkbox' ? '多选题' : type === 'text' ? '文本题' : '评分题',
    required: false,
  };

  if (type === 'radio' || type === 'checkbox') {
    return {
      ...base,
      options: [
        { id: `o_${nanoid(6)}`, label: '选项 1' },
        { id: `o_${nanoid(6)}`, label: '选项 2' },
      ],
    };
  }

  if (type === 'text') {
    return {
      ...base,
      placeholder: '请输入您的回答...',
    };
  }

  if (type === 'rating') {
    return {
      ...base,
      maxRating: 5,
    };
  }

  return base;
};

export const useFormStore = create<FormStore>((set) => ({
  formData: { ...DEFAULT_FORM, form_meta: { ...DEFAULT_FORM.form_meta, uuid: `f_${nanoid(10)}` } },

  setFormData: (data) => set({ formData: data }),

  updateMeta: (updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        form_meta: { ...state.formData.form_meta, ...updates },
      },
    })),

  addQuestion: (type) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: [...state.formData.questions, createDefaultQuestion(type)],
      },
    })),

  updateQuestion: (id, updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: state.formData.questions.map((q) =>
          q.id === id ? { ...q, ...updates } : q
        ),
      },
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: state.formData.questions.filter((q) => q.id !== id),
      },
    })),

  moveQuestion: (id, direction) =>
    set((state) => {
      const questions = [...state.formData.questions];
      const index = questions.findIndex((q) => q.id === id);
      if (index === -1) return state;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= questions.length) return state;

      [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
      return { formData: { ...state.formData, questions } };
    }),

  addOption: (questionId) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: state.formData.questions.map((q) =>
          q.id === questionId && q.options
            ? {
                ...q,
                options: [
                  ...q.options,
                  { id: `o_${nanoid(6)}`, label: `选项 ${q.options.length + 1}` },
                ],
              }
            : q
        ),
      },
    })),

  updateOption: (questionId, optionId, label) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: state.formData.questions.map((q) =>
          q.id === questionId && q.options
            ? {
                ...q,
                options: q.options.map((o) =>
                  o.id === optionId ? { ...o, label } : o
                ),
              }
            : q
        ),
      },
    })),

  deleteOption: (questionId, optionId) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questions: state.formData.questions.map((q) =>
          q.id === questionId && q.options
            ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
            : q
        ),
      },
    })),

  resetForm: () =>
    set({
      formData: {
        ...DEFAULT_FORM,
        form_meta: { ...DEFAULT_FORM.form_meta, uuid: `f_${nanoid(10)}` },
      },
    }),
}));
