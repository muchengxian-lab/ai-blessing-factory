const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { blessingId } = event;
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  try {
    const { data } = await db.collection('blessings').doc(blessingId).get();
    if (!data || data.userId !== userId) {
      return { code: 'FORBIDDEN', message: '无权访问' };
    }
    return { code: 'OK', ...data };
  } catch (err) {
    return { code: 'NOT_FOUND', message: '记录不存在' };
  }
};
