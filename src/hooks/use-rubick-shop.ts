import { discoverNpmPackages } from '@/hooks';
import { Plugin } from '@/models/plugins';
import { sleep } from '@/utils/common';

export async function useRubickShop() {
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
}
