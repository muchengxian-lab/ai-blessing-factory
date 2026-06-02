const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { page = 1, pageSize = 20 } = event;
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  try {
    const { data } = await db.collection('blessings')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    return { code: 'OK', list: data || [] };
  } catch (err) {
    console.error('listHistory error:', err);
    return { code: 'ERROR', list: [] };
  }
};
