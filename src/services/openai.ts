import OpenAI from 'openai';
import type { SceneType } from '../types/assistant';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 注意：在生产环境应该使用后端代理
});

interface ChatContext {
  temperature: number;
  weather: string;
  scene: SceneType;
  preferences?: string[];
  history?: string[];
}

export const getAIFashionAdvice = async (context: ChatContext) => {
  try {
    const { temperature, weather, scene, preferences = [], history = [] } = context;

    const prompt = `
作为一个专业的穿衣搭配顾问，请根据以下条件给出穿衣建议：

当前情况：
- 温度：${temperature}°C
- 天气：${weather}
- 场景：${scene}
${preferences.length > 0 ? `- 个人偏好：${preferences.join(', ')}` : ''}
${history.length > 0 ? `- 历史搭配：${history.join(', ')}` : ''}

请提供：
1. 详细的穿搭建议（包括上装、下装、鞋子和配饰）
2. 搭配理由
3. 注意事项
4. 可选的替代方案

请以JSON格式返回，包含以下字段：
- outfits: 穿搭建议数组
- reasons: 推荐理由数组
- tips: 注意事项数组
- alternatives: 替代方案数组
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '{}');
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('获取AI建议失败');
  }
};

// 获取场景化建议
export const getSceneAdvice = async (scene: SceneType) => {
  try {
    const prompt = `
请为以下场景提供详细的着装指南：${scene}

请包含：
1. 场景特点分析
2. 着装要点
3. 禁忌事项
4. 配饰建议
5. 整体搭配技巧

请以JSON格式返回。
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('获取场景建议失败');
  }
};

// 获取个性化时尚建议
export const getPersonalizedFashionAdvice = async (
  preferences: string[],
  style: string,
  constraints: string[]
) => {
  try {
    const prompt = `
请根据以下个人偏好和限制条件，提供个性化的穿搭建议：

偏好：${preferences.join(', ')}
风格：${style}
限制条件：${constraints.join(', ')}

请提供：
1. 符合个人风格的具体搭配建议
2. 配色方案
3. 材质搭配
4. 个性化细节建议

请以JSON格式返回。
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('获取个性化建议失败');
  }
}; 
