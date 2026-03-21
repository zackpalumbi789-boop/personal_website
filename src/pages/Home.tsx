import React from 'react';
import Hero from '@/components/home/Hero';
import InfoSection from '@/components/home/InfoSection';
import ChatSection from '@/components/home/ChatSection';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧：个人信息区 */}
      <div className="w-full md:w-1/2 overflow-y-auto bg-gradient-to-b from-blue-700 via-blue-800 to-background dark:from-slate-900 dark:via-blue-950 dark:to-background">
        <Hero />
        <div className="pb-8">
          <InfoSection />
        </div>
      </div>

      {/* 右侧：聊天区 */}
      <div className="hidden md:flex md:w-1/2 bg-slate-50 dark:bg-slate-900/50">
        <ChatSection />
      </div>
    </div>
  );
};

export default Home;
