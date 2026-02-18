export const dayList = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const hourList = [
  '0700',
  '0730',
  '0800',
  '0830',
  '0900',
  '0930',
  '1000',
  '1030',
  '1100',
  '1130',
  '1200',
  '1230',
  '1300',
  '1330',
  '1400',
  '1430',
  '1500',
  '1530',
  '1600',
  '1630',
  '1700',
  '1730',
  '1800',
  '1830',
  '1900',
  '1930',
  '2000',
  '2030',
  '2100',
  '2130',
  '2200',
  '2230',
  '2300',
  '2330',
];

export const apiUrl = import.meta.env.VITE_API_URL;

export const getCookie = async () => {
  let cookie;

  await fetch(apiUrl + '/getcookie', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => (cookie = data));

  return cookie;
};
