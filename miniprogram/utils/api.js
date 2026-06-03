const CONFIG = require('./config.js');

function callGenerate(holiday, target, style) {
  return wx.cloud.callFunction({
    name: 'generateBlessing',
    data: { holiday, target, style },
  });
}

function callGetBlessing(blessingId) {
  return wx.cloud.callFunction({
    name: 'getBlessing',
    data: { blessingId },
  });
}

function callListHistory(page = 1, pageSize = 20) {
  return wx.cloud.callFunction({
    name: 'listHistory',
    data: { page, pageSize },
  });
}

function callTrackShare(blessingId, channel) {
  return wx.cloud.callFunction({
    name: 'trackShare',
    data: { blessingId, channel },
  });
}

module.exports = {
  callGenerate, callGetBlessing, callListHistory, callTrackShare,
};
