import fs from 'fs-extra';
import path from 'path';
import compressing from 'compressing';
import { rimraf } from 'rimraf';
import { Plugin } from '../models/plugins';
import { isString, isObject, success, error } from '../utils';

export async function discoverNpmPackages(data: any) {
  const { name } = data;
  const url = `https://www.npmjs.com/package/${name}?activeTab=readme`;
  const response = await fetch(url).catch(() => null);
  if (!response) return error('无法从npmjs.com获取npm包信息...');
  const page = await response.text();
  const meta = extractContext(page);

  if (!meta) return error('似乎npm包解析失败，请检查包名是否正确以及网络是否正常');

  const { context, name: metaName } = meta;

  if (metaName === "errors/not-found") return error('npm包不存在，请检查包名是否正确');

  const downloadUrl = context.packument.versions[0].dist.tarball;
  const filePath = await downloadZipFile(downloadUrl, context.package, context.packument.version);

  const decompressedDir = await extractTgzFile(filePath);
  const packageJson = readPackageJson(decompressedDir);
  const readme = readReadme(decompressedDir);

  rimraf(decompressedDir);

  const types = ['ui', 'system'];
  if (!types.includes(packageJson.pluginType)) return error('这个npm包似乎不是插件，请检查包名是否正确');

  const versions = context.packument.versions.map((t: any) => {
    return {
      value: t.version,
      date: t.date.ts,
      rel: t.date.rel
    }
  })

  const keywords = packageJson.keywords || [];

  if (isObject(packageJson.author)) {
    const { name } = packageJson.author;
    packageJson.author = name;
  }

  const plugin = {
    author: isString(packageJson.author) ? packageJson.author : '',
    description: isString(context.packument.description) ? context.packument.description : '',
    keywords: JSON.stringify(keywords),
    homepage: isString(packageJson.homePage) ? packageJson.homePage : '',
    latestVersion: isString(context.packument.version) ? context.packument.version : '',
    logo: isString(packageJson.logo) ? packageJson.logo : '',
    name: isString(context.package) ? context.package : '',
    pluginName: isString(packageJson.pluginName) ? packageJson.pluginName : '',
    pluginType: isString(packageJson.pluginType) ? packageJson.pluginType : '',
    readme: readme,
    source: 'npm',
    versions: JSON.stringify(versions),
  }

  await updatePlugin(plugin);

  return success(plugin);
}

function extractContext(html: string) {
  // 正则表达式匹配__context__对象的定义
  const regex = /window\.__context__\s*=\s*({[^<]*)<\/script>/g;

  // 执行匹配
  const match = html.match(regex);

  if (match && match[0]) {
    const txt = match[0].replace('</script>', '').replace('window.__context__ = ', '');
    // 尝试格式化JSON以便更好地查看
    try {
      const contextObject = new Function(`return ${txt}`)();
      return contextObject;
    } catch (e) {
      // 如果解析失败，返回原始字符串
      return match[1];
    }
  }

  return null; // 如果没有找到__context__
}

async function downloadZipFile(url: string, name: string, version: string) {
  const ext = path.extname(url);
  const filePath = path.join(process.cwd(), 'plugins', `${name}-${version}${ext}`);
  if (fs.existsSync(filePath)) return filePath;
  const response = await fetch(url);
  const zip = await response.arrayBuffer();
  const dirPath = path.dirname(filePath);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(zip));
  return filePath;
}

async function extractTgzFile(filePath: string) {
  const ext = path.extname(filePath);
  const dir = filePath.slice(0, -ext.length);
  await compressing.tgz.uncompress(filePath, dir);
  return dir;
}

function readPackageJson(dir: string) {
  const packageJsonPath = path.join(dir, './package/package.json');
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(packageJson);
}

function readReadme(dir: string) {
  const packagePath = path.join(dir, './package');
  const files = fs.readdirSync(packagePath);
  const readmePath = files.find(filename => filename.toLowerCase().endsWith('readme.md'));
  if (!readmePath) return '';
  const readme = fs.readFileSync(path.join(packagePath, readmePath), 'utf8');
  return readme;
}

async function updatePlugin(plugin: any) {
  const exist = await Plugin.findOne({
    where: {
      name: plugin.name,
      source: 'npm',
    }
  });
  if (exist) {
    exist.update(plugin);
  } else {
    await Plugin.create(plugin);
  }
}
