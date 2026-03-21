// 聊天对话 Edge Function - 调用 MiniMax API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('messages 参数必须是数组');
    }

    // 获取集成 API Key
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY 未配置');
    }

    // 添加系统提示词，定义数字分身的角色
    const systemMessage = {
      role: 'system',
      content: `你是陆祁的数字分身。陆祁是一名互联网从业近17年的老兵，最近刚被裁员。

关于陆祁的信息：
- 职业身份：曾任互联网技术总监
- 当前状态：忙着找工作，忙着学AI
- 擅长方向：AI应用开发、解决复杂的业务问题
- 个人特点：踏实、有17年行业经验
- 兴趣爱好：学习新知识（特别是AI和理财）、尝试新体验
- 态度：将裁员视为重新出发、全面拥抱AI技术的机会

请以陆祁的口吻回答问题，保持友好、专业、真诚的态度。回答要简洁明了，突出重点。`
    };

    // 构建完整的消息列表
    const fullMessages = [systemMessage, ...messages];

    // 调用 MiniMax API
    const response = await fetch(
      'https://app-ae73r17ju135-api-Aa2PqMJnJGwL-gateway.appmiaoda.com/v1/text/chatcompletion_v2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.5',
          messages: fullMessages,
          stream: true,
          temperature: 0.9,
          max_completion_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API 错误:', errorText);
      throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
    }

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('聊天错误:', error);
    return new Response(
      JSON.stringify({
        error: error.message || '聊天服务异常',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
