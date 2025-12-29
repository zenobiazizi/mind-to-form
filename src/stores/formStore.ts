import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { FormData, Question, QuestionType, FormResponse, FormStatus } from '@/types/form';
import { DEFAULT_FORM } from '@/types/form';

interface FormStore {
  // Current editing form
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

  // All forms (dashboard)
  forms: FormData[];
  responses: FormResponse[];
  
  saveForm: () => void;
  loadForm: (uuid: string) => void;
  deleteForm: (uuid: string) => void;
  renameForm: (uuid: string, title: string) => void;
  publishForm: (uuid: string) => void;
  closeForm: (uuid: string) => void;
  reopenForm: (uuid: string) => void;
  
  addResponse: (formId: string, answers: FormResponse['answers']) => void;
  getFormResponses: (formId: string) => FormResponse[];
  incrementPV: (formId: string) => void;
  
  getFormById: (uuid: string) => FormData | undefined;
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

const generateShortId = () => nanoid(8);

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      formData: { ...DEFAULT_FORM, form_meta: { ...DEFAULT_FORM.form_meta, uuid: `f_${nanoid(10)}` } },
      forms: [],
      responses: [],

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

      saveForm: () =>
        set((state) => {
          const existingIndex = state.forms.findIndex(
            (f) => f.form_meta.uuid === state.formData.form_meta.uuid
          );
          if (existingIndex >= 0) {
            const newForms = [...state.forms];
            newForms[existingIndex] = state.formData;
            return { forms: newForms };
          }
          return { forms: [...state.forms, state.formData] };
        }),

      loadForm: (uuid) => {
        const form = get().forms.find((f) => f.form_meta.uuid === uuid);
        if (form) {
          set({ formData: form });
        }
      },

      deleteForm: (uuid) =>
        set((state) => ({
          forms: state.forms.filter((f) => f.form_meta.uuid !== uuid),
          responses: state.responses.filter((r) => r.form_id !== uuid),
        })),

      renameForm: (uuid, title) =>
        set((state) => ({
          forms: state.forms.map((f) =>
            f.form_meta.uuid === uuid
              ? { ...f, form_meta: { ...f.form_meta, title } }
              : f
          ),
        })),

      publishForm: (uuid) =>
        set((state) => {
          const shortId = generateShortId();
          const publishUrl = `${window.location.origin}/f/${shortId}`;
          return {
            forms: state.forms.map((f) =>
              f.form_meta.uuid === uuid
                ? { ...f, form_meta: { ...f.form_meta, status: 'published' as FormStatus, publish_url: publishUrl } }
                : f
            ),
            formData: state.formData.form_meta.uuid === uuid
              ? { ...state.formData, form_meta: { ...state.formData.form_meta, status: 'published' as FormStatus, publish_url: publishUrl } }
              : state.formData,
          };
        }),

      closeForm: (uuid) =>
        set((state) => ({
          forms: state.forms.map((f) =>
            f.form_meta.uuid === uuid
              ? { ...f, form_meta: { ...f.form_meta, status: 'closed' as FormStatus } }
              : f
          ),
        })),

      reopenForm: (uuid) =>
        set((state) => ({
          forms: state.forms.map((f) =>
            f.form_meta.uuid === uuid
              ? { ...f, form_meta: { ...f.form_meta, status: 'published' as FormStatus } }
              : f
          ),
        })),

      addResponse: (formId, answers) =>
        set((state) => {
          const response: FormResponse = {
            id: `r_${nanoid(10)}`,
            form_id: formId,
            submitted_at: new Date().toISOString(),
            answers,
          };
          // Update response count
          const newForms = state.forms.map((f) =>
            f.form_meta.uuid === formId
              ? { ...f, form_meta: { ...f.form_meta, stat_responses: f.form_meta.stat_responses + 1 } }
              : f
          );
          return {
            responses: [...state.responses, response],
            forms: newForms,
          };
        }),

      getFormResponses: (formId) => {
        return get().responses.filter((r) => r.form_id === formId);
      },

      incrementPV: (formId) =>
        set((state) => ({
          forms: state.forms.map((f) =>
            f.form_meta.uuid === formId
              ? { ...f, form_meta: { ...f.form_meta, stat_pv: f.form_meta.stat_pv + 1 } }
              : f
          ),
        })),

      getFormById: (uuid) => {
        return get().forms.find((f) => f.form_meta.uuid === uuid);
      },
    }),
    {
      name: 'superform-storage',
    }
  )
);
