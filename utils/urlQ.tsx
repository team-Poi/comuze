export default function urlQ(q: { [key: string]: string | number | boolean }) {
  let str: string[] = [];
  let k = Object.keys(q);
  for (let i = 0; i < k.length; i++) {
    str.push(`${encodeURIComponent(k[i])}=${encodeURI(q[k[i]].toString())}`);
  }
  return str.join("&");
}
