const { callListHistory } = require('../../utils/api.js');
const { getHolidayIconByName } = require('../../utils/holidays.js');
const { TARGETS } = require('../../utils/theme.js');

const TARGET_NAME_MAP = TARGETS.reduce((map, item) => {
  map[item.id] = item.name;
  return map;
}, {});

Page({
  data: { list: [], loading: true },

  onShow() { this.loadHistory(); },

  loadHistory() {
    callListHistory(1, 50)
      .then(res => {
        const data = res.result;
        const list = (data.list || []).map(item => ({
          ...item,
          preview: Array.isArray(item.content)
            ? item.content[0].slice(0, 50) + '...'
            : (item.content || '').slice(0, 50) + '...',
          timeText: this.formatTime(item.createdAt),
          holidayIcon: getHolidayIconByName(item.holiday),
          targetName: TARGET_NAME_MAP[item.target] || item.target || '通用',
        }));
        this.setData({ list, loading: false });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
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

  goHome() { wx.switchTab({ url: '/pages/index/index' }); },
});
