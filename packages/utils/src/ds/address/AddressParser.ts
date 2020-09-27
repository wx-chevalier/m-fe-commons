import { Reg, strLen } from './utils';
import { AreaParser, ParsedAddress } from './AreaParser';

const ExcludeKeys = [
  '发件人',
  '收货地址',
  '收货人',
  '收件人',
  '收货',
  '手机号码',
  '邮编',
  '电话',
  '所在地区',
  '详细地址',
  '地址',
  '：',
  ':',
  '；',
  ';',
  '，',
  ',',
  '。',
  '、',
];

/**
 * 提取姓名
 * @param result
 * @param maxLen 字符串占位 比这个数值短才识别为姓名 汉字2位英文1位
 * @param firstName 最初切分地址识别到的name
 */
function parseName(
  result: ParsedAddress,
  { firstName }: { maxLen?: number; firstName?: string } = {},
) {
  if (!result.name) {
    const list = result.detail.split(' ');
    const name = {
      value: '',
      index: -1,
    };
    if (list.length > 1) {
      let index = 0;
      for (const v of list) {
        if (
          v ||
          strLen(name.value) > strLen(v) ||
          (firstName && v === firstName)
        ) {
          name.value = v;
          name.index = index;
          if (firstName && v === firstName) break;
        }
        index += 1;
      }
    }
    if (name.value) {
      result.name = name.value;
      list.splice(name.index, 1);
      result.detail = list.join(' ');
    }
  }
  return result.name;
}

export class AddressParser {
  static areaParser = new AreaParser();

  rawAddress: string;
  address: string;
  result: ParsedAddress;

  constructor(address: string) {
    this.rawAddress = address;
    this.address = address;
  }
  /**
   * 开始解析
   * @param address string 地址
   * @param parseAll boolean 是否完全解析
   * @returns {Array}
   */
  parse(address: string = this.address, parseAll = false) {
    let results: ParsedAddress[] = [];
    if (address) {
      this.result = {
        mobile: '',
        zipCode: '',
        phone: '',
      };

      this.address = address;
      this.replace();
      this.parseMobile();
      this.parsePhone();
      this.parseZipCode();
      this.address = this.address.replace(/ {2,}/, ' ');
      const firstName = parseName({ detail: this.address });

      results = AddressParser.areaParser.parse(this.address, parseAll);

      for (const result of results) {
        Object.assign(result, this.result);
        parseName(result, { firstName });
      }
      if (!results.length) {
        const result = Object.assign(this.result, {
          province: '',
          city: '',
          district: '',
          detail: this.address,
          name: '',
          code: '',
          __type: '',
        });
        parseName(result);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * 替换无效字符
   */
  replace() {
    let { address } = this;

    for (const key of ExcludeKeys) {
      address = address.replace(new RegExp(key, 'g'), ' ');
    }

    this.address = address
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ')
      // 整理手机号
      .replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3')
      .replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
  }

  /**
   * 提取手机号码
   */
  parseMobile() {
    Reg.mobile.lastIndex = 0;
    const mobile = Reg.mobile.exec(this.address);
    if (mobile) {
      this.result.mobile = mobile[0];
      this.address = this.address.replace(mobile[0], ' ');
    }
  }

  /**
   * 提取电话号码
   */
  parsePhone() {
    Reg.phone.lastIndex = 0;
    const phone = Reg.phone.exec(this.address);
    if (phone) {
      this.result.phone = phone[0];
      this.address = this.address.replace(phone[0], ' ');
    }
  }

  /**
   * 提取邮编
   */
  parseZipCode() {
    Reg.zipCode.lastIndex = 0;
    const zip = Reg.zipCode.exec(this.address);
    if (zip) {
      this.result.zipCode = zip[0];
      this.address = this.address.replace(zip[0], '');
    }
  }
}
