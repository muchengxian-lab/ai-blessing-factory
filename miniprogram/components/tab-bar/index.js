Component({
  properties: { current: { type: Number, value: 0 } },
  methods: {
    onTap(e) {
      const idx = e.currentTarget.dataset.index;
      if (idx === this.data.current) return;
      const urls = ['/pages/index/index', '/pages/history/history', '/pages/mine/mine'];
      wx.switchTab({ url: urls[idx] });
    },
  },
});
