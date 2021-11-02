import { AddressData } from './AddressData';
import { getTargetAreaListByCode, shortIndexOf } from './utils';

const ProvinceKeys = [
  '特别行政区',
  '古自治区',
  '维吾尔自治区',
  '壮族自治区',
  '回族自治区',
  '自治区',
  '省省直辖',
  '省',
  '市',
];

const CityKeys = [
  '布依族苗族自治州',
  '苗族侗族自治州',
  '藏族羌族自治州',
  '哈尼族彝族自治州',
  '壮族苗族自治州',
  '傣族景颇族自治州',
  '蒙古族藏族自治州',
  '傣族自治州',
  '白族自治州',
  '藏族自治州',
  '彝族自治州',
  '回族自治州',
  '蒙古自治州',
  '朝鲜族自治州',
  '地区',
  '哈萨克自治州',
  '盟',
  '市',
];

const AreaKeys = [
  '满族自治县',
  '满族蒙古族自治县',
  '蒙古族自治县',
  '朝鲜族自治县',
  '回族彝族自治县',
  '彝族回族苗族自治县',
  '彝族苗族自治县',
  '土家族苗族自治县',
  '布依族苗族自治县',
  '苗族布依族自治县',
  '彝族傣族自治县',
  '傣族彝族自治县',
  '仡佬族苗族自治县',
  '黎族苗族自治县',
  '苗族侗族自治县',
  '哈尼族彝族傣族自治县',
  '哈尼族彝族自治县',
  '彝族哈尼族拉祜族自治县',
  '傣族拉祜族佤族自治县',
  '傣族佤族自治县',
  '拉祜族佤族布朗族傣族自治县',
  '苗族瑶族傣族自治县',
  '彝族回族自治县',
  '独龙族怒族自治县',
  '保安族东乡族撒拉族自治县',
  '回族土族自治县',
  '撒拉族自治县',
  '哈萨克自治县',
  '塔吉克自治县',
  '回族自治县',
  '畲族自治县',
  '土家族自治县',
  '布依族自治县',
  '苗族自治县',
  '瑶族自治县',
  '侗族自治县',
  '水族自治县',
  '傈僳族自治县',
  '仫佬族自治县',
  '毛南族自治县',
  '黎族自治县',
  '羌族自治县',
  '彝族自治县',
  '藏族自治县',
  '纳西族自治县',
  '裕固族自治县',
  '哈萨克族自治县',
  '哈尼族自治县',
  '拉祜族自治县',
  '佤族自治县',
  '左旗',
  '右旗',
  '中旗',
  '后旗',
  '联合旗',
  '自治旗',
  '旗',
  '自治县',
  '街道办事处',
  '新区',
  '区',
  '县',
  '市',
];

export interface ParsedAddress {
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  name?: string;
  code?: string;
  zipCode?: string;
  // 手机号
  mobile?: string;
  // 电话
  phone?: string;
  __type?: 'parseByProvince' | 'parseByCity' | 'parseByArea';
  __parse?: boolean | number;
}

export class AreaParser {
  static isInit = false;

  static ProvinceShort = {};

  static CityShort = {};

  static AreaShort = {};

  static init() {
    for (const code in AddressData.provinceList) {
      const province = AddressData.provinceList[code];
      AreaParser.ProvinceShort[code] = ProvinceKeys.reduce(
        (v, key) => v.replace(key, ''),
        province,
      );
    }

    for (const code in AddressData.cityList) {
      const city = AddressData.cityList[code];
      if (city.length > 2) {
        AreaParser.CityShort[code] = CityKeys.reduce(
          (v, key) => v.replace(key, ''),
          city,
        );
      }
    }
    for (const code in AddressData.districtList) {
      let district = AddressData.districtList[code];
      if (district === '雨花台区') district = '雨花区';
      if (district.length > 2 && district !== '高新区') {
        AreaParser.AreaShort[code] = AreaKeys.reduce((v, key) => {
          if (v.indexOf(key) > 1) v = v.replace(key, '');
          return v;
        }, district);
      }
    }
    AreaParser.isInit = true;
  }

