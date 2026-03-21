import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FolderKanban, Heart, Link2, Mail, MessageCircle, Tag, Target } from 'lucide-react';

const InfoSection = () => {
  const infoItems = [
    {
      title: '当前在做',
      content: '忙着找工作，忙着学AI',
      icon: <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: '擅长方向',
      content: 'AI、解决业务问题',
      icon: <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: '兴趣爱好',
      content: '学习新知识（AI、理财）、尝试新体验',
      icon: <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: '个人标签',
      content: '踏实',
      icon: <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
  ];

  const projects = [
    {
      name: 'AI 个人主页',
      summary: '可对话的个人品牌主页。',
      href: '#',
    },
    {
      name: '业务效率工具',
      summary: '面向业务场景的效率工具。',
      href: '#',
    },
  ];

  const contacts = [
    {
      label: '邮箱',
      value: 'yourname@email.com',
      icon: <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      href: 'mailto:yourname@email.com',
    },
    {
      label: '微信',
      value: 'your_wechat_id',
      icon: <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      href: '#',
    },
  ];

  return (
    <section className="container border-t border-white/10 py-6 md:py-6">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white/95">我的信息</h2>
        <p className="mt-1 text-xs text-blue-100/80">快速了解我的背景、方向和关注重点。</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3">
        {infoItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-white/20 bg-white/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/80"
          >
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-slate-200/80 px-4 py-2 dark:border-slate-700/50">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                {item.icon}
              </div>
              <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 md:py-3.5">
              <p className="text-sm font-semibold leading-relaxed text-slate-800 md:text-base dark:text-slate-100">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-blue-300" />
          <h3 className="text-base font-semibold text-white/95">作品展示</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.name}
              className="overflow-hidden border border-white/20 bg-white/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/80"
            >
              <CardContent className="px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{project.summary}</p>
                  </div>
                  <a
                    href={project.href}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  >
                    查看
                    <Link2 className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-300" />
          <h3 className="text-base font-semibold text-white/95">联系方式</h3>
        </div>
        <Card className="overflow-hidden border border-white/20 bg-white/95 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/80">
          <CardContent className="px-3.5 py-2.5">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
                >
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    {contact.icon}
                    {contact.label}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{contact.value}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InfoSection;
