import {build, json, keys, Metadata, MetaModel} from './json';

export interface SearchModel {
  limit: number;
  fields?: string[];
}
export interface SearchResult<T> {
  total?: number;
  results: T[];
  last?: boolean;
}

export function param(obj: any): string {
  const keys = Object.keys(obj);
  const arrs = [];
  for (const item of keys) {
    const str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
    arrs.push(str);
  }
  return arrs.join('&');
}


export interface Headers {
  [key: string]: any;
}

export interface HttpOptionsService {
  getHttpOptions(): { headers?: Headers };
}

export interface HttpRequest {
  get<T>(url: string, options?: {headers?: Headers}): Promise<T>;
  delete<T>(url: string, options?: {headers?: Headers}): Promise<T>;
  post<T>(url: string, obj: any, options?: {headers?: Headers}): Promise<T>;
  put<T>(url: string, obj: any, options?: {headers?: Headers}): Promise<T>;
  patch<T>(url: string, obj: any, options?: {headers?: Headers}): Promise<T>;
}

export interface CsvService {
  fromString(value: string): Promise<string[][]>;
}
// tslint:disable-next-line:class-name
export class resource {
  static csv: CsvService;
}

export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
    this.fromString = this.fromString.bind(this);
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise( resolve => {
      this._csv({noheader: true, output: 'csv'}).fromString(value).then(v => resolve(v));
    });
  }
}

export function fromString(value: string): Promise<string[][]> {
  return resource.csv.fromString(value);
}

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

export class ViewWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, protected _metamodel?: MetaModel) {
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.formatObject = this.formatObject.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    if (!_metamodel) {
      const m = build(this.model);
      this._metamodel = m;
    }
    this._keys = this._metamodel.keys;
  }
  private _keys: string[] = [];

  keys(): string[] {
    return this._keys;
  }
  metadata(): Metadata {
    return this.model;
  }

  async all(): Promise<T[]> {
    const res = await this.http.get<T[]>(this.serviceUrl);
    return this.formatObjects(res);
  }

  async load(id: ID): Promise<T> {
    let url = this.serviceUrl + '/' + id;
    if (this._keys && this._keys.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._keys) {
        url = url + '/' + id[name];
      }
    }
    try {
      const res = await this.http.get<T>(url);
      return this.formatObject(res);
    } catch (err) {
      if (err && err.status === 404) {
        return null;
      } else {
        throw err;
      }
    }
  }

  protected formatObjects(list: T[]): T[] {
    if (!list || list.length === 0) {
      return list;
    }
    for (const obj of list) {
      json(obj, this._metamodel);
    }
    return list;
  }

  protected formatObject(obj: any): any {
    json(obj, this._metamodel);
    return obj;
  }
}

export class GenericWebClient<T, ID, R> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.formatResultInfo = this.formatResultInfo.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }

  protected formatResultInfo(result: any): any {
    if (result && result.status === 1 && result.value && typeof result.value === 'object') {
      result.value = json(result.value, this._metamodel);
    }
    return result;
  }

  async insert(obj: T): Promise<R> {
    json(obj, this._metamodel);
    const res = await this.http.post<R>(this.serviceUrl, obj);
    return this.formatResultInfo(res);
  }

  async update(obj: T): Promise<R> {
    let url = this.serviceUrl;
    const keys = this.keys();
    if (keys && keys.length > 0) {
      for (const name of keys) {
        url += '/' + obj[name];
      }
    }
    try {
      const res = await this.http.put<R>(url, obj);
      return this.formatResultInfo(res);
    } catch (err) {
      if (err && err.status === 404) {
        const x: any = 0;
        return x;
      } else {
        throw err;
      }
    }
  }

  async patch(obj: T): Promise<R> {
    let url = this.serviceUrl;
    const keys = this.keys();
    if (keys && keys.length > 0) {
      for (const name of keys) {
        url += '/' + obj[name];
      }
    }
    try {
      const res = await this.http.patch<R>(url, obj);
      return this.formatResultInfo(res);
    } catch (err) {
      if (err && err.status === 404) {
        const x: any = 0;
        return x;
      } else {
        throw err;
      }
    }
  }

  async delete(id: ID): Promise<number> {
    let url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && this.model) {
      const keys = this.keys();
      if (keys && keys.length > 0) {
        url = this.serviceUrl;
        for (const key of keys) {
          url = url + '/' + id[key];
        }
      }
    }
    try {
      const res = await this.http.delete<number>(url);
      return res;
    } catch (err) {
      if (err && err.status === 404) {
        return 0;
      } else {
        throw err;
      }
    }
  }
}

