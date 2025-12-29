import { FormData, Question } from '@/types/form';
import { nanoid } from 'nanoid';

// Mock AI generation - simulates generating form structure from natural language
export const generateFormFromPrompt = async (prompt: string): Promise<FormData> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Extract keywords to customize the form
  const lowerPrompt = prompt.toLowerCase();
  
  let title = '调研问卷';
  let description = '感谢您的参与，本问卷仅需1分钟完成。';
  let questions: Question[] = [];

  // Coffee survey
  if (lowerPrompt.includes('咖啡') || lowerPrompt.includes('coffee')) {
    title = '咖啡口味调研';
    description = '我们想了解您的咖啡偏好，帮助提供更好的产品体验。';
    questions = [
      {
        id: `q_${nanoid(8)}`,
        type: 'radio',
        title: '您每天喝几杯咖啡？',
        required: true,
        options: [
          { id: `o_${nanoid(6)}`, label: '不喝咖啡' },
          { id: `o_${nanoid(6)}`, label: '1杯' },
          { id: `o_${nanoid(6)}`, label: '2-3杯' },
          { id: `o_${nanoid(6)}`, label: '3杯以上' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'checkbox',
        title: '您喜欢什么类型的咖啡？（可多选）',
        required: true,
        options: [
          { id: `o_${nanoid(6)}`, label: '美式咖啡' },
          { id: `o_${nanoid(6)}`, label: '拿铁' },
          { id: `o_${nanoid(6)}`, label: '卡布奇诺' },
          { id: `o_${nanoid(6)}`, label: '摩卡' },
          { id: `o_${nanoid(6)}`, label: '冷萃/冰咖啡' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'rating',
        title: '您对我们咖啡口感的整体满意度',
        required: true,
        maxRating: 5,
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '有什么建议或想法想告诉我们？',
        required: false,
        placeholder: '请分享您的想法...',
      },
    ];
  }
  // Satisfaction survey
  else if (lowerPrompt.includes('满意') || lowerPrompt.includes('反馈') || lowerPrompt.includes('feedback')) {
    title = '满意度调查';
    description = '您的反馈对我们非常重要，请花1分钟填写此问卷。';
    questions = [
      {
        id: `q_${nanoid(8)}`,
        type: 'rating',
        title: '您对我们的整体服务满意吗？',
        required: true,
        maxRating: 5,
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'radio',
        title: '您是否会向朋友推荐我们？',
        required: true,
        options: [
          { id: `o_${nanoid(6)}`, label: '一定会' },
          { id: `o_${nanoid(6)}`, label: '可能会' },
          { id: `o_${nanoid(6)}`, label: '不确定' },
          { id: `o_${nanoid(6)}`, label: '不太会' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'checkbox',
        title: '您最看重我们的哪些方面？',
        required: false,
        options: [
          { id: `o_${nanoid(6)}`, label: '产品质量' },
          { id: `o_${nanoid(6)}`, label: '服务态度' },
          { id: `o_${nanoid(6)}`, label: '价格合理' },
          { id: `o_${nanoid(6)}`, label: '配送速度' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '您有什么改进建议？',
        required: false,
        placeholder: '请告诉我们如何做得更好...',
      },
    ];
  }
  // Event/Activity registration
  else if (lowerPrompt.includes('活动') || lowerPrompt.includes('报名') || lowerPrompt.includes('event')) {
    title = '活动报名表';
    description = '请填写以下信息完成报名。';
    questions = [
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '您的姓名',
        required: true,
        placeholder: '请输入姓名',
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '联系电话',
        required: true,
        placeholder: '请输入手机号',
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'radio',
        title: '您希望参加哪个场次？',
        required: true,
        options: [
          { id: `o_${nanoid(6)}`, label: '上午场 (9:00-12:00)' },
          { id: `o_${nanoid(6)}`, label: '下午场 (14:00-17:00)' },
          { id: `o_${nanoid(6)}`, label: '晚间场 (19:00-21:00)' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '备注信息',
        required: false,
        placeholder: '如有特殊需求请在此说明...',
      },
    ];
  }
  // Default generic survey
  else {
    title = prompt.slice(0, 20) || '调研问卷';
    description = '感谢您抽出宝贵时间填写此问卷。';
    questions = [
      {
        id: `q_${nanoid(8)}`,
        type: 'radio',
        title: '请选择一个选项',
        required: true,
        options: [
          { id: `o_${nanoid(6)}`, label: '选项 A' },
          { id: `o_${nanoid(6)}`, label: '选项 B' },
          { id: `o_${nanoid(6)}`, label: '选项 C' },
        ],
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'rating',
        title: '请为这个问题打分',
        required: true,
        maxRating: 5,
      },
      {
        id: `q_${nanoid(8)}`,
        type: 'text',
        title: '请分享您的想法',
        required: false,
        placeholder: '请在此输入...',
      },
    ];
  }

  return {
    form_meta: {
      uuid: `f_${nanoid(10)}`,
      title,
      description,
      theme_id: 'theme_default',
      created_at: new Date().toISOString().split('T')[0],
    },
    questions,
  };
};

// Loading messages for AI generation
export const LOADING_MESSAGES = [
  '正在理解您的需求...',
  'AI 正在设计问题逻辑...',
  '正在优化问题结构...',
  '正在匹配视觉主题...',
  '即将完成...',
];
