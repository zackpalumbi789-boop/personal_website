import React, { useState, useRef, useEffect } from 'react';
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
    { role: 'assistant', content: '你好！我是陆祁的数字分身。你可以问我关于我的职业背景、最近在忙什么，或者我的兴趣爱好。' }
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
    <section className="h-full flex flex-col p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">和我的数字分身聊聊</h2>
      </div>

      <Card className="flex-1 shadow-xl border border-blue-100 dark:border-blue-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden flex flex-col">
        <CardHeader className="border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/30 py-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            陆祁的数字分身
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse ml-auto" />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-blue-100 dark:border-blue-900/30 rounded-tl-none'}`}>
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

          <div className="p-4 bg-blue-50/30 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border-blue-200 dark:border-blue-800"
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
                className="bg-white dark:bg-slate-800 rounded-full border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value.substring(0, 200))}
                maxLength={200}
                disabled={isStreaming}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full shrink-0 bg-blue-600 hover:bg-blue-700" 
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
