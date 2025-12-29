import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Eye, 
  FileCheck, 
  Percent, 
  Download,
  FileText,
  BarChart3
} from 'lucide-react';
import { useFormStore } from '@/stores/formStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import * as XLSX from 'xlsx';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const StatsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFormById, getFormResponses } = useFormStore();

  const form = getFormById(id || '');
  const responses = getFormResponses(id || '');

  const stats = useMemo(() => {
    if (!form) return null;

    const pv = form.form_meta.stat_pv;
    const responseCount = responses.length;
    const conversionRate = pv > 0 ? ((responseCount / pv) * 100).toFixed(1) : '0';

    // Aggregate question stats
    const questionStats = form.questions.map((question) => {
      const questionResponses = responses.map((r) => 
        r.answers.find((a) => a.question_id === question.id)?.value
      ).filter(Boolean);

      if (question.type === 'radio' || question.type === 'checkbox') {
        const optionCounts: Record<string, number> = {};
        question.options?.forEach((opt) => {
          optionCounts[opt.id] = 0;
        });

        questionResponses.forEach((value) => {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              if (optionCounts[v] !== undefined) optionCounts[v]++;
            });
          } else if (typeof value === 'string') {
            if (optionCounts[value] !== undefined) optionCounts[value]++;
          }
        });

        const chartData = question.options?.map((opt) => ({
          name: opt.label,
          value: optionCounts[opt.id] || 0,
        })) || [];

        return { question, type: 'pie' as const, data: chartData };
      }

      if (question.type === 'rating') {
        const ratingCounts: Record<number, number> = {};
        for (let i = 1; i <= (question.maxRating || 5); i++) {
          ratingCounts[i] = 0;
        }

        questionResponses.forEach((value) => {
          if (typeof value === 'number' && ratingCounts[value] !== undefined) {
            ratingCounts[value]++;
          }
        });

        const chartData = Object.entries(ratingCounts).map(([rating, count]) => ({
          name: `${rating}分`,
          value: count,
        }));

        return { question, type: 'bar' as const, data: chartData };
      }

      // Text questions - show recent responses
      const recentTexts = questionResponses.slice(-3).map(String);
      return { question, type: 'text' as const, data: recentTexts, total: questionResponses.length };
    });

    return { pv, responseCount, conversionRate, questionStats };
  }, [form, responses]);

  const handleExport = () => {
    if (!form || responses.length === 0) return;

    const headers = ['提交时间', ...form.questions.map((q) => q.title)];
    const data = responses.map((response) => {
      const row: (string | number)[] = [
        new Date(response.submitted_at).toLocaleString('zh-CN'),
      ];
      form.questions.forEach((question) => {
        const answer = response.answers.find((a) => a.question_id === question.id);
        if (!answer) {
          row.push('');
          return;
        }
        if (Array.isArray(answer.value)) {
          const labels = answer.value.map((v) => {
            const opt = question.options?.find((o) => o.id === v);
            return opt?.label || v;
          });
          row.push(labels.join(', '));
        } else if (question.type === 'radio') {
          const opt = question.options?.find((o) => o.id === answer.value);
          row.push(opt?.label || String(answer.value));
        } else {
          row.push(String(answer.value));
        }
      });
      return row;
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '回收数据');
    XLSX.writeFile(wb, `${form.form_meta.title}_数据导出.xlsx`);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">表单不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">{form.form_meta.title}</h1>
                <p className="text-xs text-muted-foreground">数据看板</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={responses.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">浏览量</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.pv || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <FileCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">回收量</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.responseCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Percent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">回收率</p>
                    <p className="text-3xl font-bold text-foreground">{stats?.conversionRate || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Question Stats */}
        {stats?.questionStats && stats.questionStats.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground">题目统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.questionStats.map((qs, index) => (
                <motion.div
                  key={qs.question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{qs.question.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {qs.type === 'pie' && (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={qs.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                            >
                              {qs.data.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                      {qs.type === 'bar' && (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={qs.data}>
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {qs.type === 'text' && (
                        <div className="space-y-2">
                          {qs.data.length > 0 ? (
                            <>
                              {qs.data.map((text, i) => (
                                <div key={i} className="p-3 bg-muted rounded-lg text-sm text-foreground">
                                  "{text}"
                                </div>
                              ))}
                              {qs.total && qs.total > 3 && (
                                <p className="text-xs text-muted-foreground text-center">
                                  共 {qs.total} 条回复
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">暂无回复</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Data Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">数据明细</h2>
          <Card>
            <CardContent className="p-0">
              {responses.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">提交时间</TableHead>
                        {form.questions.map((q) => (
                          <TableHead key={q.id} className="min-w-[150px]">
                            {q.title}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell className="text-muted-foreground">
                            {new Date(response.submitted_at).toLocaleString('zh-CN')}
                          </TableCell>
                          {form.questions.map((question) => {
                            const answer = response.answers.find((a) => a.question_id === question.id);
                            let displayValue = '-';
                            if (answer) {
                              if (Array.isArray(answer.value)) {
                                displayValue = answer.value
                                  .map((v) => question.options?.find((o) => o.id === v)?.label || v)
                                  .join(', ');
                              } else if (question.type === 'radio') {
                                displayValue = question.options?.find((o) => o.id === answer.value)?.label || String(answer.value);
                              } else {
                                displayValue = String(answer.value);
                              }
                            }
                            return <TableCell key={question.id}>{displayValue}</TableCell>;
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无回收数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;
