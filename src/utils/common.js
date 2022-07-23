import clientUtils from './client-utils';

const parseUrlParams = () => {
  const {search} = window.location;
  const arrParam = search.slice(1).split('&');
  const param = {};
  for (let i = 0; i < arrParam.length; i++) {
    const pair = arrParam[i].split('=');
    param[pair[0]] = pair[1];
  }
  return param;
};

const combineUrlParams = (url = '', params = {}) => {
  const keys = Object.keys(params);
  const paramUrl = keys
    .reduce(
      (result, key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== ''
          ? [...result, `${key}=${params[key]}`]
          : [...result],
      [],
    )
    .join('&');
  return `${url}?${paramUrl}`;
};

const timeFromNow = (fromDate, format) => {
  const date = new Date(fromDate);
  const fy = date.getFullYear();
  const fM = date.getMonth();
  const fd = date.getDay();
  const fh = date.getHours();
  const fm = date.getMinutes();
  const fs = date.getSeconds();

  const now = new Date();
  const ny = now.getFullYear();
  const nM = now.getMonth();
  const nd = now.getDay();
  const nh = now.getHours();
  const nm = now.getMinutes();
  const ns = now.getSeconds();

  if (ny - fy > 0) return `${ny - fy} năm trước`;
  if (nM - fM > 0) return `${nM - fM} tháng trước`;
  if (nd - fd > 0) return `${nd - fd} ngày trước`;
  if (nh - fh > 0) return `${nh - fh} giờ trước`;
  if (nm - fm > 0) return `${nm - fm} phút trước`;
  if (ns - fs > 0) return `${ns - fs} giây trước`;
};

String.prototype.fromNow = function () {
  if (!this) return '';
  const date = new Date(this);
  const fy = date.getFullYear();
  const fM = date.getMonth();
  const fd = date.getDay();
  const fh = date.getHours();
  const fm = date.getMinutes();
  const fs = date.getSeconds();

  const now = new Date();
  const ny = now.getFullYear();
  const nM = now.getMonth();
  const nd = now.getDay();
  const nh = now.getHours();
  const nm = now.getMinutes();
  const ns = now.getSeconds();

  if (ny - fy > 0) return `${ny - fy} năm trước`;
  if (nM - fM > 0) return `${nM - fM} tháng trước`;
  if (nd - fd > 0) return `${nd - fd} ngày trước`;
  if (nh - fh > 0) return `${nh - fh} giờ trước`;
  if (nm - fm > 0) return `${nm - fm} phút trước`;
  if (ns - fs > 0) return `${ns - fs} giây trước`;
};

// export const momentFromNow = (m) => {
//   const date = moment(m);
//   const fy = date.year();
//   const fM = date.month();
//   const fd = date.day();
//   const fh = date.hour();
//   const fm = date.minute();
//   const fs = date.second();

//   const now = moment();
//   const ny = now.year();
//   const nM = now.month();
//   const nd = now.day();
//   const nh = now.hour();
//   const nm = now.minute();
//   const ns = now.second();

//   if (ny - fy > 0) return `${ny - fy} năm`;
//   if (nM - fM > 0) return `${nM - fM} tháng`;
//   if (nd - fd > 0) return `${nd - fd} ngày`;
//   if (nh - fh > 0) return `${nh - fh} giờ`;
//   if (nm - fm > 0) return `${nm - fm} phút`;
//   if (ns - fs > 0) return `${ns - fs} giây`;
// };

export const getImg = avatar => {
  return avatar
    ? avatar.indexOf('http') !== -1
      ? avatar
      : `${clientUtils.serverApi}/files/${avatar}`
    : 'https://static.toiimg.com/photo/82343395.cms';
};

Number.prototype.formatPrice = function () {
  return this.toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    .replace('.00', '')
    .replace(/,/g, '.');
};
String.prototype.formatPrice = function () {
  try {
    return parseInt(this)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      .replace('.00', '')
      .replace(/,/g, '.');
  } catch (error) {}
  return this;
};

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

export const getAuditInfo = data => {
  var module = {
    options: [],
    header: [
      navigator.platform,
      navigator.userAgent,
      navigator.appVersion,
      navigator.vendor,
      window.opera,
    ],
    dataos: [
      {name: 'Windows Phone', value: 'Windows Phone', version: 'OS'},
      {name: 'Windows', value: 'Win', version: 'NT'},
      {name: 'iPhone', value: 'iPhone', version: 'OS'},
      {name: 'iPad', value: 'iPad', version: 'OS'},
      {name: 'Kindle', value: 'Silk', version: 'Silk'},
      {name: 'Android', value: 'Android', version: 'Android'},
      {name: 'PlayBook', value: 'PlayBook', version: 'OS'},
      {name: 'BlackBerry', value: 'BlackBerry', version: '/'},
      {name: 'Macintosh', value: 'Mac', version: 'OS X'},
      {name: 'Linux', value: 'Linux', version: 'rv'},
      {name: 'Palm', value: 'Palm', version: 'PalmOS'},
    ],
    databrowser: [
      {name: 'Edge', value: 'Edg', version: 'Edg'},
      {name: 'Chrome', value: 'Chrome', version: 'Chrome'},
      {name: 'Firefox', value: 'Firefox', version: 'Firefox'},
      {name: 'Safari', value: 'Safari', version: 'Version'},
      {name: 'Internet Explorer', value: 'MSIE', version: 'MSIE'},
      {name: 'Opera', value: 'Opera', version: 'Opera'},
      {name: 'BlackBerry', value: 'CLDC', version: 'CLDC'},
      {name: 'Mozilla', value: 'Mozilla', version: 'Mozilla'},
    ],
    init: function () {
      var agent = this.header.join(' '),
        os = this.matchItem(agent, this.dataos),
        browser = this.matchItem(agent, this.databrowser);

      return {os: os, browser: browser};
    },
    matchItem: function (string, data) {
      var i = 0,
        j = 0,
        html = '',
        regex,
        regexv,
        match,
        matches,
        version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
          matches = string.match(regexv);
          version = '';
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + '.';
              } else {
                version += matches[j];
              }
            }
          } else {
            version = '0';
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return {name: 'unknown', version: 0};
    },
  };
  var e = module.init();

  return {
    ip: data.IPv4,
    nameDevice: `${e.os.name} ${e.os.version}`,
    address: `${data.city}, ${data.country_name}`,
    application: e.browser.name,
  };
};

export {combineUrlParams, parseUrlParams, timeFromNow};
