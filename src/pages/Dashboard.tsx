import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2,
  Pause,
  Play,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { forms, deleteForm, closeForm, reopenForm } = useFormStore();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return { text: '草稿', className: 'text-muted-foreground' };
      case 'published':
        return { text: '收集中', className: 'text-emerald-600' };
      case 'closed':
        return { text: '已停止', className: 'text-rose-500' };
      default:
        return { text: '', className: '' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-foreground">SuperForm</span>
            <span className="text-xs text-muted-foreground/60 font-medium">Beta</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">我的表单</h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* New Form Card */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/create')}
            className="group cursor-pointer border border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 min-h-[220px]"
          >
            <div className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors duration-300">
              <Plus className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">AI 新建表单</p>
          </motion.div>

          {/* Form Cards */}
          {forms.map((form, index) => {
            const status = getStatusLabel(form.form_meta.status);
            return (
              <motion.div
                key={form.form_meta.uuid}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border hover:shadow-sm transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/editor/${form.form_meta.uuid}`)}
              >
                {/* Delete button - appears on hover */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteForm(form.form_meta.uuid);
                  }}
                  className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/8 rounded-full"
                  title="删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                {/* Card Content */}
                <div className="p-5 flex flex-col h-full min-h-[220px]">
                  {/* Status */}
                  <div className="mb-3">
                    <span className={`text-[11px] font-medium uppercase tracking-widest ${status.className}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
                    {form.form_meta.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground/70 mb-auto line-clamp-2 leading-relaxed">
                    {form.form_meta.description || '暂无描述'}
                  </p>

                  {/* Stats Row with Action Buttons */}
                  <div className="flex items-end justify-between pt-5 mt-4 border-t border-border/30">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-lg font-semibold text-foreground tabular-nums">{form.form_meta.stat_pv}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-lg font-semibold text-foreground tabular-nums">{form.form_meta.stat_responses}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {form.form_meta.status === 'published' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            closeForm(form.form_meta.uuid);
                          }}
                          className="h-8 w-8 rounded-full text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/8"
                          title="暂停收集"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                      ) : form.form_meta.status === 'closed' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            reopenForm(form.form_meta.uuid);
                          }}
                          className="h-8 w-8 rounded-full text-muted-foreground/60 hover:text-emerald-600 hover:bg-emerald-500/8"
                          title="启动收集"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {forms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground/60">还没有表单，点击上方创建第一个</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
