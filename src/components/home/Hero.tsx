import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/15 py-10 md:py-12">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="container relative z-10 px-6">
        <div className="mx-auto flex max-w-xl flex-col items-start text-left">
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/5 p-1">
            <Avatar className="h-24 w-24 border-2 border-white/25 md:h-28 md:w-28">
              <AvatarImage src="/avatar-professional-woman.svg" alt="陆祁" className="object-cover" />
              <AvatarFallback className="bg-muted text-2xl font-bold">陆祁</AvatarFallback>
            </Avatar>
          </div>

          <p className="mb-4 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
            PRODUCT x AI
          </p>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">陆祁</h1>
          <p className="max-w-lg text-base font-normal leading-7 text-blue-100/85 md:text-base md:leading-7">
            一个正在学习用 AI 做产品的互联网老兵。
          </p>
          <a
            href="#chat-entry"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center rounded-full border border-blue-500 bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 md:w-auto"
          >
            进入数字对话
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
