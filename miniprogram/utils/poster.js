const W = 750;
const H = 1334;

const THEMES = {
  fathers_day: {
    aliases: ['父亲节'],
    bg: ['#151021', '#172640'],
    text: '#F3E7D1',
    muted: 'rgba(243,231,209,0.62)',
    accent: '#E2B761',
    accentSoft: 'rgba(226,183,97,0.16)',
    card: 'rgba(255,255,255,0.075)',
    cardStroke: 'rgba(226,183,97,0.32)',
    seal: '#B9483E',
    motif: drawMountainMotif,
  },
  dragon_boat: {
    aliases: ['端午节'],
    bg: ['#F8F1DD', '#DDE9D2'],
    text: '#163225',
    muted: 'rgba(38,55,40,0.62)',
    accent: '#497E5A',
    accentSoft: 'rgba(73,126,90,0.13)',
    card: 'rgba(255,255,255,0.58)',
    cardStroke: 'rgba(73,126,90,0.24)',
    seal: '#B9483E',
    motif: drawLeafMotif,
  },
  qixi: {
    aliases: ['七夕', '情人节'],
    bg: ['#38203E', '#E5A7B4'],
    text: '#FFF3EC',
    muted: 'rgba(255,243,236,0.66)',
    accent: '#FFD0A6',
    accentSoft: 'rgba(255,208,166,0.18)',
    card: 'rgba(255,255,255,0.12)',
    cardStroke: 'rgba(255,208,166,0.28)',
    seal: '#C94B63',
    motif: drawPairedStarMotif,
  },
  mid_autumn: {
    aliases: ['中秋节'],
    bg: ['#FFF3D8', '#E7CF91'],
    text: '#392B18',
    muted: 'rgba(57,43,24,0.62)',
    accent: '#B8832B',
    accentSoft: 'rgba(184,131,43,0.14)',
    card: 'rgba(255,255,255,0.56)',
    cardStroke: 'rgba(184,131,43,0.26)',
    seal: '#B9483E',
    motif: drawMoonMotif,
  },
  teachers_day: {
    aliases: ['教师节'],
    bg: ['#F4E5C7', '#D9C39B'],
    text: '#332817',
    muted: 'rgba(51,40,23,0.62)',
    accent: '#9A6D2D',
    accentSoft: 'rgba(154,109,45,0.13)',
    card: 'rgba(255,255,255,0.52)',
    cardStroke: 'rgba(154,109,45,0.25)',
    seal: '#B9483E',
    motif: drawBookMotif,
  },
  spring_festival: {
    aliases: ['春节', '新年'],
    bg: ['#8F1721', '#D94C38'],
    text: '#FFF0D2',
    muted: 'rgba(255,240,210,0.68)',
    accent: '#F5C768',
    accentSoft: 'rgba(245,199,104,0.18)',
    card: 'rgba(255,245,220,0.12)',
    cardStroke: 'rgba(245,199,104,0.36)',
    seal: '#7B1220',
    motif: drawLanternMotif,
  },
  birthday: {
    aliases: ['生日'],
    bg: ['#FFF4DF', '#F3C7B7'],
    text: '#38251D',
    muted: 'rgba(56,37,29,0.62)',
    accent: '#C8795B',
    accentSoft: 'rgba(200,121,91,0.14)',
    card: 'rgba(255,255,255,0.58)',
    cardStroke: 'rgba(200,121,91,0.26)',
    seal: '#B9483E',
    motif: drawCandleMotif,
  },
  general: {
    aliases: ['感谢', '通用祝福'],
    bg: ['#FBF8EF', '#EEE3CF'],
    text: '#2E2A22',
    muted: 'rgba(46,42,34,0.58)',
    accent: '#AA7A32',
    accentSoft: 'rgba(170,122,50,0.12)',
    card: 'rgba(255,255,255,0.62)',
    cardStroke: 'rgba(170,122,50,0.24)',
    seal: '#B9483E',
    motif: drawSealMotif,
  },
};

function composePoster(ctx, options) {
  const { text = '', holiday = '', holidayEmoji = '✨', styleId = 'warm' } = options;
  const theme = resolveTheme(holiday);
  const layout = buildPosterLayout(text, holiday, styleId);

  drawBackground(ctx, theme);
  theme.motif(ctx, theme);
  drawFrame(ctx, theme);
  drawHeader(ctx, holiday || '心意祝福', holidayEmoji, theme, layout, styleId);
  drawBlessingText(ctx, layout, holidayEmoji, theme, styleId);
  drawFooter(ctx, holidayEmoji, theme);
}

function resolveTheme(holiday) {
  const key = Object.keys(THEMES).find(name => THEMES[name].aliases.includes(holiday));
  return THEMES[key] || THEMES.general;
}

