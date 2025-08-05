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
  '0800',
  '0900',
  '1000',
  '1100',
  '1200',
  '1300',
  '1400',
  '1500',
  '1600',
  '1700',
  '1800',
  '1900',
  '2000',
  '2100',
  '2200',
  '2300',
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
