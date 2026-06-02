const CONFIG = require('./config.js');

function composePoster(ctx, options) {
  const { text, holidayEmoji, styleId, bgColor } = options;
  const W = CONFIG.POSTER_WIDTH;
  const H = CONFIG.POSTER_HEIGHT;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  const colors = {
    warm: ['#FFF1E8', '#FFE0D0'],
    formal: ['#F0F4FA', '#DCE6F5'],
    humor: ['#FFFBE6', '#FFF3C4'],
    literary: ['#F5F0FF', '#E8DCFF'],
    classic: ['#F0F8F0', '#D8ECD8'],
    minimal: ['#F8F8F8', '#EEEEEE'],
  };
  const [c1, c2] = colors[styleId] || colors.minimal;
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.setFillStyle(grad);
  ctx.fillRect(0, 0, W, H);

  // Emoji decoration
  ctx.setFontSize(200);
  ctx.setTextAlign('center');
  ctx.fillText(holidayEmoji || '✨', W / 2, 340);

  // Text area background
  ctx.setFillStyle('rgba(255,255,255,0.85)');
  ctx.fillRect(80, 520, W - 160, H - 1100);

  // Blessing text
  ctx.setFillStyle('#2D2D2D');
  ctx.setFontSize(52);
  ctx.setTextAlign('center');
  const lines = splitText(ctx, text, W - 240);
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 680 + i * 80);
  });

  // Watermark
  ctx.setFillStyle('rgba(150,150,150,0.5)');
  ctx.setFontSize(28);
  ctx.fillText('AI生成 · AI祝福工厂', W / 2, H - 80);
}

function splitText(ctx, text, maxWidth) {
  const lines = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const test = current + text[i];
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && current.length > 0) {
      lines.push(current);
      current = text[i];
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 6);
}

module.exports = { composePoster };