function buildPosterLayout(text, holiday, styleId) {
  const title = buildPosterTitle(holiday, styleId);
  return {
    title,
    titleLines: splitTitle(title),
    contentLines: buildContentLines(text, holiday),
    footnote: buildFootnote(holiday, styleId),
  };
}

function buildContentLines(text, holiday) {
  const explicitLines = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(normalizeContentLine)
    .filter(Boolean);
  if (explicitLines.length > 0) return explicitLines;

  const sentenceLines = splitSentences(text).map(normalizeContentLine).filter(Boolean);
  if (sentenceLines.length > 0) return sentenceLines;
  return [`${holiday || '这份'}祝福`, '愿你日日顺遂', '心里常有暖意'];
}

function normalizeContentLine(line) {
  return String(line || '')
    .replace(/^\s*(?:\d+[\.\、\)]|[-*])\s*/, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const parts = String(text || '').match(/[^。！？!?；;]+[。！？!?；;]?/g) || [];
  return parts.map(s => s.trim()).filter(Boolean);
}

function buildPosterTitle(holiday, styleId) {
  const titleMap = {
    父亲节: '父爱如山\n岁月有光',
    端午节: '粽香入夏\n安康常在',
    七夕: '星河有约\n爱意成诗',
    情人节: '星河有约\n爱意成诗',
    中秋节: '月满人圆\n心意同归',
    教师节: '一朝沐教\n一生念恩',
    春节: '新岁启封\n万事生光',
    新年: '新岁启封\n万事生光',
    生日: '岁岁欢喜\n日日生光',
    感谢: '承蒙相遇\n感恩在心',
  };
  const fallback = {
    formal: '敬意入笺\n祝福成章',
    humor: '把好运打包\n把快乐送达',
    literary: '清风入怀\n心意成诗',
    classic: '良辰有信\n吉语相赠',
    minimal: '一句心意\n认真送达',
    warm: '心意有光\n祝福抵达',
  };
  return titleMap[holiday] || fallback[styleId] || fallback.warm;
}

function splitTitle(title) {
  if (title.includes('\n')) return title.split('\n').filter(Boolean).slice(0, 2);
  if (title.length <= 8) return [title];
  return [title.slice(0, 6), title.slice(6, 12)];
}

function buildFootnote(holiday, styleId) {
  const styleNotes = {
    warm: '把平日里没说出口的话，认真写成祝福',
    formal: '愿敬意与祝福，都被妥帖送达',
    humor: '把快乐打包，也把心意送到',
    literary: '愿清风有信，心意成诗',
    classic: '良辰有信，吉语相赠',
    minimal: '一句心意，认真送达',
  };
  const holidayNotes = {
    父亲节: '愿岁月从容，也愿您多些轻松',
    端午节: '愿安康常伴，顺遂入夏',
    七夕: '愿爱意有回声，日日皆相伴',
    情人节: '愿爱意有回声，日日皆相伴',
    中秋节: '愿月圆人安，心意同归',
    教师节: '愿桃李有光，师恩长念',
    春节: '愿新岁有光，万事顺遂',
    新年: '愿新岁有光，万事顺遂',
    生日: '愿新一岁，日日生光',
    感谢: '愿这份感谢，被郑重收到',
  };
  return holidayNotes[holiday] || styleNotes[styleId] || styleNotes.warm;
}

function drawBackground(ctx, theme) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, theme.bg[0]);
  grad.addColorStop(1, theme.bg[1]);
  setFill(ctx, grad);
  ctx.fillRect(0, 0, W, H);

  setFill(ctx, theme.accentSoft);
  ctx.beginPath();
  ctx.arc(W + 42, 105, 172, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-22, H - 42, 150, 0, Math.PI * 2);
  ctx.fill();
}

function drawFrame(ctx, theme) {
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 2;
  roundRect(ctx, 44, 44, W - 88, H - 88, 28, false, true);
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 1;
  roundRect(ctx, 66, 66, W - 132, H - 132, 22, false, true);
}

