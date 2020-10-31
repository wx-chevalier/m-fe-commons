import fs from 'fs';
import path from 'path';
import DEBUG from 'debug';

const debug = DEBUG('ted:scanner');

export interface ScanOption {
  recursive?: boolean;
  filetypes?: string[];
}

function isTargerFileType(filepath: string, filetypes: string[]): boolean {
  const regStr = `\\.(${filetypes.join('|')})$`;
  const reg = new RegExp(regStr);
  return reg.test(filepath);
}

/** 加载文件 */
function load(filepath: string, option: ScanOption) {
  const stat = fs.statSync(filepath);
  if (stat.isFile() && isTargerFileType(filepath, option.filetypes || [])) {
    debug(`load file: ${filepath}`);
    require(filepath);
    return;
  }
  if (!option.recursive) return;
  if (stat.isDirectory()) {
    const files = fs.readdirSync(filepath);

    files.forEach(filename => {
      load(path.normalize(filepath + '/' + filename), option);
    });
  }
}

export function Scanner(filepath: string, option: ScanOption) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`filepath ${filepath} is not exists`);
  }
  load(filepath, option);
}

export default Scanner;
