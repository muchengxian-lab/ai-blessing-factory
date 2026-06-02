Page({
  data: { list: [], loading: true },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    const db = wx.cloud.database();
    db.collection('blessings')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
      .then(res => {
        const list = (res.data || []).map(item => ({
          ...item,
          preview: Array.isArray(item.content)
            ? item.content[0].slice(0, 50) + '...'
            : (item.content || '').slice(0, 50) + '...',
          timeText: this.formatTime(item.createdAt),
        }));
        this.setData({ list, loading: false });
      })
      .catch(() => {
        this.setData({ loading: false });
      });
  },

  formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return '今天';
    if (diff < 172800000) return '昨天';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  onTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/preview/preview?blessingId=${id}` });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },
});
