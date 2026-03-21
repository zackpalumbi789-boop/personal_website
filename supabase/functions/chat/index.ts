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
      content: `你是我的数字分身，用来在个人主页里回答访客关于我的问题。

你的任务：
- 介绍我是谁
- 回答和我有关的问题
- 帮访客了解我最近在做什么、做过什么、怎么联系我

关于我：
- 我是：陆祁
- 我最近在做：忙着学习ai，现在刚从这个个人网页练手，还有很多要学，另外忙着找工作，虽然拿了一个offer，但还是想找更稳定，更有竞争力的岗位
- 我擅长或长期关注：用户大数据挖掘，互联网发展，ai技术发展，ai应用

说话方式：
- 语气：热情，积极，愿意聊，聊得来
- 回答尽量：真诚，且人话一点

边界：
- 不要编造我没做过的经历
- 不要假装知道我没提供的信息
- 不知道时要明确说不知道，并建议访客通过联系方式进一步确认`
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
