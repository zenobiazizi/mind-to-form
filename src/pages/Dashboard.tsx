import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Edit3, 
  BarChart3, 
  MoreHorizontal,
  Trash2,
  Square,
  Pencil
} from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { forms, deleteForm, renameForm, closeForm } = useFormStore();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

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

  const handleRename = () => {
    if (selectedFormId && newTitle.trim()) {
      renameForm(selectedFormId, newTitle.trim());
      setRenameDialogOpen(false);
      setSelectedFormId(null);
      setNewTitle('');
    }
  };

  const openRenameDialog = (formId: string, currentTitle: string) => {
    setSelectedFormId(formId);
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
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
            <div className="text-center">
              <p className="font-semibold text-foreground">AI 新建表单</p>
              <p className="text-sm text-muted-foreground mt-1">用一句话创建精美表单</p>
            </div>
          </motion.div>

          {/* Form Cards */}
          {forms.map((form, index) => (
            <motion.div
              key={form.form_meta.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
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

                {/* Description - show form description if available */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {form.form_meta.description || '暂无描述'}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">RESPONSES</p>
                    <p className="text-2xl font-bold text-foreground">{form.form_meta.stat_responses}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VIEWS</p>
                    <p className="text-2xl font-bold text-foreground">{form.form_meta.stat_pv}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/stats/${form.form_meta.uuid}`)}
                    className="h-10 w-10 rounded-full"
                    title="查看数据"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="更多操作"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/editor/${form.form_meta.uuid}`)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        编辑表单
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openRenameDialog(form.form_meta.uuid, form.form_meta.title)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        重命名
                      </DropdownMenuItem>
                      {form.form_meta.status === 'published' && (
                        <DropdownMenuItem onClick={() => closeForm(form.form_meta.uuid)}>
                          <Square className="w-4 h-4 mr-2" />
                          停止收集
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => deleteForm(form.form_meta.uuid)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名表单</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="输入新名称"
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
