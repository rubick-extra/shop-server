import { discoverNpmPackages } from '@/hooks';
import { Plugin } from '@/models/plugins';
import { sleep } from '@/utils/common';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';

export async function useRubickShop() {
  const updateTimeFile = path.join(process.cwd(), 'update-time.txt');
  if (fs.existsSync(updateTimeFile)) {
    const updateTime = fs.readFileSync(updateTimeFile, 'utf-8');
    if (dayjs().diff(dayjs(updateTime), 'day') < 1) {
      return;
    }
  } else {
    fs.writeFileSync(updateTimeFile, dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }

  const plugins = await fetch('https://gitee.com/monkeyWang/rubickdatabase/raw/master/plugins/total-plugins.json');
  const list = await plugins.json();
  const names = list.map((item: any) => item.name);

  for (const name of names) {
    const exists = await Plugin.findOne({
      where: {
        name,
      },
    });
    if (exists) continue;
    console.log('正在提取: ', name);
    await discoverNpmPackages({ name });
    console.log(`${name} 已发现...`);
    await sleep(1000);
  }
  console.log('所有原始插件已发现...');
  const data = await Plugin.findAll();
  fs.writeFileSync(path.join(process.cwd(), 'public/plugins', './total-plugins.json'), JSON.stringify(data, null, 2));
}