function drawHeader(ctx, holiday, emoji, theme, layout, styleId) {
  setAlign(ctx, 'center');
  setFont(ctx, 22, '600');
  setFill(ctx, theme.muted);
  ctx.fillText('心 祝 · 专 属 祝 福 海 报', W / 2, 110);

  drawPill(ctx, W / 2 - 74, 138, 148, 44, holiday, theme);

  const titleLines = layout.titleLines;
  const titleSize = titleLines.length > 1 ? 48 : 54;
  const titleStartY = titleLines.length > 1 ? 252 : 270;
  const titleGrad = ctx.createLinearGradient(160, 190, 590, 318);
  titleGrad.addColorStop(0, theme.accent);
  titleGrad.addColorStop(0.55, theme.text);
  titleGrad.addColorStop(1, theme.accent);
  setShadow(ctx, 'rgba(0,0,0,0.26)', 0, 8, 18);
  setFont(ctx, titleSize, styleId === 'formal' ? '700' : '800');
  setFill(ctx, titleGrad);
  titleLines.forEach((line, index) => {
    ctx.fillText(line, W / 2, titleStartY + index * 62);
  });
  clearShadow(ctx);

  setFill(ctx, theme.accent);
  ctx.fillRect(W / 2 - 86, titleStartY + titleLines.length * 62 - 24, 172, 3);
  setFill(ctx, theme.accent);
  ctx.fillRect(W / 2 - 28, titleStartY + titleLines.length * 62 - 12, 56, 3);

  drawCornerMark(ctx, W / 2 + 168, titleStartY - 30, theme);
}

function drawBlessingText(ctx, layout, emoji, theme, styleId) {
  const cardX = 82;
  const cardY = 385;
  const cardW = W - 164;
  const cardH = 660;

  setShadow(ctx, 'rgba(0,0,0,0.18)', 0, 10, 24);
  setFill(ctx, theme.card);
  roundRect(ctx, cardX, cardY, cardW, cardH, 28, true, false);
  clearShadow(ctx);
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28, false, true);

  drawVerseBlock(ctx, layout, emoji, theme, cardX + 44, cardY + 54, cardW - 88, styleId);

  setAlign(ctx, 'center');
  setFont(ctx, 24, '400');
  setFill(ctx, theme.muted);
  ctx.fillText(layout.footnote, cardX + cardW / 2, cardY + cardH - 58);
  setFill(ctx, theme.cardStroke);
  ctx.fillRect(cardX + cardW / 2 - 42, cardY + cardH - 30, 84, 2);
}

function drawVerseBlock(ctx, layout, emoji, theme, x, y, w, styleId) {
  setAlign(ctx, 'center');
  setFill(ctx, theme.cardStroke);
  const dividerY = y + 12;
  ctx.fillRect(x + w / 2 - 70, dividerY, 140, 2);
  ctx.fillRect(x + w / 2 - 20, dividerY + 10, 40, 2);

  const fitted = fitPosterLines(ctx, layout.contentLines, w, 410);
  const blockHeight = (fitted.lines.length - 1) * fitted.lineHeight;
  const startY = y + 90 + Math.max(0, (410 - blockHeight) / 2) - 20;

  setShadow(ctx, getBodyShadow(theme), 0, 2, 4);
  fitted.lines.forEach((line, index) => {
    setFont(ctx, fitted.fontSize, '800');
    setFill(ctx, theme.text);
    ctx.fillText(line, x + w / 2, startY + index * fitted.lineHeight);
  });
  clearShadow(ctx);

  drawCenterOrnament(ctx, x + w / 2, startY + fitted.lines.length * fitted.lineHeight + 4, theme);
}

function fitPosterLines(ctx, sourceLines, maxWidth, maxHeight) {
  const candidates = [34, 32, 30, 28, 26, 24, 22];
  for (let i = 0; i < candidates.length; i++) {
    const fontSize = candidates[i];
    const lineHeight = Math.round(fontSize * 1.55);
    setFont(ctx, fontSize, '800');
    const lines = wrapContentLines(ctx, sourceLines, maxWidth);
    if ((lines.length - 1) * lineHeight <= maxHeight) {
      return { lines, fontSize, lineHeight };
    }
  }

  const fontSize = 22;
  setFont(ctx, fontSize, '800');
  const lines = wrapContentLines(ctx, sourceLines, maxWidth);
  const lineHeight = Math.max(30, Math.floor(maxHeight / Math.max(lines.length - 1, 1)));
  return { lines, fontSize, lineHeight };
}

function wrapContentLines(ctx, sourceLines, maxWidth) {
  const lines = [];
  sourceLines.forEach(line => {
    splitText(ctx, line, maxWidth).forEach(part => {
      if (part) lines.push(part);
    });
  });
  return lines.length ? lines : ['心意认真送达'];
}

function getBodyShadow(theme) {
  return isLightHexColor(theme.text)
    ? 'rgba(0,0,0,0.38)'
    : 'rgba(255,255,255,0.68)';
}

function isLightHexColor(color) {
  const value = String(color || '').replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return false;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

function drawPill(ctx, x, y, w, h, text, theme) {
  setFill(ctx, theme.accentSoft);
  roundRect(ctx, x, y, w, h, h / 2, true, false);
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, h / 2, false, true);
  setAlign(ctx, 'center');
  setFont(ctx, 22, '600');
  setFill(ctx, theme.accent);
  ctx.fillText(text, x + w / 2, y + 29);
}