export class SearchWebClient<T, S extends SearchModel> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    this.formatSearch = this.formatSearch.bind(this);
    this.search = this.search.bind(this);
    this.buildSearchResult = this.buildSearchResult.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
    } else {
      const m = build(model);
      this._metamodel = m;
    }
  }
  protected _metamodel: MetaModel;

  protected formatSearch(s: any) {

  }

  async search(s: S): Promise<SearchResult<T>> {
    this.formatSearch(s);
    if (this._metamodel && s.fields && s.fields.length > 0) {
      if (this._metamodel.keys && this._metamodel.keys.length > 0) {
        for (const key of this._metamodel.keys) {
          if (s.fields.indexOf(key) < 0) {
            s.fields.push(key);
          }
        }
      }
    }
    const s2 = optimizeSearchModel(s);
    const keys2 = Object.keys(s2);
    if (keys2.length === 0) {
      const searchUrl = this.serviceUrl + '/search';
      const res: string|SearchResult<T> = await this.http.get(searchUrl);
      if (typeof res === 'string') {
        return fromCsv<T>(s, res);
      } else {
        return this.buildSearchResult(res);
      }
    } else {
      const params = param(s2);
      const searchUrl = this.serviceUrl + '/search' + '?' + params;
      if (searchUrl.length <= 1) {
        const res: string|SearchResult<T> = await this.http.get(searchUrl);
        if (typeof res === 'string') {
          return fromCsv<T>(s, res);
        } else {
          return this.buildSearchResult(res);
        }
      } else {
        const postSearchUrl = this.serviceUrl + '/search';
        const res: string|SearchResult<T> = await this.http.post<string|SearchResult<T>>(postSearchUrl, s2);
        if (typeof res === 'string') {
          return fromCsv<T>(s, res);
        } else {
          return this.buildSearchResult(res);
        }
      }
    }
  }

  protected buildSearchResult(r: SearchResult<T>): SearchResult<T> {
    if (r != null && r.results != null && r.results.length > 0) {
      this.formatObjects(r.results);
    }
    return r;
  }

  protected formatObjects(list: any[]): any[] {
    if (!list || list.length === 0) {
      return list;
    }
    if (this._metamodel) {
      for (const obj of list) {
        json(obj, this._metamodel);
      }
    }
    return list;
  }
}

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}

export class DiffWebClient<T, ID>  {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected metadata: Metadata, metaModel?: MetaModel) {
    this.diff = this.diff.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._ids = metaModel.keys;
      this._metaModel = metaModel;
    } else {
      const m = build(metadata);
      this._metaModel = m;
      this._ids = m.keys;
    }
  }
  protected _ids: string[];
  private _metaModel: MetaModel;
  keys(): string[] {
    return this._ids;
  }
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    let url = this.serviceUrl + '/' + id + '/diff';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
      url = url + '/diff';
    }
    try {
      const res = await this.http.get<DiffModel<any, ID>>(url);
      if (!res) {
        return null;
      }
      if (!res.value) {
        res.value = {};
      }
      if (typeof res.value === 'string') {
          res.value = JSON.parse(res.value);
      }
      if (!res.origin) {
        res.origin = {};
      }
      if (typeof res.origin === 'string') {
        res.origin = JSON.parse(res.origin);
      }
      if (res.value) {
        json(res.value, this._metaModel);
      }
      if (res.origin) {
        json(res.origin, this._metaModel);
      }
      return res;
    } catch (err) {
      if (err && err.status === 404) {
        return null;
      } else {
        throw err;
      }
    }
  }
}

export enum Status {
  DataNotFound = 0,
  Success = 1,
  Error = 2,
  DataVersionError = 4,
}

export class ApprWebClient<ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, ids?: string[]) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this._keys = (ids ? ids : keys(model));
  }
  protected _keys: string[];

  async approve(id: ID): Promise<Status> {
    let url = this.serviceUrl + '/' + id + '/approve';
    if (this._keys && this._keys.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._keys) {
        url = url + '/' + id[name];
      }
      url = url + '/approve';
    }
    try {
      const res = await this.http.get<Status>(url);
      return res;
    } catch (err) {
      if (err && err.status === 404) {
        return Status.DataNotFound;
      } else {
        return Status.Error;
      }
    }
  }
  async reject(id: ID): Promise<Status> {
    let url = this.serviceUrl + '/' + id + '/reject';
    if (this._keys && this._keys.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._keys) {
        url = url + '/' + id[name];
      }
      url = url + '/reject';
    }
    try {
      const res = await this.http.get<Status>(url);
      return res;
    } catch (err) {
      if (err && err.status === 404) {
        return Status.DataNotFound;
      } else {
        return Status.Error;
      }
    }
  }
}

export class DiffApprWebClient<T, ID> extends DiffWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.apprWebClient = new ApprWebClient(serviceUrl, http, null, this._ids);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private apprWebClient: ApprWebClient<ID>;
  approve(id: ID, ctx?: any): Promise<Status> {
    return this.apprWebClient.approve(id);
  }
  reject(id: ID, ctx?: any): Promise<Status> {
    return this.apprWebClient.reject(id);
  }
}

export class ViewSearchWebClient<T, ID, S extends SearchModel> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.search = this.search.bind(this);
    this.searchWebClient = new SearchWebClient<T, S>(serviceUrl, http, null, this._metamodel);
  }
  protected searchWebClient: SearchWebClient<T, S>;

  search(s: S): Promise<SearchResult<T>> {
    return this.searchWebClient.search(s);
  }
}

export class GenericSearchWebClient<T, ID, R, S extends SearchModel> extends GenericWebClient<T, ID, R> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.search = this.search.bind(this);
    this.searchWebClient = new SearchWebClient<T, S>(serviceUrl, http, null, this._metamodel);
  }
  protected searchWebClient: SearchWebClient<T, S>;

  search(s: S): Promise<SearchResult<T>> {
    return this.searchWebClient.search(s);
  }
}

export class ViewSearchDiffApprWebClient<T, ID, R, S extends SearchModel> extends ViewSearchWebClient<T, ID, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, this._metamodel);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprWebClient<T, ID>;
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    return this.diffWebClient.diff(id);
  }

  async approve(id: ID): Promise<Status> {
    return this.diffWebClient.approve(id);
  }

  async reject(id: ID): Promise<Status> {
    return this.diffWebClient.reject(id);
  }
}

export class GenericSearchDiffApprWebClient<T, ID, R, S extends SearchModel> extends GenericSearchWebClient<T, ID, R, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, this._metamodel);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprWebClient<T, ID>;
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    return this.diffWebClient.diff(id);
  }

  async approve(id: ID): Promise<Status> {
    return this.diffWebClient.approve(id);
  }

  async reject(id: ID): Promise<Status> {
    return this.diffWebClient.reject(id);
  }
}
