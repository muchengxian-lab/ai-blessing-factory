const AI = require('./utils/api.js');

App({
  onLaunch() {
    wx.cloud.init({ env: 'cloud1-7g7h5h7h5h7h5h7' });
    this.loadPrefs();
  },

  loadPrefs() {
    const remind = wx.getStorageSync('remindEnabled');
    if (remind !== '') {
      this.globalData.remindEnabled = remind;
    }
  },

  globalData: {
    remindEnabled: true,
    userInfo: null
  }
});
