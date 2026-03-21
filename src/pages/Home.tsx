import React from 'react';
import Hero from '@/components/home/Hero';
import InfoSection from '@/components/home/InfoSection';
import ChatSection from '@/components/home/ChatSection';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧：个人信息区 */}
      <div className="w-full md:w-1/2 overflow-y-auto bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800">
        <Hero />
        <div className="pb-8">
          <InfoSection />
        </div>
      </div>

      {/* 右侧：聊天区 */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-blue-50 via-slate-50 to-blue-50/50 dark:bg-gradient-to-bl dark:from-slate-900/80 dark:via-slate-900 dark:to-blue-950/30">
        <ChatSection />
      </div>
    </div>
  );
};

export default Home;