  results: ParsedAddress[];

  constructor() {
    if (!AreaParser.isInit) {
      AreaParser.init();
    }
  }

  /**
   * 开始解析
   * @param address string
   * @param parseAll 是否执行全部解析 默认识别到city终止
   * @returns {Array}
   */
  parse(address: string, parseAll = false): ParsedAddress[] {
    this.results = [];

    // 正向解析
    this.results.unshift(...AreaParser.parseByProvince(address));

    if (parseAll || !this.results[0] || !this.results[0].__parse) {
      // 逆向城市解析  通过所有CityShort匹配
      this.results.unshift(...AreaParser.parseByCity(address));
      if (parseAll || !this.results[0] || !this.results[0].__parse) {
        // 逆向地区解析   通过所有AreaShort匹配
        this.results.unshift(...AreaParser.parseByArea(address));
      }
    }

    // __parse结果改为数值类型
    if (this.results.length > 1) {
      for (const result of this.results) {
        let _address = address;
        result.__parse = +result.__parse;
        if (
          result.__parse &&
          result.province &&
          _address.includes(result.province)
        ) {
          _address = _address.replace(result.province, '');
          result.__parse += 1;
          if (result.city && _address.includes(result.city)) {
            _address = _address.replace(result.city, '');
            result.__parse += 1;
            if (result.district && _address.includes(result.district)) {
              result.__parse += 1;
            }
          }
        }
      }
    }

    // 可信度排序
    this.results.sort((a, b) =>
      a.__parse && !b.__parse
        ? -1
        : !a.__parse && b.__parse
        ? 1
        : a.__parse && b.__parse && a.__parse > b.__parse
        ? -1
        : a.__parse && b.__parse && a.__parse < b.__parse
        ? 1
        : a.__parse && a.__type === 'parseByProvince'
        ? -1
        : b.__parse && b.__type === 'parseByProvince'
        ? 1
        : a.name.length > b.name.length
        ? 1
        : a.name.length < b.name.length
        ? -1
        : 0,
    );

    return this.results;
  }

  /**
   * 1.1 提取省份
   */
  static parseByProvince(addressBase: string): ParsedAddress[] {
    const provinceList = AddressData.provinceList;
    const results: ParsedAddress[] = [];

    const result: ParsedAddress = {
      province: '',
      city: '',
      district: '',
      detail: '',
      name: '',
      code: '',
      __type: 'parseByProvince',
      __parse: false,
    };

    let address = addressBase;

    for (const code in provinceList) {
      const province = provinceList[code];
      let index = address.indexOf(province);
      const shortProvince = index > -1 ? '' : AreaParser.ProvinceShort[code];
      const provinceLength = shortProvince
        ? shortProvince.length
        : province.length;
      if (shortProvince) {
        index = address.indexOf(shortProvince);
      }
      if (index > -1) {
        // 如果省份不是第一位 在省份之前的字段识别为名称
        if (index > 0) {
          result.name = address.substr(0, index).trim();
          address = address.substr(index).trim();
        }
        result.province = province;
        result.code = code;
        const _address = address.substr(provinceLength);
        if (_address.charAt(0) !== '市' || _address.indexOf(province) > -1) {
          address = _address;
        }
        // 如果是用短名匹配的 要替换省关键字
        if (shortProvince) {
          for (const key of ProvinceKeys) {
            if (address.indexOf(ProvinceKeys[key]) === 0) {
              address = address.substr(ProvinceKeys[key].length);
            }
          }
        }

        // tslint:disable-next-line: variable-name
        let __address = AreaParser.parseCityByProvince(address, result);
        if (!result.city) {
          __address = AreaParser.parseAreaByProvince(address, result);
        }
        if (result.city) {
          address = __address;
          result.__parse = true;
          break;
        } else {
          // 如果没有识别到地区 缓存本次结果，并重置数据
          results.unshift({ ...result, detail: address.trim() });
          result.province = '';
          result.code = '';
          result.name = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, detail: address.trim() });
    }

    return results;
  }

