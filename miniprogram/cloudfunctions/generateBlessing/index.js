const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const { buildSystemPrompt, getFallback } = require('./prompt.js');

exports.main = async (event) => {
  const { holiday, target, style, content, source = 'ai', errorMessage = '' } = event;
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  if (!holiday || !target || !style) {
    return { code: 'INVALID_PARAMS', message: '缺少生成参数' };
  }

  const recent = await getRecentCount(userId);
  if (recent > 0) {
    return { code: 'TOO_FREQUENT', message: '请30秒后再试' };
  }

  if (content) {
    return saveBlessing({
      userId,
      holiday,
      target,
      style,
      content,
      source,
      errorMessage,
    });
  }

  const fallback = getFallback(holiday, target);

  return {
    code: 'READY',
    systemPrompt: buildSystemPrompt(holiday, target, style),
    userPrompt: `请为「${holiday}」生成3条发给「${target}」的海报祝福短句，风格为「${style}」。
每条4-6行，每行8-18个汉字。
每条之间用单独一行 --- 分隔。
不要编号，不要解释。`,
    fallbackBlessings: [fallback, fallback, fallback],
  };
};

async function getRecentCount(userId) {
  const recentStart = Date.now() - 30000;
  const { total } = await db.collection('blessings')
    .where({ userId, createdAt: db.command.gte(recentStart) })
    .count();
  return total;
}

async function saveBlessing(options) {
  const { userId, holiday, target, style } = options;
  let source = options.source === 'fallback' ? 'fallback' : 'ai';
  let errorMessage = String(options.errorMessage || '').slice(0, 300);
  let blessings = normalizeContent(options.content);

  if (blessings.length === 0) {
    return { code: 'EMPTY_CONTENT', message: '祝福语内容为空' };
  }

  const checked = await filterSafeContents(blessings, userId);
  blessings = checked.safeContents;

  if (blessings.length === 0) {
    const fallbackChecked = await filterSafeContents(buildFallbackList(holiday, target), userId);
    blessings = fallbackChecked.safeContents;
    source = 'fallback';
    errorMessage = errorMessage || checked.errorMessage || 'AI content blocked by security check';

    if (blessings.length === 0 && isSecurityApiUnavailable(checked.errorMessage || fallbackChecked.errorMessage)) {
      blessings = buildFallbackList(holiday, target);
      errorMessage = 'Security API unavailable; saved curated fallback content';
    }

    if (blessings.length === 0) {
      return {
        code: 'CONTENT_BLOCKED',
        message: '生成内容未通过安全审核，请重试',
      };
    }
  }

  while (blessings.length < 3) {
    blessings.push(blessings[blessings.length - 1]);
  }

  try {
    const res = await db.collection('blessings').add({
      data: {
        _openid: userId,
        userId,
        holiday,
        holidayEmoji: getHolidayEmoji(holiday),
        target,
        style,
        content: blessings,
        source,
        errorMessage,
        createdAt: Date.now(),
      },
    });

    return {
      code: 'OK',
      blessingId: res._id,
      blessings,
      source,
      message: source === 'fallback' ? 'AI暂时不可用，已使用备用文案' : '',
    };
  } catch (err) {
    console.error('save blessing failed:', err);
    return {
      code: 'DB_ERROR',
      blessings,
      message: '祝福语已生成，但保存失败，请检查数据库权限或集合配置',
    };
  }
}

function normalizeContent(content) {
  const list = Array.isArray(content) ? content : [content];
  return list
    .map(item => String(item || '').trim())
    .filter(item => item.length > 0)
    .slice(0, 3);
}

async function filterSafeContents(contents, userId) {
  const safeContents = [];
  const blockedDetails = [];

  for (let i = 0; i < contents.length; i += 1) {
    try {
      const secRes = await cloud.openapi.security.msgSecCheck({
        content: contents[i],
        version: 2,
        openid: userId,
        scene: 2,
      });
      if (isSecurityPass(secRes)) {
        safeContents.push(contents[i]);
      } else {
        console.warn('msgSecCheck blocked content:', {
          errCode: secRes.errCode,
          errMsg: secRes.errMsg,
          suggest: secRes.result && secRes.result.suggest,
          label: secRes.result && secRes.result.label,
        });
        blockedDetails.push({
          errCode: secRes.errCode,
          errMsg: secRes.errMsg,
          suggest: secRes.result && secRes.result.suggest,
          label: secRes.result && secRes.result.label,
        });
      }
    } catch (err) {
      console.warn('msgSecCheck failed:', err);
      return {
        safeContents: [],
        blockedDetails,
        errorMessage: err && err.message ? err.message : String(err),
      };
    }
  }

  return { safeContents, blockedDetails };
}

function isSecurityPass(secRes) {
  if (!secRes) return false;
  const result = secRes.result || {};
  if (result.suggest) return result.suggest === 'pass';
  return secRes.errCode === 0 || secRes.errCode === '0' || /:ok$/i.test(secRes.errMsg || '');
}

function isSecurityApiUnavailable(message) {
  return /-604101|no permission to call this API/i.test(message || '');
}

function buildFallbackList(holiday, target) {
  const fallback = getFallback(holiday, target);
  return [
    fallback,
    `${fallback} 愿这份心意被好好收到，也愿接下来的每一天都平安顺遂。`,
    `${fallback} 把最真诚的祝福送给你，愿生活从容，万事顺意。`,
  ];
}

function getHolidayEmoji(holiday) {
  const emojiMap = {
    '父亲节': '🎁',
    '端午节': '🧵',
    '七夕': '💌',
    '情人节': '💌',
    '中秋节': '🌕',
    '春节': '🧧',
    '新年': '🧧',
    '教师节': '💐',
    '母亲节': '🌷',
    '生日': '🎂',
  };
  return emojiMap[holiday] || '✨';
}
