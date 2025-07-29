export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function success(data: any) {
  return {
    code: 200,
    data,
    message: 'success',
  }
}

export function error(message: string) {
  return {
    code: 500,
    message,
  }
}

