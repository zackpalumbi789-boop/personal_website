import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Target, Heart, Tag } from 'lucide-react';

const InfoSection = () => {
  const infoItems = [
    {
      title: '当前在做',
      content: '忙着找工作，忙着学AI',
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: '擅长方向',
      content: 'AI、解决业务问题',
      icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-100 dark:bg-blue-800/30',
    },
    {
      title: '兴趣爱好',
      content: '学习新知识（AI、理财）、尝试新体验',
      icon: <Heart className="w-6 h-6 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/10',
    },
    {
      title: '个人标签',
      content: '踏实',
      icon: <Tag className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 dark:bg-emerald-900/10',
    },
  ];

  return (
    <section className="py-24 container bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in delay-300">
        {infoItems.map((item, index) => (
          <Card key={index} className={`border-none shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${item.color}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 shadow-sm">
                {item.icon}
              </div>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-foreground leading-snug">
                {item.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default InfoSection;
