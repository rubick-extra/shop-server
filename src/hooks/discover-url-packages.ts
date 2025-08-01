import * as cheerio from 'cheerio';
import { isString, isObject, success, error } from '../utils';
import { Plugin } from '../models/plugins';
import fs from 'fs-extra';
import path from 'path';

export async function discoverUrlPackages(data: any) {
  const { url } = data;
  if (!url || !url.startsWith('http')) return error('请输入正确的url');
  const u = new URL(url);

  switch (u.hostname) {
    case 'github.com': {}
    case 'gitee.com': {
      return resolveGitee(u);
    }
  }
}

async function resolveGitee(u: URL) {
  const { pathname } = u;
  const [owner, repo, ...rest] = pathname.split('/').filter(Boolean);
  if (!owner || !repo) return error('看上去这不是一个有效的Gitee仓库首页地址');
  if (rest.length) return error('请输入正确的Gitee仓库首页地址');
  const response = await fetch(u, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const branch = $('#git-project-branch .default.text').text().trim();
  if (!branch) return error('似乎没有找到有效的分支');
  const pkgjsonUrl = `${u.origin}/${owner}/${repo}/raw/${branch}/package.json`;
  const pkgjsonResponse = await fetch(pkgjsonUrl);
  const pkgjson = await pkgjsonResponse.json();
  // 读取readme
  const readmeResponse = await fetch(u);
  const readme = await readmeResponse.text();

  if (isObject(pkgjson.author)) {
    const { name } = pkgjson.author;
    pkgjson.author = name;
  }

  pkgjson.homePage ??= pkgjson.homepage; 

  const plugin = {
    author: isString(pkgjson.author) ? pkgjson.author : '',
    dependencies: pkgjson.dependencies,
    description: isString(pkgjson.description) ? pkgjson.description : '',
    development: isString(pkgjson.development) ? pkgjson.development : '',
    entry: isString(pkgjson.entry) ? pkgjson.entry : '',
    features: pkgjson.features || [],
    keywords: pkgjson.keywords || [],
    homePage: isString(pkgjson.homePage) ? pkgjson.homePage : '',
    latestVersion: isString(pkgjson.version) ? pkgjson.version : '',
    license: isString(pkgjson.license) ? pkgjson.license : '',
    logo: isString(pkgjson.logo) ? pkgjson.logo : '',
    main: isString(pkgjson.main) ? pkgjson.main : '',
    name: isString(pkgjson.name) ? pkgjson.name : '',
    pluginName: isString(pkgjson.pluginName) ? pkgjson.pluginName : '',
    pluginType: isString(pkgjson.pluginType) ? pkgjson.pluginType : '',
    preload: isString(pkgjson.preload) ? pkgjson.preload : '',
    readme: readme,
    scripts: pkgjson.scripts || {},
    source: 'url',
    versions: pkgjson.versions || [],
    volta: pkgjson.volta,
  }

  plugin.pluginName = plugin.pluginName || plugin.name;

  await updatePlugin(plugin);

  return success(plugin);
}

async function updatePlugin(plugin: any) {
  const exist = await Plugin.findOne({
    where: {
      name: plugin.name,
      source: 'url',
    }
  });
  if (exist) {
    exist.update(plugin);
  } else {
    await Plugin.create(plugin);
  }
  const list = await Plugin.findAll();
  fs.writeFileSync(path.join(process.cwd(), 'public/plugins', './total-plugins.json'), JSON.stringify(list, null, 2));
}
