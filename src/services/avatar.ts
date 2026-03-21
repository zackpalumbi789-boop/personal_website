import { supabase } from '@/db/supabase';

/**
 * 生成卡通头像
 * @param prompt 可选的自定义提示词
 * @returns 生成的图片URL数组
 */
export async function generateAvatar(prompt?: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-avatar', {
      body: {
        prompt: prompt || '一位年轻女性的卡通头像，可爱风格，动漫画风，温柔微笑，正面视角，干净背景，专业插画',
        aspectRatio: '1:1',
        n: 3, // 生成3张供选择
      },
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('生成头像错误:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || '生成头像失败');
    }

    if (!data?.success) {
      throw new Error(data?.error || '生成头像失败');
    }

    return data.images || [];
  } catch (err) {
    console.error('调用生成头像API失败:', err);
    throw err;
  }
}
