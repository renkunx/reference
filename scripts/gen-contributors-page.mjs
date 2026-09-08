// 从 README.md 提取「感谢所有贡献者」和「国内镜像网站」两个区块，
// 生成独立页面 docs/contributors.md。
// README 中这两个区块被 <!--rehype:ignore:start/end--> 包裹（首页不渲染，
// 但保留在源文件中以便与上游 jaywcjlove/reference 无冲突合并），
// 本脚本在每次构建前运行，保证子页面与 README 内容同步。
import { readFileSync, writeFileSync } from 'node:fs';

const START_MARK = '## 感谢所有贡献者';
const END_MARK = '## 其它资源';

const lines = readFileSync('README.md', 'utf8').split('\n');
const start = lines.findIndex((line) => line.trim() === START_MARK);
const end = lines.findIndex((line) => line.trim() === END_MARK);
if (start < 0 || end <= start) {
  console.error(`gen-contributors-page: 未在 README.md 中找到区块（${START_MARK} ~ ${END_MARK}）`);
  process.exit(1);
}

const body = lines
  .slice(start, end)
  .filter((line) => !line.trim().startsWith('<!--rehype:ignore:'))
  .filter((line) => !/^<!--rehype:wrap-style=.*home-title-reset-->$/.test(line.trim()))
  .join('\n')
  .replaceAll('(./docs/quickreference.md)', '(./quickreference.md)')
  .replace(/\n{3,}/g, '\n\n')
  .trimEnd();

const page = `贡献者与镜像站点\n===\n\n> 感谢所有为 Quick Reference 做出贡献的开发者；国内访问不畅时，可使用下面的镜像站点。\n\n${body}\n`;
writeFileSync('docs/contributors.md', page);
console.log('gen-contributors-page: docs/contributors.md 已生成');
