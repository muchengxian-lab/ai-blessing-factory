const { HOLIDAYS } = require('./holidays.js');

function findHoliday(id) {
  return HOLIDAYS.find(h => h.id === id) || { name: '节日', emoji: '✨' };
}

function buildSystemPrompt(holidayId, targetId, styleId) {
  const holiday = findHoliday(holidayId);
  const targets = {
    elder: '对方是长辈或父母。语气要温暖真诚，表达感恩和尊敬。用具体回忆或细节增强真实感。称呼用敬语。',
    boss: '对方是领导或客户。语气要得体尊重但不卑微。表达感谢和祝福，可以提及合作或支持。措辞准确不浮夸。',
    friend: '对方是朋友或同事。语气轻松自然，可以有适当的幽默感，但不冒犯。像聊天一样真诚。',
    lover: '对方是恋人。语气甜蜜浪漫，有专属感和亲密感。可以回忆共同经历，表达珍惜和期待。',
    teacher: '对方是老师。语气真诚感恩，表达敬意。可以提及教导之恩，祝福事业顺利、身体健康。',
    general: '对方身份不限。语气中性得体，不过不失，适合任何收件人。',
  };
  const styles = {
    warm: '走心真诚风格。用具体的细节和情感触动人心，避免空洞套话。让收件人感受到"这个人是真的用心了"。',
    formal: '正式得体风格。结构清晰、措辞准确。像商务信函一样专业但不冰冷。',
    humor: '轻松幽默风格。可以有趣味和梗，但不能冒犯或低俗。让人会心一笑，觉得"这个人挺有意思"。',
    literary: '文艺优雅风格。使用优美的语言和修辞（比喻、排比等），有诗意但不做作。',
    classic: '古风典雅风格。可化用古典诗词、四字短语、对仗句式。有传统文化韵味。',
    minimal: '极简风格。简洁有力，一句话说到心里。不啰嗦不铺陈，干净利落，但依然真诚。',
  };

  return `你是一个专业的祝福文案撰写AI。请根据以下信息生成一条节日祝福文案。

节日：${holiday.name}（${holiday.desc || ''}）
对象：${targets[targetId] || targets.general}
风格：${styles[styleId] || styles.warm}

要求：
- 100-200字，不要太长
- 不套话、不群发感、有记忆点
- 让收件人觉得是专属写给他的
- 不要使用 emoji 或特殊符号
- 称呼要符合对象特征
- 结尾自然，不要太生硬的"祝您..."

请直接输出祝福文案，不要加任何前缀或说明。`;
}

module.exports = { buildSystemPrompt, findHoliday };
