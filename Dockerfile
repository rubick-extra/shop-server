# 使用带 Volta 的基础镜像
FROM marcaureln/volta:latest

# 设置工作目录
WORKDIR /app

# 复制依赖管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

RUN volta install node

# 安装 pnpm（使用 Volta 安装并管理版本）
RUN volta install pnpm

# 安装依赖
RUN pnpm install

# 复制项目全部文件
COPY . .
