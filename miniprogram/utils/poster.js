// 海报规格：750×1334 (3:4比例，朋友圈标准，轻量)
const W = 750;
const H = 1334;

function composePoster(ctx, options) {
  const { text, holidayEmoji, holiday, styleId } = options;

  // === 1. 星云夜幕渐变背景 ===
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1A1025');
  grad.addColorStop(0.35, '#1E1A32');
  grad.addColorStop(0.65, '#1F1B3A');
  grad.addColorStop(1, '#162447');
  ctx.setFillStyle(grad);
  ctx.fillRect(0, 0, W, H);

  // === 2. 装饰光斑 ===
  ctx.setFillStyle('rgba(240,192,96,0.06)');
  ctx.beginPath();
  ctx.arc(600, 150, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.setFillStyle('rgba(255,123,123,0.04)');
  ctx.beginPath();
  ctx.arc(120, 1100, 180, 0, Math.PI * 2);
  ctx.fill();

  // === 3. 星光点 ===
  drawStars(ctx);

  // === 4. 顶部品牌区 ===
  ctx.setTextAlign('center');
  ctx.setFillStyle('rgba(240,192,96,0.8)');
  ctx.setFontSize(22);
  ctx.fillText('心 祝', W / 2, 80);

  ctx.setFillStyle('rgba(237,228,216,0.5)');
  ctx.setFontSize(18);
  ctx.fillText('—— 用心祝福 ——', W / 2, 110);

  // === 5. 节日标题 ===
  if (holiday) {
    ctx.setFillStyle('#F0C060');
    ctx.setFontSize(36);
    ctx.setFontWeight('bold');
    ctx.fillText(`${holidayEmoji || ''} ${holiday}`, W / 2, 175);
  }

  // === 6. 装饰分割线 ===
  const lineGrad = ctx.createLinearGradient(W / 2 - 100, 0, W / 2 + 100, 0);
  lineGrad.addColorStop(0, 'rgba(240,192,96,0)');
  lineGrad.addColorStop(0.5, 'rgba(240,192,96,0.5)');
  lineGrad.addColorStop(1, 'rgba(240,192,96,0)');
  ctx.setFillStyle(lineGrad);
  ctx.fillRect(W / 2 - 100, 200, 200, 2);

  // === 7. 祝福文案卡片 ===
  const cardX = 50;
  const cardY = 240;
  const cardW = W - 100;
  const cardH = H - 400;

  // 半透明玻璃卡片背景
  ctx.setFillStyle('rgba(255,255,255,0.07)');
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, false);

  // 卡片边框
  ctx.setStrokeStyle('rgba(240,192,96,0.2)');
  ctx.setLineWidth(2);
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, false, true);

  // === 8. 文案正文 ===
  ctx.setFillStyle('#EDE4D8');
  ctx.setTextAlign('left');
  const fontSize = text.length > 150 ? 28 : 32;
  ctx.setFontSize(fontSize);
  ctx.setFontWeight('normal');

  const maxWidth = cardW - 80;
  const lineHeight = fontSize * 1.8;
  const lines = splitText(ctx, text, maxWidth);
  const maxLines = 12; // increased from 6 to avoid truncation
  const displayLines = lines.slice(0, maxLines);

  const startY = cardY + 60;
  displayLines.forEach((line, i) => {
    ctx.fillText(line, cardX + 40, startY + i * lineHeight);
  });

  // 如果被截断，加省略号
  if (lines.length > maxLines) {
    ctx.setFillStyle('rgba(237,228,216,0.4)');
    ctx.setFontSize(24);
    ctx.fillText('...', cardX + 40, startY + maxLines * lineHeight + 30);
  }

  // === 9. 底部水印 ===
  ctx.setTextAlign('center');
  ctx.setFillStyle('rgba(155,147,136,0.5)');
  ctx.setFontSize(20);
  ctx.fillText('AI生成 · 心祝', W / 2, H - 50);

  // === 10. 底部引导 ===
  ctx.setFillStyle('rgba(237,228,216,0.35)');
  ctx.setFontSize(18);
  ctx.fillText('长按扫码 → 制作你的专属祝福', W / 2, H - 24);
}

// === 辅助函数 ===

function splitText(ctx, text, maxWidth) {
  const lines = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\n') {
      lines.push(current);
      current = '';
      continue;
    }
    const test = current + ch;
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && current.length > 0) {
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

function drawStars(ctx) {
  const stars = [
    [100, 200], [650, 350], [200, 800], [580, 950],
    [80, 1200], [700, 120], [350, 60], [500, 600],
    [150, 500], [620, 700], [300, 1100],
  ];
  ctx.setFillStyle('rgba(240,192,96,0.3)');
  stars.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

module.exports = { composePoster };
