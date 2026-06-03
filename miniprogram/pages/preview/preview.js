const { TOAST_COPIED, TOAST_SAVED } = require('../../utils/copywriting.js');
const { callGenerate, callGetBlessing } = require('../../utils/api.js');

Page({
  data: {
    blessingId: '', holiday: '', holidayEmoji: '✨',
    target: '', styleId: 'warm', blessings: [],
    currentIndex: 0, currentText: '', loading: true, regenerating: false,
    savedPosterPath: '',
  },

  onLoad(options) {
    this.setData({ blessingId: options.blessingId, loading: true });
    this.loadBlessing(options.blessingId);
  },

  loadBlessing(blessingId) {
    callGetBlessing(blessingId)
      .then(res => {
        const data = res.result;
        if (data && data.code === 'OK') {
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
          wx.showToast({ title: '祝福不存在或无权访问', icon: 'none' });
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
    callGenerate(this.data.holiday, this.data.target, this.data.styleId)
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
    const poster = this.selectComponent('#posterCanvas');
    if (poster) {
      poster.onSave();
    } else {
      wx.showToast({ title: '海报组件未就绪', icon: 'none' });
    }
  },

  onPosterSaved() {
    wx.showToast({ title: TOAST_SAVED, icon: 'none' });
  },

  onShareAppMessage() {
    const { holiday, currentText } = this.data;
    return {
      title: `我用「心祝」生成了${holiday}祝福，分享给你 ✨`,
      path: '/pages/index/index',
      imageUrl: this.data.savedPosterPath || '',
    };
  },
});
