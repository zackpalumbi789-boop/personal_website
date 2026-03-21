import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Hero = () => {
  return (
    <section className="relative w-full py-12 overflow-hidden">
      {/* 粒子装饰动效占位 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        {/* 简单的科技感线条或光点 */}
        <div className="absolute inset-0 opacity-20" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative mb-6 p-1 rounded-full bg-gradient-to-tr from-primary to-primary-glow shadow-lg shadow-primary/20 animate-fade-in">
          <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-white/10">
            <AvatarImage src="https://miaoda-image.bj.bcebos.com/unsplash_round1/01/unsplash_333637_ieDkvpIY_1A.jpg" alt="陆祁" className="object-cover" />
            <AvatarFallback className="bg-muted text-2xl font-bold">陆祁</AvatarFallback>
          </Avatar>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight animate-fade-in">
          陆祁
        </h1>
        
        <p className="max-w-xl text-base md:text-lg text-blue-100/90 font-medium leading-relaxed animate-fade-in delay-150">
          「我是一名互联网从业近17年的老兵，现在打算拥抱AI」
        </p>
      </div>
    </section>
  );
};

export default Hero;
