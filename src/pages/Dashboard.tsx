import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Trash2,
  Pause,
  Play
} from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { forms, deleteForm, closeForm, reopenForm } = useFormStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">草稿</Badge>;
      case 'published':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">收集中</Badge>;
      case 'closed':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">已停止</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SuperForm</span>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">我的表单</h1>
          <p className="text-muted-foreground">管理您创建的所有表单</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Form Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            className="group cursor-pointer border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[200px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <p className="font-semibold text-foreground">AI 新建表单</p>
          </motion.div>

          {/* Form Cards */}
          {forms.map((form, index) => (
            <motion.div
              key={form.form_meta.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
                className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              {/* Card Content */}
              <div className="p-6">
                {/* Status Badge */}
                <div className="mb-4">
                  {getStatusBadge(form.form_meta.status)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                  {form.form_meta.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {form.form_meta.description || '暂无描述'}
                </p>

                {/* Stats Row with Action Buttons */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VIEWS</p>
                      <p className="text-2xl font-bold text-foreground">{form.form_meta.stat_pv}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">RESPONSES</p>
                      <p className="text-2xl font-bold text-foreground">{form.form_meta.stat_responses}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stats/${form.form_meta.uuid}`);
                      }}
                      className="h-10 w-10 rounded-full"
                      title="查看数据"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    
                    {form.form_meta.status === 'published' ? (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeForm(form.form_meta.uuid);
                        }}
                        className="h-10 w-10 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="暂停收集"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : form.form_meta.status === 'closed' ? (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          reopenForm(form.form_meta.uuid);
                        }}
                        className="h-10 w-10 rounded-full text-green-600 hover:text-green-600 hover:bg-green-500/10"
                        title="启动收集"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {forms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">还没有表单，点击上方创建第一个吧</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
