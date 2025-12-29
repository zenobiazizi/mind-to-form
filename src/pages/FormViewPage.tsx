import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '@/components/FormViewer';
import { FormData, FormStatus } from '@/types/form';
import { useFormStore } from '@/stores/formStore';
import { FileX } from 'lucide-react';

const FormViewPage: React.FC = () => {
  const { id, shortId } = useParams<{ id?: string; shortId?: string }>();
  const { forms, incrementPV, addResponse } = useFormStore();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [pageState, setPageState] = useState<'loading' | 'not_found' | 'not_published' | 'closed' | 'ready'>('loading');

  useEffect(() => {
    // Find form by uuid or by publish_url shortId
    let foundForm: FormData | undefined;

    if (shortId) {
      foundForm = forms.find((f) => f.form_meta.publish_url?.includes(shortId));
    } else if (id) {
      foundForm = forms.find((f) => f.form_meta.uuid === id);
    }

    if (!foundForm) {
      setPageState('not_found');
      return;
    }

    if (foundForm.form_meta.status === 'draft') {
      setPageState('not_published');
      return;
    }

    if (foundForm.form_meta.status === 'closed') {
      setPageState('closed');
      return;
    }

    setFormData(foundForm);
    setPageState('ready');
    
    // Increment PV
    incrementPV(foundForm.form_meta.uuid);
  }, [id, shortId, forms, incrementPV]);

  const handleSubmit = (answers: { question_id: string; value: string | string[] | number }[]) => {
    if (formData) {
      addResponse(formData.form_meta.uuid, answers);
    }
  };

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <FileX className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">表单不存在</h1>
        <p className="text-muted-foreground text-center">您访问的表单不存在或已被删除</p>
      </div>
    );
  }

  if (pageState === 'not_published') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <FileX className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">表单未发布</h1>
        <p className="text-muted-foreground text-center">该表单尚未发布，暂时无法访问</p>
      </div>
    );
  }

  if (pageState === 'closed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <FileX className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">本次调研已结束</h1>
        <p className="text-muted-foreground text-center">感谢您的关注，该表单已停止收集</p>
      </div>
    );
  }

  return <FormViewer formData={formData!} onSubmit={handleSubmit} />;
};

export default FormViewPage;
