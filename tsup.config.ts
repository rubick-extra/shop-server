import type { Options } from 'tsup';
import fs from 'fs-extra';
import path from 'path';

const config: Options = {
  entry: ['src/main.ts'], // 入口文件
  outDir: 'dist',
  format: ['cjs'], // 输出格式
  target: 'es2020',
  sourcemap: true,
  dts: true, // 生成类型声明
  clean: true, // 清理旧文件
  splitting: true,
  skipNodeModulesBundle: true,
  plugins: [afterBuild()]
};

function afterBuild() {
  return {
    name: 'afterBuild',
    buildStart() {
      const dist = path.join(__dirname, 'dist');
      if (fs.existsSync(dist)) {
        fs.rmSync(dist, { recursive: true });
      }
    },
    buildEnd() {
      {
        const form = path.join(__dirname, 'src/public');
        const to = path.join(__dirname, 'dist/public');
        fs.copy(form, to);
      };
      {
        const form = path.join(__dirname, 'src/views');
        const to = path.join(__dirname, 'dist/views');
        fs.copy(form, to);
      }
    }
  };
}

export default config;
