const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { blessingId, channel } = event;
  const wxContext = cloud.getWXContext();

  try {
    await db.collection('share_events').add({
      data: {
        userId: wxContext.OPENID,
        blessingId: blessingId || '',
        channel: channel || 'unknown',
        createdAt: Date.now(),
      },
    });
    return { code: 'OK' };
  } catch (err) {
    return { code: 'ERROR' };
  }
};
