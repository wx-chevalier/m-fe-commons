import { AddressParser } from '../AddressParser';

describe('地址解析测试', () => {
  it('AddressParser', () => {
    const p = new AddressParser(
      // '张三1351111111江苏省扬州市广陵区XX小区X楼xxx室',
      '上海普陀区中山北路2000号23楼 李米收 18930739541',
    );

    const results = p.parse();

    console.log(results);
  });
});
