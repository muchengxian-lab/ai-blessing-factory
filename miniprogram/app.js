App({
  onLaunch() {
    wx.cloud.init({
      env: 'xinzhu-d7gtsc4pz7a9fa09b',
      traceUser: true,
    });
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
