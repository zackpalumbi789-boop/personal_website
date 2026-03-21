// 生成卡通头像的 Edge Function
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
    const { prompt, aspectRatio = '1:1', n = 1 } = await req.json();

    // 获取集成 API Key
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY 未配置');
    }

    // 调用文生图 API
    const response = await fetch(
      'https://app-ae73r17ju135-api-DLEO7vB8pQba-gateway.appmiaoda.com/v1/image_generation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'image-01',
          prompt: prompt || '一位年轻女性的卡通头像，可爱风格，动漫画风，温柔微笑，正面视角，干净背景',
          aspect_ratio: aspectRatio,
          n: n,
          prompt_optimizer: true,
          aigc_watermark: false,
          response_format: 'url',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 错误响应:', errorText);
      throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 检查业务状态码
    if (data.base_resp?.status_code !== 0) {
      throw new Error(data.base_resp?.status_msg || '图片生成失败');
    }

    return new Response(
      JSON.stringify({
        success: true,
        images: data.data?.image_urls || [],
        metadata: data.metadata,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('生成头像错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '生成头像失败',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