  /**
   * 1.2.提取城市
   * @returns {boolean}
   */
  static parseCityByProvince(address: string, result: ParsedAddress) {
    const cityList = getTargetAreaListByCode('city', result.code);
    const _result = {
      city: '',
      code: '',
      index: -1,
      address: '',
      isShort: false,
    };
    for (const city of cityList) {
      let index = address.indexOf(city.name);
      const shortCity = index > -1 ? '' : AreaParser.CityShort[city.code];
      const cityLength = shortCity ? shortCity.length : city.name.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (
        index > -1 &&
        (_result.index === -1 ||
          _result.index > index ||
          (!shortCity && _result.isShort))
      ) {
        _result.city = city.name;
        _result.code = city.code;
        _result.index = index;
        _result.address = address.substr(index + cityLength);
        _result.isShort = !!shortCity;
        // 如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (const key of CityKeys) {
            if (address.indexOf(key) === 0) {
              // 排除几个会导致异常的解析
              if (
                key !== '市' &&
                !['市北区', '市南区', '市中区', '市辖区'].some(
                  v => address.indexOf(v) === 0,
                )
              ) {
                address = address.substr(key.length);
              }
            }
          }
        }
      }
      if (index > -1 && index < 3) {
        result.city = city.name;
        result.code = city.code;
        _result.address = address.substr(index + cityLength);
        // 如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (const key of CityKeys) {
            if (_result.address.indexOf(key) === 0) {
              // 排除几个会导致异常的解析
              if (
                key !== '市' &&
                !['市北区', '市南区', '市中区', '市辖区'].some(
                  v => _result.address.indexOf(v) === 0,
                )
              ) {
                _result.address = _result.address.substr(key.length);
              }
            }
          }
        }
      }
    }
    if (_result.index > -1) {
      result.city = _result.city;
      result.code = _result.code;
      address = AreaParser.parseAreaByCity(_result.address, result);
    }
    return address;
  }

  /**
   * 1.3.,2.2 已匹配城市的地址 提取地区
   * @param address string
   * @param result object
   * @returns {string}
   */
  static parseAreaByCity(address: string, result: ParsedAddress) {
    const districtList = getTargetAreaListByCode('district', result.code);
    const _result = {
      district: '',
      code: '',
      index: -1,
      address: '',
      isShort: false,
    };
    for (const district of districtList) {
      let index = address.indexOf(district.name);
      let shortArea = index > -1 ? '' : AreaParser.AreaShort[district.code];
      if (shortArea) {
        const { index: _index, matchName } = shortIndexOf(
          address,
          shortArea,
          district.name,
        );
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : district.name.length;
      if (
        index > -1 &&
        (_result.index === -1 ||
          _result.index > index ||
          (!shortArea && _result.isShort))
      ) {
        _result.district = district.name;
        _result.code = district.code;
        _result.index = index;
        _result.address = address.substr(index + areaLength);
        _result.isShort = !!shortArea;
        // 如果是用短名匹配的 要替换市关键字
        if (shortArea) {
          for (const key of AreaKeys) {
            if (_result.address.indexOf(key) === 0) {
              _result.address = _result.address.substr(key.length);
            }
          }
        }
      }
    }
    if (_result.index > -1) {
      result.district = _result.district;
      result.code = _result.code;
      address = _result.address;
    }
    return address;
  }

  /**
   * 1.4.提取省份但没有提取到城市的地址尝试通过省份下地区匹配
   */
  static parseAreaByProvince(address: string, result: ParsedAddress) {
    const districtList = getTargetAreaListByCode('district', result.code);
    for (const district of districtList) {
      let index = address.indexOf(district.name);
      let shortArea = index > -1 ? '' : AreaParser.AreaShort[district.code];
      if (shortArea) {
        const { index: _index, matchName } = shortIndexOf(
          address,
          shortArea,
          district.name,
        );
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : district.name.length;

      if (index > -1 && index < 6) {
        const [city] = getTargetAreaListByCode('city', district.code, true);
        result.city = city.name;
        result.district = district.name;
        result.code = district.code;
        address = address.substr(index + areaLength);
        // 如果是用短名匹配的 要替换地区关键字
        if (shortArea) {
          for (const key of AreaKeys) {
            if (address.indexOf(key) === 0) {
              address = address.substr(key.length);
            }
          }
        }
        break;
      }
    }
    return address;
  }

  /**
   * 2.1 通过城市识别地址
   * @param addressBase string
   * @returns {Array}
   */
  static parseByCity(addressBase: string) {
    const cityList = AddressData.cityList;
    const results = [];
    const result: ParsedAddress = {
      province: '',
      city: '',
      district: '',
      detail: '',
      name: '',
      code: '',
      __type: 'parseByCity',
      __parse: false,
    };
    let address = addressBase;
    for (const code in cityList) {
      const city = cityList[code];
      if (city.length < 2) break;
      let index = address.indexOf(city);
      const shortCity = index > -1 ? '' : AreaParser.CityShort[code];
      const cityLength = shortCity ? shortCity.length : city.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1) {
        const [province] = getTargetAreaListByCode('province', code, true);
        result.province = province.name;
        result.city = city;
        result.code = code;
        // 左侧排除省份名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = AreaParser.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(
              new RegExp(_provinceName, 'g'),
              '',
            );
          }
          if (leftAddress) {
            result.name = leftAddress;
          }
        }

        address = address.substr(index + cityLength);
        address = AreaParser.parseAreaByCity(address, result);
        if (_provinceName || result.district) {
          result.__parse = true;
          break;
        } else {
          // 如果没有识别到省份和地区 缓存本次结果，并重置数据
          results.unshift({ ...result, detail: address.trim() });
          result.name = '';
          result.city = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, detail: address.trim() });
    }
    return results;
  }

  /**
   * 3 通过地区识别地址
   * @returns {Array}
   */
  static parseByArea(addressBase: string): ParsedAddress[] {
    const districtList = AddressData.districtList;
    const results: ParsedAddress[] = [];
    const result: ParsedAddress = {
      province: '',
      city: '',
      district: '',
      detail: '',
      name: '',
      code: '',
      __type: 'parseByArea',
      __parse: false,
    };

    let address = addressBase;

    for (const code in districtList) {
      const district = districtList[code];
      if (district.length < 2) break;
      let index = address.indexOf(district);
      let shortArea = index > -1 ? '' : AreaParser.AreaShort[code];
      if (shortArea) {
        const { index: _index, matchName } = shortIndexOf(
          address,
          shortArea,
          district,
        );
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : district.length;
      if (index > -1) {
        const [province, city] = getTargetAreaListByCode(
          'province',
          code,
          true,
        );
        result.province = province.name;
        result.city = city.name;
        result.district = district;
        result.code = code;
        // 左侧排除省份城市名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '',
          _cityName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = AreaParser.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(
              new RegExp(_provinceName, 'g'),
              '',
            );
          }

          _cityName = city.name;
          _index = leftAddress.indexOf(_cityName);
          if (_index === -1) {
            _cityName = AreaParser.CityShort[city.code];
            _index = leftAddress.indexOf(_cityName);
            if (_index === -1) _cityName = '';
          }
          if (_cityName) {
            leftAddress = leftAddress.replace(new RegExp(_cityName, 'g'), '');
          }
          if (leftAddress) {
            result.name = leftAddress;
          }
        }
        address = address.substr(index + areaLength);

        if (_provinceName || _cityName) {
          result.__parse = true;
          break;
        } else {
          // 如果没有识别到省份和地区缓存本次结果，并重置数据
          results.unshift({ ...result, detail: address.trim() });
          result.name = '';
          result.city = '';
          result.district = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, detail: address.trim() });
    }
    return results;
  }
}
