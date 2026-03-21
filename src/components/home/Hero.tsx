import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateAvatar } from '@/services/avatar';
import { toast } from 'sonner';

const Hero = () => {
  const [avatarUrl, setAvatarUrl] = useState('https://miaoda-image.cdn.bcebos.com/img/corpus/e6e6f6c76b834f77a31668f217402047.jpg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    setShowOptions(false);
    try {
      const images = await generateAvatar('一位年轻女性的卡通头像，可爱风格，动漫画风，温柔微笑，正面视角，干净背景，专业插画，高质量');
      if (images.length > 0) {
        setGeneratedOptions(images);
        setShowOptions(true);
        toast.success('头像生成成功！请选择一张喜欢的头像');
      } else {
        toast.error('未能生成头像，请重试');
      }
    } catch (error) {
      console.error('生成头像失败:', error);
      toast.error('生成头像失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAvatar = (url: string) => {
    setAvatarUrl(url);
    setShowOptions(false);
    toast.success('头像已更新！');
  };

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-blue-700 via-blue-800 to-background dark:from-slate-900 dark:via-blue-950 dark:to-background">
      {/* 粒子装饰动效占位 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        {/* 简单的科技感线条或光点 */}
        <div className="absolute inset-0 opacity-20" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-8 p-1 rounded-full bg-gradient-to-tr from-primary to-primary-glow shadow-lg shadow-primary/20 animate-fade-in">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/10">
            <AvatarImage src={avatarUrl} alt="陆祁" className="object-cover" />
            <AvatarFallback className="bg-muted text-2xl font-bold">陆祁</AvatarFallback>
          </Avatar>
          
          {/* 生成头像按钮 */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-2 -right-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={handleGenerateAvatar}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* 头像选项 */}
        {showOptions && generatedOptions.length > 0 && (
          <div className="mb-6 p-4 bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl backdrop-blur-sm animate-fade-in">
            <p className="text-sm text-foreground mb-3 font-medium">选择一张头像：</p>
            <div className="flex gap-3 justify-center">
              {generatedOptions.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAvatar(url)}
                  className="relative group"
                  type="button"
                >
                  <Avatar className="w-20 h-20 border-2 border-primary/50 hover:border-primary transition-all hover:scale-110 cursor-pointer">
                    <AvatarImage src={url} alt={`选项 ${idx + 1}`} className="object-cover" />
                  </Avatar>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 rounded-full transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight animate-fade-in">
          陆祁
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-blue-100/90 font-medium leading-relaxed animate-fade-in delay-150">
          「我是一名互联网从业近17年的老兵，现在打算拥抱AI」
        </p>
      </div>
    </section>
  );
};

export default Hero;
