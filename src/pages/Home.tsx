import React from 'react';
import Hero from '@/components/home/Hero';
import InfoSection from '@/components/home/InfoSection';
import ChatSection from '@/components/home/ChatSection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <InfoSection />
        <ChatSection />
      </main>
      
      <footer className="py-8 border-t bg-slate-50 dark:bg-slate-900 text-center text-muted-foreground text-sm">
        <div className="container">
          <p>© 2026 陆祁的个人主页 | 开启AI新篇章</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
