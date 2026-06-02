const LOADING_TEXTS = [
  '正在为你精心准备祝福...',
  'AI正在妙笔生花 ✍️',
  '好的祝福需要一点时间酝酿...',
  '正在注入真诚值 99%...',
];

const TOAST_COPIED = '已复制，去粘贴吧 ✨';
const TOAST_SAVED = '已保存到相册 📸';
const TOAST_TOO_OFTEN = '太快了，请稍后再试~';
const TOAST_NO_FREE = '今日免费次数已用完，明天再来吧 🌅';

const EMPTY_BLESSING = '还没有生成过祝福 ✨\n去首页试试？';
const EMPTY_GUIDE = '选个节日，给重要的人送一份祝福 ✨';

function randomLoading() {
  return LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)];
}

module.exports = {
  LOADING_TEXTS,
  TOAST_COPIED,
  TOAST_SAVED,
  TOAST_TOO_OFTEN,
  TOAST_NO_FREE,
  EMPTY_BLESSING,
  EMPTY_GUIDE,
  randomLoading,
};
