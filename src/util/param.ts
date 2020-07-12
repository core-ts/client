export function param(obj: any): string {
  const keys = Object.keys(obj);
  const arrs = [];
  for (const item of keys) {
    const str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
    arrs.push(str);
  }
  return arrs.join('&');
}
