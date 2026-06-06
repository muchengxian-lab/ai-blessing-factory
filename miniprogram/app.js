const AI = require('./utils/api.js');

App({
  onLaunch() {
    wx.cloud.init({ env: 'xinzhu-d7gtsc4pz7a9fa09b' });
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
