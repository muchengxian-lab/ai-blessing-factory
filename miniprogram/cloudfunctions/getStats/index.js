const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  try {
    const { total: blessingCount } = await db.collection('blessings').count();
    const { total: shareCount } = await db.collection('share_events').count();
    return {
      code: 'OK',
      stats: { blessingCount, shareCount },
    };
  } catch (err) {
    return { code: 'ERROR', stats: {} };
  }
};
