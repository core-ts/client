import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {fromString} from './csv';

export function optimizeSearchModel<S extends SearchModel>(s: S): S {
  const keys = Object.keys(s);
  const o: any = {};
  for (const key of keys) {
    const p = s[key];
    if (key === 'page') {
      if (p && p >= 1) {
        o[key] = p;
      } else {
        o[key] = 1;
      }
    } else if (key === 'limit') {
      if (p && p >= 1) {
        o[key] = p;
      }
    } else if (key === 'firstLimit') {
      if (p && p >= 1) {
        o[key] = p;
      }
    } else {
      if (p && p !== '') {
        o[key] = p;
      }
    }
  }
  // o.includeTotal = true;
  if (o.limit != null && o.firstLimit === o.limit) {
    delete o['firstLimit'];
  }
  for (const key of Object.keys(o)) {
    if (Array.isArray(o[key]) && o[key].length === 0) {
      delete o[key];
    }
  }
  return o;
}

export async function fromCsv<T>(m: SearchModel, csv: string): Promise<SearchResult<T>> {
  const items = await fromString(csv);
  const arr = [];
  const fields = m.fields;
  for (let i = 1; i < items.length; i++) {
    const obj: any =  {};
    const len = Math.min(fields.length, items[i].length);
    for (let j = 0; j < len; j++) {
      obj[fields[j]] = items[i][j];
    }
    arr.push(obj);
  }
  const x: SearchResult<T> = {
    total: parseFloat(items[0][0]),
    results: arr,
    last: (items[0][0] === '1')
  };
  return x;
}
