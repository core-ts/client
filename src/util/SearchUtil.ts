import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {CsvUtil} from './CsvUtil';

export class SearchUtil {
  public static optimizeSearchModel<S extends SearchModel>(s: S): S {
    const keys = Object.keys(s);
    const o: any = {};
    for (const key of keys) {
      const p = s[key];
      if (key === 'pageIndex') {
        if (p && p >= 1) {
          o[key] = p;
        } else {
          o[key] = 1;
        }
      } else if (key === 'pageSize') {
        if (p && p >= 1) {
          o[key] = p;
        }
      } else if (key === 'initPageSize') {
        if (p && p >= 1) {
          o[key] = p;
        }
      } else {
        if (p && p !== '') {
          o[key] = p;
        }
      }
    }
    o.includeTotal = true;
    if (o.pageSize != null && o.initPageSize === o.pageSize) {
      delete o['initPageSize'];
    }
    for (const key of Object.keys(o)) {
      if (Array.isArray(o[key]) && o[key].length === 0) {
        delete o[key];
      }
    }
    return o;
  }
  public static async fromCsv<T>(m: SearchModel, csv: string): Promise<SearchResult<T>> {
    const items = await CsvUtil.fromString(csv);
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
      itemTotal: parseFloat(items[0][0]),
      results: arr,
      lastPage: (items[0][0] === '1')
    };
    return x;
  }
}
