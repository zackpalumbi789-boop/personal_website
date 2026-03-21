import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendStreamRequest } from '@/lib/stream';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是陆祁的数字分身。你可以跟我聊聊最近在忙点啥。' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const quickQuestions = [
    '你擅长什么？',
    '你现在在做什么？',
    '你有什么特点？'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // 添加用户消息
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // 添加空的助手消息作为占位
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    // 创建中断控制器
    abortControllerRef.current = new AbortController();

    try {
      // 准备发送给API的消息历史（不包括刚添加的空消息）
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      await sendStreamRequest({
        functionUrl: `${supabaseUrl}/functions/v1/chat`,
        requestBody: { messages: apiMessages },
        supabaseAnonKey,
        onData: (data) => {
          try {
            const parsed = JSON.parse(data);
            // MiniMax 流式响应格式: {choices: [{delta: {content: 'xxx'}}]}
            const chunk = parsed.choices?.[0]?.delta?.content || '';
            if (chunk) {
              setMessages(prev => {
                const newMsgs = [...prev];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg.role === 'assistant') {
                  lastMsg.content += chunk;
                }
                return newMsgs;
              });
            }
          } catch (e) {
            console.warn('解析流式数据失败:', e);
          }
        },
        onComplete: () => {
          setIsStreaming(false);
        },
        onError: (error) => {
          console.error('聊天请求失败:', error);
          toast.error('对话失败，请稍后重试');
          // 移除空的助手消息
          setMessages(prev => prev.slice(0, -1));
          setIsStreaming(false);
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error('发送失败，请检查网络连接');
      setMessages(prev => prev.slice(0, -1));
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    // 自动滚动到底部
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <section id="chat-entry" className="flex h-full min-h-[34rem] w-full flex-col p-4 md:min-h-0 md:p-8">
      <div className="mb-6 border-b border-slate-200 pb-4 md:mb-7 md:pb-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md border border-blue-200 bg-blue-50 p-2 dark:border-blue-900/60 dark:bg-blue-950/40">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl dark:text-slate-100">数字分身对话</h2>
            <p className="mt-1 text-sm font-normal text-slate-600 dark:text-slate-300">可以聊聊我最近在忙点啥，直接点下面按钮或输入问题。</p>
          </div>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border border-blue-300/80 bg-white shadow-md dark:border-blue-900/40 dark:bg-slate-900">
        <CardHeader className="border-b border-slate-200 bg-slate-50 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            陆祁的数字分身
            <span className="ml-auto flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                      {msg.content}
                      {isStreaming && idx === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-3 border-t border-slate-200 bg-slate-50/80 p-3 md:p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-slate-300 bg-white text-xs font-medium transition-colors hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-900"
                  onClick={() => handleSendMessage(q)}
                  disabled={isStreaming}
                >
                  {q}
                </Button>
              ))}
            </div>

            <form 
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
            >
              <Input
                placeholder="请输入您的问题..."
                className="rounded-full border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus-visible:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value.substring(0, 200))}
                maxLength={200}
                disabled={isStreaming}
              />
              <Button
                type="submit" 
                size="icon" 
                className="h-11 w-11 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 md:h-10 md:w-10" 
                disabled={!input.trim() || isStreaming}
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ChatSection;
