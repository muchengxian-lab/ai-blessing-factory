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
    text: '#263728',
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
  const { text = '', holiday = '' } = options;
  const theme = resolveTheme(holiday);

  drawBackground(ctx, theme);
  theme.motif(ctx, theme);
  drawFrame(ctx, theme);
  drawHeader(ctx, holiday || '心意祝福', theme);
  drawBlessingText(ctx, text, theme);
  drawFooter(ctx, theme);
}

function resolveTheme(holiday) {
  const key = Object.keys(THEMES).find(name => THEMES[name].aliases.includes(holiday));
  return THEMES[key] || THEMES.general;
}

function drawBackground(ctx, theme) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, theme.bg[0]);
  grad.addColorStop(1, theme.bg[1]);
  setFill(ctx, grad);
  ctx.fillRect(0, 0, W, H);

  setFill(ctx, theme.accentSoft);
  ctx.beginPath();
  ctx.arc(W - 80, 130, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(55, H - 120, 180, 0, Math.PI * 2);
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

function drawHeader(ctx, holiday, theme) {
  setAlign(ctx, 'center');
  setFont(ctx, 24, '600');
  setFill(ctx, theme.muted);
  ctx.fillText('心 祝', W / 2, 118);

  setFont(ctx, 46, '700');
  setFill(ctx, theme.accent);
  ctx.fillText(holiday, W / 2, 190);

  setFill(ctx, theme.accent);
  ctx.fillRect(W / 2 - 70, 225, 140, 3);

  drawSeal(ctx, W / 2 + 92, 176, theme);
}

function drawBlessingText(ctx, text, theme) {
  const cardX = 82;
  const cardY = 285;
  const cardW = W - 164;
  const cardH = 765;

  setFill(ctx, theme.card);
  roundRect(ctx, cardX, cardY, cardW, cardH, 28, true, false);
  setStroke(ctx, theme.cardStroke);
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28, false, true);

  setAlign(ctx, 'left');
  setFill(ctx, theme.text);
  const fontSize = text.length > 190 ? 28 : text.length > 130 ? 30 : 33;
  const lineHeight = Math.round(fontSize * 1.82);
  setFont(ctx, fontSize, '400');

  const lines = splitText(ctx, text, cardW - 92);
  const maxLines = Math.floor((cardH - 112) / lineHeight);
  const displayLines = lines.slice(0, maxLines);
  const startY = cardY + 78;

  displayLines.forEach((line, index) => {
    ctx.fillText(line, cardX + 46, startY + index * lineHeight);
  });

  if (lines.length > maxLines) {
    setFill(ctx, theme.muted);
    ctx.fillText('...', cardX + 46, startY + maxLines * lineHeight);
  }
}

function drawFooter(ctx, theme) {
  setAlign(ctx, 'center');
  setFont(ctx, 22, '400');
  setFill(ctx, theme.muted);
  ctx.fillText('AI生成 · 心祝祝福语', W / 2, H - 102);
  setFont(ctx, 20, '400');
  ctx.fillText('把说不出口的心意，认真送达', W / 2, H - 68);
}

function drawSeal(ctx, x, y, theme) {
  setFill(ctx, theme.seal);
  roundRect(ctx, x, y, 42, 42, 8, true, false);
  setAlign(ctx, 'center');
  setFill(ctx, 'rgba(255,245,230,0.9)');
  setFont(ctx, 20, '700');
  ctx.fillText('祝', x + 21, y + 28);
}

function drawMountainMotif(ctx, theme) {
  setStroke(ctx, theme.accentSoft);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(92, 1080);
  ctx.lineTo(230, 870);
  ctx.lineTo(340, 1010);
  ctx.lineTo(455, 820);
  ctx.lineTo(650, 1080);
  ctx.stroke();
  drawStars(ctx, theme, 10);
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
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
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

module.exports = { composePoster };
