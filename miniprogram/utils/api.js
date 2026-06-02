const CONFIG = require('./config.js');

function callGenerate(holiday, target, style) {
  return wx.cloud.callFunction({
    name: 'generateBlessing',
    data: { holiday, target, style },
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

function generateWithAI(holiday, target, style) {
  return new Promise((resolve, reject) => {
    const model = wx.cloud.extend.AI.createModel('hunyuan-turbo');
    const { buildSystemPrompt } = require('./prompt.js');
    const systemPrompt = buildSystemPrompt(holiday, target, style);

    model.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请为"${holiday}"节日生成一条真诚的祝福文案，发给"${target}"，风格"${style}"。` }
      ],
      temperature: CONFIG.TEMPERATURE_BASE,
      maxTokens: 600,
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  callGenerate, callListHistory, callTrackShare,
  generateWithAI,
};
