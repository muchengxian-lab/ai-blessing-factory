Page({
  data: { remindEnabled: true },

  onLoad() {
    const remind = wx.getStorageSync('remindEnabled');
    if (remind !== '') {
      this.setData({ remindEnabled: remind });
    }
  },

  onToggleRemind() {
    const next = !this.data.remindEnabled;
    wx.setStorageSync('remindEnabled', next);
    this.setData({ remindEnabled: next });
    wx.showToast({
      title: next ? '已开启节日提醒' : '已关闭节日提醒',
      icon: 'none',
    });
  },

  onAbout() {
    wx.showModal({
      title: '关于AI祝福工厂',
      content: '一个帮你用AI生成专属节日祝福的小程序。\n\n技术栈：微信云开发 + 腾讯混元大模型\n\n祝福由心，AI只是工具。',
      showCancel: false,
      confirmText: '知道了',
    });
  },

  onFeedback() {
    wx.showModal({
      title: '反馈与建议',
      content: '请通过以下方式联系我们：\n\n暂不支持小程序内反馈，感谢理解。',
      showCancel: false,
      confirmText: '好的',
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI祝福工厂 — 30秒生成专属节日祝福 ✨',
      path: '/pages/index/index',
    };
  },
});
