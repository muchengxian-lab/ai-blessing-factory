const STYLES = {
  warm: { name: '温情', emoji: '❤️', css: 'theme-warm', desc: '走心真诚，触动情感' },
  formal: { name: '正式', emoji: '💼', css: 'theme-formal', desc: '得体尊重，商务礼仪' },
  humor: { name: '幽默', emoji: '😄', css: 'theme-humor', desc: '轻松有趣，不油腻' },
  literary: { name: '文艺', emoji: '🌸', css: 'theme-literary', desc: '诗意优美，有文采' },
  classic: { name: '古风', emoji: '🏮', css: 'theme-classic', desc: '典雅传统，诗词化' },
  minimal: { name: '简约', emoji: '✨', css: 'theme-minimal', desc: '干净直接，不啰嗦' },
};

const TARGETS = [
  { id: 'elder', name: '长辈/父母', emoji: '👴' },
  { id: 'boss', name: '领导/客户', emoji: '💼' },
  { id: 'friend', name: '朋友/同事', emoji: '🤝' },
  { id: 'lover', name: '恋人/伴侣', emoji: '💝' },
  { id: 'teacher', name: '老师', emoji: '📚' },
  { id: 'general', name: '通用', emoji: '👤' },
];

function applyTheme(styleId) {
  const s = STYLES[styleId];
  return s ? s.css : 'theme-warm';
}

module.exports = { STYLES, TARGETS, applyTheme };
