import React from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '@/components/FormViewer';
import { FormData } from '@/types/form';

// Mock data - in production this would fetch from backend
const mockFormData: FormData = {
  form_meta: {
    uuid: 'demo',
    title: '咖啡口味调研',
    description: '我们想了解您的咖啡偏好，帮助提供更好的产品体验。',
    theme_id: 'theme_warm',
    created_at: '2025-12-29',
  },
  questions: [
    {
      id: 'q_01',
      type: 'radio',
      title: '您每天喝几杯咖啡？',
      required: true,
      options: [
        { id: 'o_1', label: '不喝咖啡' },
        { id: 'o_2', label: '1杯' },
        { id: 'o_3', label: '2-3杯' },
        { id: 'o_4', label: '3杯以上' },
      ],
    },
    {
      id: 'q_02',
      type: 'checkbox',
      title: '您喜欢什么类型的咖啡？（可多选）',
      required: true,
      options: [
        { id: 'o_1', label: '美式咖啡' },
        { id: 'o_2', label: '拿铁' },
        { id: 'o_3', label: '卡布奇诺' },
        { id: 'o_4', label: '摩卡' },
        { id: 'o_5', label: '冷萃/冰咖啡' },
      ],
    },
    {
      id: 'q_03',
      type: 'rating',
      title: '您对我们咖啡口感的整体满意度',
      required: true,
      maxRating: 5,
    },
    {
      id: 'q_04',
      type: 'text',
      title: '有什么建议或想法想告诉我们？',
      required: false,
      placeholder: '请分享您的想法...',
    },
  ],
};

const FormViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In production, fetch form data based on id
  // For now, use mock data
  const formData = mockFormData;

  return <FormViewer formData={formData} />;
};

export default FormViewPage;
