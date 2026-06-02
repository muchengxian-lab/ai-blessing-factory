const { composePoster } = require('../../utils/poster.js');
const CONFIG = require('../../utils/config.js');

Component({
  properties: {
    text: { type: String, value: '' },
    emoji: { type: String, value: '✨' },
    styleId: { type: String, value: 'warm' },
  },
  data: {
    canvasWidth: 340,
    canvasHeight: 600,
  },
  observers: {
    'text, emoji, styleId'() {
      this.draw();
    },
  },
  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#posterCanvas').fields({ node: true, size: true }).exec(res => {
        if (res[0]) {
          this.canvas = res[0].node;
          this.ctx = this.canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;
          this.canvas.width = CONFIG.POSTER_WIDTH;
          this.canvas.height = CONFIG.POSTER_HEIGHT;
          this.setData({
            canvasWidth: 340,
            canvasHeight: Math.round(340 * CONFIG.POSTER_HEIGHT / CONFIG.POSTER_WIDTH),
          });
          this.ctx.scale(CONFIG.POSTER_WIDTH / 340, CONFIG.POSTER_HEIGHT / 340 / dpr * dpr);
          this.draw();
        }
      });
    },
  },
  methods: {
    draw() {
      if (!this.ctx || !this.data.text) return;
      composePoster(this.ctx, {
        text: this.data.text,
        holidayEmoji: this.data.emoji,
        styleId: this.data.styleId,
      });
    },
    onSave() {
      if (!this.canvas) return;
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => this.triggerEvent('save'),
          });
        },
      });
    },
  },
});
