const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { holiday, target, style } = event;
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Rate limit: 1 per user per 30s
  const { total: recentCount } = await db.collection('blessings')
    .where({ userId, createdAt: db.command.gte(new Date(Date.now() - 30000)) })
    .count();
  if (recentCount > 0) {
    return { code: 'TOO_FREQUENT', message: '请30秒后再试' };
  }

  try {
    const blessings = [];
    const temps = [0.85, 0.92, 1.0];

    for (let i = 0; i < 3; i++) {
      const { buildSystemPrompt } = require('./prompt.js');
      const systemPrompt = buildSystemPrompt(holiday, target, style);

      const result = await cloud.openapi.hunyuan.chatCompletions({
        model: 'hunyuan-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请为"${holiday}"生成一条发给"${target}"的祝福文案，风格"${style}"。` }
        ],
        temperature: temps[i],
        max_tokens: 600,
      });

      const text = (result.choices && result.choices[0] && result.choices[0].message.content) || '';
      // Content security check
      if (text) {
        try {
          const secRes = await cloud.openapi.security.msgSecCheck({
            content: text,
            version: 2,
            openid: userId,
            scene: 2,
          });
          if (secRes.result && secRes.result.suggest === 'pass') {
            blessings.push(text.trim());
          }
        } catch (secErr) {
          // If security check fails, skip this version
          console.warn('msgSecCheck failed:', secErr);
        }
      }
    }

    // Fallback if all versions failed
    if (blessings.length === 0) {
      const fallback = getFallback(holiday, target);
      blessings.push(fallback, fallback, fallback);
    }

    const emojiMap = {
      '父亲节': '🎁', '端午节': '🎋', '七夕': '💕', '中秋节': '🌕',
      '春节': '🧧', '教师节': '🍎', '母亲节': '🌸', '生日': '🎂',
    };
    const emoji = emojiMap[holiday] || '✨';

    const res = await db.collection('blessings').add({
      data: {
        userId,
        holiday,
        holidayEmoji: emoji,
        target,
        style,
        content: blessings,
        createdAt: Date.now(),
      },
    });

    return {
      code: 'OK',
      blessingId: res._id,
      blessings,
    };
  } catch (err) {
    console.error('generateBlessing error:', err);
    const fallback = getFallback(holiday, target);
    return {
      code: 'FALLBACK',
      blessings: [fallback, fallback, fallback],
      message: 'AI暂时不可用，已使用备选文案',
    };
  }
};

function getFallback(holiday, target) {
  const map = {
    '父亲节': '爸，平时话少，但心里都有。这些年您撑起这个家，辛苦了。父亲节快乐。',
    '端午节': '端午安康！愿你生活像粽子一样，甜甜蜜蜜，层层惊喜。',
    '七夕': '愿与你共度每一个朝夕，携手看尽世间繁华。七夕快乐。',
    '中秋节': '月圆人团圆，愿你和家人幸福安康，中秋快乐！',
    '母亲节': '妈，您的爱是我永远的港湾。母亲节快乐，身体健康。',
    '教师节': '师恩难忘，感谢您的教导与陪伴。祝老师节日快乐！',
    '春节': '新年快乐！愿你新的一年万事如意，幸福安康！',
    '生日': '生日快乐！愿新的一岁，所有美好如期而至。',
  };
  return map[holiday] || `祝${holiday}快乐！愿你和家人幸福安康。`;
}
