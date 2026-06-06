const HOLIDAYS = [
  { id: 'fathers_day', name: '父亲节', emoji: '🎁', icon: '/images/icons/holiday-fathers-day.svg', date: '2026-06-21', desc: '6月第三个周日，感恩父亲' },
  { id: 'dragon_boat', name: '端午节', emoji: '🎋', icon: '/images/icons/holiday-dragon-boat.svg', date: '2026-06-25', desc: '农历五月初五，纪念屈原' },
  { id: 'qixi', name: '七夕', emoji: '💕', icon: '/images/icons/holiday-qixi.svg', date: '2026-08-29', desc: '农历七月初七，中国情人节' },
  { id: 'teachers_day', name: '教师节', emoji: '🍎', icon: '/images/icons/holiday-teachers-day.svg', date: '2026-09-10', desc: '9月10日，感谢老师' },
  { id: 'mid_autumn', name: '中秋节', emoji: '🌕', icon: '/images/icons/holiday-mid-autumn.svg', date: '2026-09-25', desc: '农历八月十五，团圆赏月' },
  { id: 'national_day', name: '国庆节', emoji: '🇨🇳', icon: '/images/icons/holiday-national-day.svg', date: '2026-10-01', desc: '10月1日，祖国生日快乐' },
  { id: 'spring_festival', name: '春节', emoji: '🧧', icon: '/images/icons/holiday-spring-festival.svg', date: '2027-02-06', desc: '农历正月初一，辞旧迎新' },
  { id: 'mothers_day', name: '母亲节', emoji: '🌸', icon: '/images/icons/holiday-mothers-day.svg', date: '2027-05-09', desc: '5月第二个周日，感恩母亲' },
  { id: 'birthday', name: '生日', emoji: '🎂', icon: '/images/icons/holiday-birthday.svg', date: null, desc: '一年中最特别的一天' },
  { id: 'thanksgiving', name: '感谢', emoji: '🙏', icon: '/images/icons/holiday-thanks.svg', date: null, desc: '不限于节日，想说声谢谢' },
  { id: 'new_year', name: '新年', emoji: '🎉', icon: '/images/icons/holiday-new-year.svg', date: '2027-01-01', desc: '1月1日，新年快乐' },
  { id: 'general', name: '通用祝福', emoji: '✨', icon: '/images/icons/holiday-general.svg', date: null, desc: '任何你想表达心意的时刻' },
];

function getUpcoming() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let nearest = null;
  let nearestDiff = Infinity;
  HOLIDAYS.forEach(h => {
    if (!h.date) return;
    const d = new Date(h.date);
    const diff = d - today;
    if (diff >= 0 && diff < nearestDiff) {
      nearestDiff = diff;
      nearest = { ...h, daysLeft: Math.ceil(diff / 86400000) };
    }
  });
  return nearest || { name: '通用祝福', emoji: '✨', icon: '/images/icons/holiday-general.svg', daysLeft: 0 };
}

function getSorted() {
  const upcoming = getUpcoming();
  const others = HOLIDAYS.filter(h => h.id !== (upcoming.id || '')).filter(h => h.date !== null);
  return [upcoming, ...others];
}

function countdownDays(holidayId) {
  const h = HOLIDAYS.find(x => x.id === holidayId);
  if (!h || !h.date) return 0;
  const diff = new Date(h.date) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function getHolidayIconByName(name) {
  const holiday = HOLIDAYS.find(h => h.name === name);
  return holiday ? holiday.icon : '/images/icons/holiday-general.svg';
}

module.exports = { HOLIDAYS, getUpcoming, getSorted, countdownDays, getHolidayIconByName };
