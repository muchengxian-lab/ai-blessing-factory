const { getUpcoming, getSorted } = require('../../utils/holidays.js');
const { TARGETS, STYLES } = require('../../utils/theme.js');
const { randomLoading } = require('../../utils/copywriting.js');
const { callGenerate } = require('../../utils/api.js');

Page({
  data: {
    holidays: [],
    targets: TARGETS,
    styles: Object.entries(STYLES).map(([id, s]) => ({ id, ...s })),
    selectedHoliday: '',
    selectedTarget: '',
    selectedStyle: '',
    upcomingHoliday: null,
    activeTheme: 'warm',
    canGenerate: false,
    generating: false,
    loadingText: '',
  },

  onLoad() {
    const upcoming = getUpcoming();
    this.setData({
      holidays: getSorted(),
      upcomingHoliday: upcoming,
      selectedHoliday: upcoming.id || 'fathers_day',
      selectedTarget: 'elder',
      selectedStyle: 'warm',
      activeTheme: 'warm',
      canGenerate: true,
    });
  },

  onHolidaySelect(e) {
    this.setData({ selectedHoliday: e.detail.id });
  },
  onTargetSelect(e) {
    this.setData({ selectedTarget: e.detail.id });
  },
  onStyleSelect(e) {
    const styleId = e.detail.id;
    const { applyTheme } = require('../../utils/theme.js');
    this.setData({
      selectedStyle: styleId,
      activeTheme: applyTheme(styleId).replace('theme-', ''),
    });
  },

  onGenerate() {
    if (!this.data.canGenerate || this.data.generating) return;
    this.setData({ generating: true, loadingText: randomLoading() });

    const { selectedHoliday, selectedTarget, selectedStyle } = this.data;
    const holiday = this.data.holidays.find(h => h.id === selectedHoliday);

    callGenerate(holiday.name, selectedTarget, selectedStyle)
      .then(res => {
        this.setData({ generating: false });
        const data = res.result;
        if (data && data.code === 'OK') {
          wx.navigateTo({
            url: `/pages/preview/preview?blessingId=${data.blessingId}`,
          });
        } else {
          wx.showToast({ title: '生成失败，请重试', icon: 'none' });
        }
      })
      .catch(err => {
        this.setData({ generating: false });
        console.error('Generate error:', err);
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      });
  },

  onShareAppMessage() {
    return {
      title: '心祝 — 30秒生成专属节日祝福 ✨',
      path: '/pages/index/index',
    };
  },
});