function drawFooter(ctx, emoji, theme) {
  setAlign(ctx, 'center');
  setFont(ctx, 22, '400');
  setFill(ctx, theme.muted);
  ctx.fillText('AI生成 · 心祝-祝福语', W / 2, H - 102);
  setFont(ctx, 20, '400');
  ctx.fillText('把说不出口的心意，认真送达', W / 2, H - 68);
}

function drawCenterOrnament(ctx, x, y, theme) {
  setFill(ctx, theme.accent);
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  setFill(ctx, theme.cardStroke);
  ctx.beginPath();
  ctx.arc(x - 24, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 24, y, 3, 0, Math.PI * 2);
  ctx.fill();
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 58, y);
  ctx.lineTo(x - 34, y);
  ctx.moveTo(x + 34, y);
  ctx.lineTo(x + 58, y);
  ctx.stroke();
}

function drawCornerMark(ctx, x, y, theme) {
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 34, y);
  ctx.lineTo(x + 34, y + 34);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 46);
  ctx.lineTo(x + 46, y + 46);
  ctx.stroke();
}

function drawMountainMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(98, 1160);
  ctx.lineTo(240, 1010);
  ctx.lineTo(350, 1135);
  ctx.lineTo(475, 980);
  ctx.lineTo(646, 1160);
  ctx.stroke();
}

function drawLeafMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    const x = 94 + i * 155;
    ctx.beginPath();
    ctx.moveTo(x, 1080);
    ctx.quadraticCurveTo(x + 55, 960, x + 125, 900);
    ctx.quadraticCurveTo(x + 100, 1030, x, 1080);
    ctx.stroke();
  }
}

function drawPairedStarMotif(ctx, theme) {
  drawStars(ctx, theme, 18);
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 1060);
  ctx.quadraticCurveTo(375, 900, 600, 1060);
  ctx.stroke();
}

function drawMoonMotif(ctx, theme) {
  setFill(ctx, theme.accentSoft);
  ctx.beginPath();
  ctx.arc(600, 205, 82, 0, Math.PI * 2);
  ctx.fill();
  drawOsmanthus(ctx, theme, 95, 1040);
  drawOsmanthus(ctx, theme, 610, 930);
}

function drawBookMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 3;
  roundRect(ctx, 115, 930, 250, 150, 12, false, true);
  roundRect(ctx, 385, 930, 250, 150, 12, false, true);
  ctx.beginPath();
  ctx.moveTo(375, 930);
  ctx.lineTo(375, 1080);
  ctx.stroke();
}

function drawLanternMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 4;
  [130, 610].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, 80);
    ctx.lineTo(x, 160);
    ctx.stroke();
    roundRect(ctx, x - 38, 160, 76, 100, 28, false, true);
  });
}

function drawCandleMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 4;
  [170, 375, 580].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, 940);
    ctx.lineTo(x, 1080);
    ctx.stroke();
    setFill(ctx, theme.accentSoft);
    ctx.beginPath();
    ctx.arc(x, 915, 18, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSealMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 4;
  roundRect(ctx, 560, 905, 110, 110, 18, false, true);
  drawStars(ctx, theme, 8);
}

function drawStars(ctx, theme, count) {
  setFill(ctx, theme.accentSoft);
  for (let i = 0; i < count; i++) {
    const x = 85 + (i * 137) % 590;
    const y = 280 + (i * 211) % 820;
    ctx.beginPath();
    ctx.arc(x, y, 4 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOsmanthus(ctx, theme, x, y) {
  setFill(ctx, theme.accentSoft);
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + i * 14, y + (i % 2) * 12, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function splitText(ctx, text, maxWidth) {
  const lines = [];
  let current = '';
  const chars = Array.from(String(text || ''));
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === '\n') {
      if (current) lines.push(current);
      current = '';
      continue;
    }
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function setFill(ctx, value) {
  if (ctx.setFillStyle) ctx.setFillStyle(value);
  else ctx.fillStyle = value;
}

function setStroke(ctx, value) {
  if (ctx.setStrokeStyle) ctx.setStrokeStyle(value);
  else ctx.strokeStyle = value;
}

function setAlign(ctx, value) {
  if (ctx.setTextAlign) ctx.setTextAlign(value);
  else ctx.textAlign = value;
}

function setFont(ctx, size, weight) {
  if (ctx.setFontSize) ctx.setFontSize(size);
  ctx.font = `${weight || '400'} ${size}px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`;
}

function setShadow(ctx, color, offsetX, offsetY, blur) {
  ctx.shadowColor = color;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowBlur = blur;
}

function clearShadow(ctx) {
  setShadow(ctx, 'transparent', 0, 0, 0);
}

module.exports = { composePoster };
