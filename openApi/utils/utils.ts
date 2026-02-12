import fs from 'fs'

// 判断文件夹是否存在 不存在则创建
export function generatorFolder(output: string) {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
}
