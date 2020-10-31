import { AddressData } from './AddressData';

export const Reg = {
  mobile: /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g,
};

/**
 * 通过地区编码返回省市区对象
 * @param code
 * @returns {{code: *, province: (*|string), city: (*|string), district: (*|string)}}
 */
export function getAreaByCode(code: string) {
  const pCode = `${code.slice(0, 2)}0000`,
    cCode = `${code.slice(0, 4)}00`;
  return {
    code: code,
    province: AddressData.provinceList[pCode] || '',
    city: AddressData.cityList[cCode] || '',
    district: AddressData.districtList[code] || '',
  };
}

/**
 * 通过code取父省市对象
 * @param target province/city/district
 * @param code
 * @returns {Array} [province, city, district]
 */
export function getTargetParentAreaListByCode(target: string, code: string) {
  const result = [];
  result.unshift({
    code,
    name: AddressData.districtList[code] || '',
  });
  if (['city', 'province'].includes(target)) {
    code = code.slice(0, 4) + '00';
    result.unshift({
      code,
      name: AddressData.cityList[code] || '',
    });
  }
  if (target === 'province') {
    code = code.slice(0, 2) + '0000';
    result.unshift({
      code,
      name: AddressData.provinceList[code] || '',
    });
  }
  return result;
}

/**
 * 根据省市县类型和对应的`code`获取对应列表
 * 只能逐级获取 province->city->district OK  province->district ERROR
 * @param target String province city district
 * @param code
 * @param parent 默认获取子列表 如果要获取的是父对象 传true
 * @returns {*}
 */
export function getTargetAreaListByCode(
  target: 'province' | 'city' | 'district',
  code: string,
  parent: boolean = false,
) {
  if (parent) return getTargetParentAreaListByCode(target, code);

  const result: { code: string; name: string }[] = [];
  const list =
    AddressData[
      {
        city: 'cityList',
        district: 'districtList',
      }[target]
    ];
  if (code && list) {
    code = code.toString();
    const provinceCode = code.slice(0, 2);
    const cityCode = code.slice(2, 4);
    if (target === 'district' && cityCode !== '00') {
      code = `${provinceCode}${cityCode}`;
      for (let j = 0; j < 100; j++) {
        const _code = `${code}${j < 10 ? '0' : ''}${j}`;
        if (list[_code]) {
          result.push({
            code: _code,
            name: list[_code],
          });
        }
      }
    } else {
      for (let i = 0; i < 91; i++) {
        // 最大 city 编码只到91
        // 只有 city 跟 district
        code = `${provinceCode}${i < 10 ? '0' : ''}${i}${
          target === 'city' ? '00' : ''
        }`;
        if (target === 'city') {
          if (list[code]) {
            result.push({
              code,
              name: list[code],
            });
          }
        } else {
          for (let j = 0; j < 100; j++) {
            const _code = `${code}${j < 10 ? '0' : ''}${j}`;
            if (list[_code]) {
              result.push({
                code: _code,
                name: list[_code],
              });
            }
          }
        }
      }
    }
  } else {
    for (const code in list) {
      result.push({
        code,
        name: list[code],
      });
    }
  }
  return result;
}

/**
 * 通过省市区非标准字符串准换为标准对象
 * 旧版识别的隐藏省份后缀的对象可通过这个函数转换为新版支持对象
 * @param province
 * @param city
 * @param district
 * @returns {{code: string, province: string, city: string, district: string}}
 */
export function getAreaByAddress({
  province,
  city,
  district,
}: {
  province: string;
  city: string;
  district: string;
}) {
  const { provinceList, cityList, districtList } = AddressData;
  const result = {
    code: '',
    province: '',
    city: '',
    district: '',
  };
  for (let _code in provinceList) {
    const _province = provinceList[_code];
    if (_province.indexOf(province) === 0) {
      result.code = _code;
      result.province = _province;
      _code = _code.substr(0, 2);
      for (let _cityCode in cityList) {
        if (_cityCode.indexOf(_code) === 0) {
          const _city = cityList[_cityCode];
          if (_city.indexOf(city) === 0) {
            result.code = _cityCode;
            result.city = _city;
            if (district) {
              _cityCode = _cityCode.substr(0, 4);
              for (const _codeArea in districtList) {
                if (_codeArea.indexOf(_cityCode) === 0) {
                  const _area = districtList[_codeArea];
                  if (_area.indexOf(district) === 0) {
                    result.code = _codeArea;
                    result.district = _area;
                    break;
                  }
                }
              }
            }
            break;
          }
        }
      }
      break;
    }
  }
  return result;
}

/**
 * 字符串占位长度
 * @param str
 * @returns {number}
 */
export function strLen(str: string) {
  const l = str.length;
  let len = 0;
  for (let i = 0; i < l; i++) {
    len += (str.charCodeAt(i) & 0xff00) !== 0 ? 2 : 1;
  }
  return len;
}

/** 获取短名称 */
export function shortIndexOf(address: string, shortName: string, name: string) {
  let index = address.indexOf(shortName);
  let matchName = shortName;
  if (index > -1) {
    for (let i = shortName.length; i <= name.length; i++) {
      const _name = name.substr(0, i);
      const _index = address.indexOf(_name);
      if (_index > -1) {
        index = _index;
        matchName = _name;
      } else {
        break;
      }
    }
  }
  return { index, matchName };
}
