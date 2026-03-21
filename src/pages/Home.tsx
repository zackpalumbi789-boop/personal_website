import Hero from '@/components/home/Hero';
import InfoSection from '@/components/home/InfoSection';
import ChatSection from '@/components/home/ChatSection';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-100 md:h-screen md:flex-row md:overflow-hidden dark:bg-slate-950">
      {/* 左侧：个人信息区 */}
      <div className="relative w-full border-b border-slate-700/60 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 md:w-[42%] md:overflow-y-auto md:border-b-0 md:border-r md:border-slate-800 md:no-scrollbar">
        <Hero />
        <div className="pb-5 md:pb-6">
          <InfoSection />
        </div>
      </div>

      {/* 右侧：聊天区 */}
      <div className="flex w-full bg-slate-50 md:w-[58%] dark:bg-slate-950/80">
        <ChatSection />
      </div>
    </div>
  );
};

export default Home;
