function callGenerate(holiday, target, style) {
  return prepareBlessing(holiday, target, style)
    .then(async prepRes => {
      const prep = prepRes.result || {};
      if (prep.code !== 'READY') return prepRes;

      let blessings = [];
      let source = 'ai';
      let errorMessage = '';

      try {
        blessings = await generateBlessingsWithAI(prep.systemPrompt, prep.userPrompt);
      } catch (err) {
        source = 'fallback';
        errorMessage = err && err.message ? err.message : String(err);
        blessings = prep.fallbackBlessings || [];
        console.error('[generateBlessing] AI failed:', err);
      }

      if (!blessings || blessings.length === 0) {
        source = 'fallback';
        errorMessage = errorMessage || 'AI returned empty content';
        blessings = prep.fallbackBlessings || [];
      }

      return saveBlessing(holiday, target, style, blessings, source, errorMessage)
        .then(saveRes => {
          if (saveRes && saveRes.result && source === 'fallback') {
            saveRes.result.aiErrorMessage = errorMessage;
          }
          return saveRes;
        });
    });
}

function prepareBlessing(holiday, target, style) {
  return wx.cloud.callFunction({
    name: 'generateBlessing',
    data: { holiday, target, style },
  });
}

function saveBlessing(holiday, target, style, content, source, errorMessage) {
  return wx.cloud.callFunction({
    name: 'generateBlessing',
    data: { holiday, target, style, content, source, errorMessage },
  });
}

async function generateBlessingsWithAI(systemPrompt, userPrompt) {
  checkSDKVersion();

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  let lastErr = null;

  // hunyuan-v3: 小程序成长计划免费 Token（需要基础库 ≥ 3.15.1）
  // cloudbase: 付费资源包备用
  const providers = [
    { create: 'hunyuan-v3', model: 'hy3-preview' },
    { create: 'cloudbase', model: 'deepseek-v4-flash' },
  ];

  for (const p of providers) {
    try {
      const model = wx.cloud.extend.AI.createModel(p.create);
      const res = await model.streamText(buildStreamOptions(p.model, messages));
      const fullText = await readAIStream(res);

      if (fullText.trim()) {
        const parsed = parseAIText(fullText);
        if (parsed.length > 0) return parsed;
      }
      console.warn(`[generateBlessing] ${p.create}/${p.model} returned empty text`);
    } catch (err) {
      lastErr = err;
      console.warn(`[generateBlessing] ${p.create}/${p.model} failed:`, err.message || err);
    }
  }

  console.error('[generateBlessing] all AI providers exhausted');
  throw lastErr || new Error('AI generation failed');
}

function checkSDKVersion() {
  if (!wx.cloud || !wx.cloud.extend || !wx.cloud.extend.AI) {
    throw new Error('wx.cloud.extend.AI unavailable');
  }
  const sdk = (wx.getSystemInfoSync && wx.getSystemInfoSync().SDKVersion) || '0.0.0';
  const [major, minor] = sdk.split('.').map(Number);
  if (major < 3 || (major === 3 && minor < 15)) {
    throw new Error(`基础库版本 ${sdk} 过低，AI 生成需要 ≥ 3.15.1，请升级微信客户端`);
  }
}

function buildStreamOptions(model, messages) {
  const data = model ? { model, messages } : { messages };
  return { data };
}

async function readAIStream(res) {
  if (!res || !res.eventStream || !res.eventStream[Symbol.asyncIterator]) {
    const keys = res ? Object.keys(res).join(',') : 'empty response';
    throw new Error(`AI stream response invalid: ${keys}`);
  }

  let fullText = '';
  for await (const event of res.eventStream) {
    if (event.data === '[DONE]') break;
    try {
      const chunk = JSON.parse(event.data);
      const delta = chunk?.choices?.[0]?.delta?.content;
      if (delta) fullText += delta;
    } catch (e) { /* skip malformed events */ }
  }
  return fullText;
}

function parseAIText(text) {
  if (!text) return [];
  const cleaned = text.replace(/\r/g, '').trim();
  const sections = cleaned
    .split(/\n\s*---\s*\n/)
    .map(section => section
      .split('\n')
      .map(line => line.replace(/^\s*(?:\d+[\.\、\)]|[-*])\s*/, '').trim())
      .filter(Boolean)
      .join('\n'))
    .filter(section => section.replace(/\s/g, '').length >= 20);

  if (sections.length >= 3) return sections.slice(0, 3);

  const lines = cleaned
    .split(/\n+/)
    .map(line => line.replace(/^\s*(?:\d+[\.\、\)]|[-*])\s*/, '').trim())
    .filter(Boolean);
  if (lines.length >= 12) {
    return [lines.slice(0, 5), lines.slice(5, 10), lines.slice(10, 15)]
      .map(group => group.join('\n'))
      .filter(section => section.replace(/\s/g, '').length >= 20)
      .slice(0, 3);
  }

  return [cleaned].filter(item => item.replace(/\s/g, '').length >= 20);
}

function callGetBlessing(blessingId) {
  return wx.cloud.callFunction({
    name: 'getBlessing',
    data: { blessingId },
  });
}

function callListHistory(page = 1, pageSize = 20) {
  return wx.cloud.callFunction({
    name: 'listHistory',
    data: { page, pageSize },
  });
}

function callTrackShare(blessingId, channel) {
  return wx.cloud.callFunction({
    name: 'trackShare',
    data: { blessingId, channel },
  });
}

module.exports = {
  callGenerate,
  callGetBlessing,
  callListHistory,
  callTrackShare,
};
