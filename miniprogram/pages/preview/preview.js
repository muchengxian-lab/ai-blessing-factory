const { TOAST_COPIED, TOAST_SAVED } = require('../../utils/copywriting.js');
const { callGenerate } = require('../../utils/api.js');

Page({
  data: {
    blessingId: '',
    holiday: '',
    holidayEmoji: '✨',
    target: '',
    styleId: 'warm',
    blessings: [],
    currentIndex: 0,
    currentText: '',
    loading: true,
    regenerating: false,
  },

  onLoad(options) {
    const { blessingId } = options;
    this.setData({ blessingId, loading: true });
    this.loadBlessing(blessingId);
  },

  loadBlessing(blessingId) {
    const db = wx.cloud.database();
    db.collection('blessings').doc(blessingId).get()
      .then(res => {
        const data = res.data;
        if (data) {
          this.setData({
            blessings: data.content || [data.content],
            holiday: data.holiday || '',
            holidayEmoji: data.holidayEmoji || '✨',
            target: data.target || '',
            styleId: data.style || 'warm',
            currentIndex: 0,
            currentText: Array.isArray(data.content) ? data.content[0] : data.content,
            loading: false,
          });
        } else {
          this.setData({ loading: false });
          wx.showToast({ title: '祝福不存在', icon: 'none' });
        }
      })
      .catch(() => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  onPrev() {
    const { currentIndex, blessings } = this.data;
    if (currentIndex <= 0) return;
    const idx = currentIndex - 1;
    this.setData({ currentIndex: idx, currentText: blessings[idx] });
  },
  onNext() {
    const { currentIndex, blessings } = this.data;
    if (currentIndex >= blessings.length - 1) return;
    const idx = currentIndex + 1;
    this.setData({ currentIndex: idx, currentText: blessings[idx] });
  },

  onCopy() {
    wx.setClipboardData({
      data: this.data.currentText,
      success: () => wx.showToast({ title: TOAST_COPIED, icon: 'none' }),
    });
  },

  onRegenerate() {
    this.setData({ regenerating: true });
    const { holiday, target, styleId } = this.data;
    callGenerate(holiday, target, styleId)
      .then(res => {
        this.setData({ regenerating: false });
        if (res.result && res.result.code === 'OK') {
          this.loadBlessing(res.result.blessingId);
        }
      })
      .catch(() => {
        this.setData({ regenerating: false });
        wx.showToast({ title: '重试失败', icon: 'none' });
      });
  },

  onSavePoster() {
    wx.showToast({ title: TOAST_SAVED, icon: 'none' });
  },

  onSharePoster() {
    wx.showShareMenu({ withShareTicket: true });
  },

  onShareAppMessage() {
    const { holiday, currentText } = this.data;
    return {
      title: `我用AI生成了${holiday}祝福，分享给你 ✨`,
      path: `/pages/index/index`,
      imageUrl: '',
    };
  },
});
