import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '你好！我是陆祁的数字分身。你可以问我关于我的职业背景、最近在忙什么，或者我的兴趣爱好。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const knowledgeBase = [
    { keywords: ['擅长', '能力', '会什么', '优势'], answer: '我擅长AI应用开发以及解决复杂的业务问题。作为一名有着17年经验的互联网老兵，我能从技术和业务双重角度看问题。' },
    { keywords: ['做什么', '忙什么', '近况', '现在'], answer: '我最近正忙着找工作，同时也全身心地投入到AI的学习和实践中。我坚信AI是互联网的下一个大浪潮，我正张开双臂拥抱它。' },
    { keywords: ['特点', '标签', '评价', '你是谁'], answer: '我是一个非常踏实的人。作为一名互联网老兵，我见过行业的起起伏伏，但我始终保持着对新知识的热情，比如最近正在深耕的AI领域。' },
    { keywords: ['兴趣', '爱好', '喜欢'], answer: '我喜欢学习新知识，特别是AI和理财方向。我也很喜欢尝试各种新体验，保持对世界的好奇心。' },
    { keywords: ['裁员', '经历', '背景', '经验'], answer: '我曾担任互联网技术总监。虽然最近面临裁员，但我将其视为一个重新出发、全面拥抱AI技术的绝佳机会。17年的行业积累是我最坚实的后盾。' }
  ];

  const quickQuestions = [
    '你擅长什么？',
    '你现在在做什么？',
    '你有什么特点？'
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // 简单关键词匹配逻辑
    let foundAnswer = '';
    const lowercaseInput = text.toLowerCase();
    
    for (const entry of knowledgeBase) {
      if (entry.keywords.some(k => lowercaseInput.includes(k))) {
        foundAnswer = entry.answer;
        break;
      }
    }

    if (!foundAnswer) {
      foundAnswer = '这个问题有点难住我了，你可以换个方式问问我～';
    }

    // 模拟打字机效果
    simulateTyping(foundAnswer);
  };

  const simulateTyping = (fullText: string) => {
    // 首先添加一个空的 bot 消息作为占位
    setMessages(prev => [...prev, { role: 'bot', content: '' }]);
    
    let currentText = '';
    const typingInterval = setInterval(() => {
      if (currentText.length < fullText.length) {
        currentText = fullText.substring(0, currentText.length + 1);
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'bot', content: currentText };
          return newMsgs;
        });
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30); // 稍微快一点
  };

  useEffect(() => {
    // 自动滚动到底部
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <section className="py-24 container bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">和我的数字分身聊聊</h2>
        </div>

        <Card className="shadow-xl border-none glass-morphism overflow-hidden flex flex-col h-[600px]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
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
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground border border-border'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-foreground border border-border rounded-tl-none'}`}>
                        {msg.content}
                        {isTyping && idx === messages.length - 1 && msg.role === 'bot' && <span className="typing-cursor ml-1" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-muted/20 border-t space-y-4">
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs bg-white dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors border-blue-200 dark:border-slate-700"
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
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
                  className="bg-white dark:bg-slate-800 rounded-full border-blue-100 dark:border-slate-700 focus-visible:ring-primary"
                  value={input}
                  onChange={(e) => setInput(e.target.value.substring(0, 200))}
                  maxLength={200}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full shrink-0" 
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ChatSection;
