const STYLES = {
  warm: { name: '温情', emoji: '❤️', icon: '/images/icons/style-warm.svg', css: 'theme-warm', desc: '走心真诚，触动情感' },
  formal: { name: '正式', emoji: '💼', icon: '/images/icons/style-formal.svg', css: 'theme-formal', desc: '得体尊重，商务礼仪' },
  humor: { name: '幽默', emoji: '😄', icon: '/images/icons/style-humor.svg', css: 'theme-humor', desc: '轻松有趣，不油腻' },
  literary: { name: '文艺', emoji: '🌸', icon: '/images/icons/style-literary.svg', css: 'theme-literary', desc: '诗意优美，有文采' },
  classic: { name: '古风', emoji: '🏮', icon: '/images/icons/style-classic.svg', css: 'theme-classic', desc: '典雅传统，诗词化' },
  minimal: { name: '简约', emoji: '✨', icon: '/images/icons/style-minimal.svg', css: 'theme-minimal', desc: '干净直接，不啰嗦' },
};

const TARGETS = [
  { id: 'elder', name: '长辈/父母', emoji: '👴', icon: '/images/icons/target-elder.svg' },
  { id: 'boss', name: '领导/客户', emoji: '💼', icon: '/images/icons/target-boss.svg' },
  { id: 'friend', name: '朋友/同事', emoji: '🤝', icon: '/images/icons/target-friend.svg' },
  { id: 'lover', name: '恋人/伴侣', emoji: '💝', icon: '/images/icons/target-lover.svg' },
  { id: 'teacher', name: '老师', emoji: '📚', icon: '/images/icons/target-teacher.svg' },
  { id: 'general', name: '通用', emoji: '👤', icon: '/images/icons/target-general.svg' },
];

function applyTheme(styleId) {
  const s = STYLES[styleId];
  return s ? s.css : 'theme-warm';
}

module.exports = { STYLES, TARGETS, applyTheme };
