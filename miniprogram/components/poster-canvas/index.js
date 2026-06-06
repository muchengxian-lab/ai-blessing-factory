const { composePoster } = require('../../utils/poster.js');

const DISPLAY_W = 340;
const POSTER_W = 750;
const POSTER_H = 1334;
const DISPLAY_H = Math.round(DISPLAY_W * POSTER_H / POSTER_W);

Component({
  properties: {
    text: { type: String, value: '' },
    emoji: { type: String, value: '✨' },
    holiday: { type: String, value: '' },
    styleId: { type: String, value: 'warm' },
  },
  data: {
    canvasWidth: DISPLAY_W,
    canvasHeight: DISPLAY_H,
    ready: false,
  },
  observers: {
    'text, emoji, holiday, styleId'() {
      if (this.data.ready) this.draw();
    },
  },
  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          if (res[0]) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio || 2;

            canvas.width = POSTER_W * dpr;
            canvas.height = POSTER_H * dpr;
            ctx.scale(dpr, dpr);

            this.canvas = canvas;
            this.ctx = ctx;
            this.setData({ ready: true });
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
        holiday: this.data.holiday,
        styleId: this.data.styleId,
      });
    },
    onSave() {
      if (!this.canvas) {
        wx.showToast({ title: '海报未就绪', icon: 'none' });
        return;
      }
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              this.triggerEvent('save', { path: res.tempFilePath });
            },
            fail: () => {
              wx.showToast({ title: '请授权相册权限', icon: 'none' });
            },
          });
        },
        fail: () => {
          wx.showToast({ title: '保存失败', icon: 'none' });
        },
      });
    },
  },
});
