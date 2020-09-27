import {build, buildKeys, json, jsonArray, Metadata, MetaModel} from './json';

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
  const ks = Object.keys(obj);
  const arrs = [];
  for (const key of ks) {
    if (key === 'fields') {
      if (Array.isArray(obj[key])) {
        const x = obj[key].join(',');
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      }
    } else if (key === 'excluding') {
      const t2 = obj[key];
      if (typeof t2 === 'object') {
        for (const k2 of t2) {
          const v = t2[k2];
          if (Array.isArray(v)) {
            const arr = [];
            for (const y of v) {
              if (y) {
                if (typeof y === 'string') {
                  arr.push(y);
                } else if (typeof y === 'number') {
                  arr.push(y.toString());
                }
              }
            }
            const x = arr.join(',');
            const str = encodeURIComponent('excluding.' + k2) + '=' + encodeURIComponent(x);
            arrs.push(str);
          } else {
            const str = encodeURIComponent('excluding.' + k2) + '=' + encodeURIComponent(v);
            arrs.push(str);
          }
        }
      }
    } else {
      const v = obj[key];
      if (Array.isArray(v)) {
        const arr = [];
        for (const y of v) {
          if (y) {
            if (typeof y === 'string') {
              arr.push(y);
            } else if (typeof y === 'number') {
              arr.push(y.toString());
            }
          }
        }
        const x = arr.join(',');
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      } else {
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(v);
        arrs.push(str);
      }
    }
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
  const ks = Object.keys(s);
  const o: any = {};
  for (const key of ks) {
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
  if (o.page <= 1) {
    delete o['page'];
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
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, metamodel?: MetaModel) {
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    if (metamodel) {
      this._metamodel = metamodel;
      this._keys = metamodel.keys;
    } else {
      const m = build(this.model);
      this._metamodel = m;
      this._keys = m.keys;
    }
  }
  private _keys: string[] = [];
  protected _metamodel: MetaModel;

  keys(): string[] {
    return this._keys;
  }
  metadata(): Metadata {
    return this.model;
  }

  async all(ctx?: any): Promise<T[]> {
    const list = await this.http.get<T[]>(this.serviceUrl);
    return jsonArray(list, this._metamodel);
  }

  async load(id: ID, ctx?: any): Promise<T> {
    try {
      let url = this.serviceUrl + '/' + id;
      if (this._keys && this._keys.length > 0 && typeof id === 'object') {
        url = this.serviceUrl;
        for (const name of this._keys) {
          url = url + '/' + id[name];
        }
      }
      const obj = await this.http.get<T>(url);
      return json(obj, this._metamodel);
    } catch (err) {
      const data = (err &&  err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    }
  }
}

export class GenericWebClient<T, ID, R> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel) {
    super(serviceUrl, http, model, metamodel);
    this.formatResultInfo = this.formatResultInfo.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }

  protected formatResultInfo(result: any, ctx?: any): any {
    if (result && typeof result === 'object' && result.status === 1 && result.value && typeof result.value === 'object') {
      result.value = json(result.value, this._metamodel);
    }
    return result;
  }

  async insert(obj: T, ctx?: any): Promise<R> {
    json(obj, this._metamodel);
    const res = await this.http.post<R>(this.serviceUrl, obj);
    return this.formatResultInfo(res, ctx);
  }

  async update(obj: T, ctx?: any): Promise<R> {
    try {
      let url = this.serviceUrl;
      const ks = this.keys();
      if (ks && ks.length > 0) {
        for (const name of ks) {
          url += '/' + obj[name];
        }
      }
      const res = await this.http.put<R>(url, obj);
      return this.formatResultInfo(res, ctx);
    } catch (err) {
      if (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          const x: any = 0;
          return x;
        } else if (data.status === 409) {
          const x: any = -1;
          return x;
        }
      }
      throw err;
    }
  }

  async patch(obj: T, ctx?: any): Promise<R> {
    try {
      let url = this.serviceUrl;
      const ks = this.keys();
      if (ks && ks.length > 0) {
        for (const name of ks) {
          url += '/' + obj[name];
        }
      }
      const res = await this.http.patch<R>(url, obj);
      return this.formatResultInfo(res, ctx);
    } catch (err) {
      if (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          const x: any = 0;
          return x;
        } else if (data.status === 409) {
          const x: any = -1;
          return x;
        }
      }
      throw err;
    }
  }

  async delete(id: ID, ctx?: any): Promise<number> {
    try {
      let url = this.serviceUrl + '/' + id;
      if (typeof id === 'object' && this.model) {
        const ks = this.keys();
        if (ks && ks.length > 0) {
          url = this.serviceUrl;
          for (const key of ks) {
            url = url + '/' + id[key];
          }
        }
      }
      const res = await this.http.delete<number>(url);
      return res;
    } catch (err) {
      if (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data && (data.status === 404 || data.status === 410)) {
          return 0;
        } else if (data.status === 409) {
          return -1;
        }
      }
      throw err;
    }
  }
}

export class SearchWebClient<T, S extends SearchModel> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, model: Metadata, metaModel?: MetaModel, protected searchGet?: boolean) {
    this.formatSearch = this.formatSearch.bind(this);
    this.makeUrlParameters = this.makeUrlParameters.bind(this);
    this.postOnly = this.postOnly.bind(this);
    this.search = this.search.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
    } else {
      const metaModel2 = build(model);
      this._metamodel = metaModel2;
    }
  }
  protected _metamodel: MetaModel;

  protected postOnly(s: S): boolean {
    return false;
  }

  protected formatSearch(s: any) {

  }
  protected makeUrlParameters(s: S): string {
    return param(s);
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
    if (this.postOnly(s2)) {
      const postSearchUrl = this.serviceUrl + '/search';
      const res: string|SearchResult<T> = await this.http.post<string|SearchResult<T>>(postSearchUrl, s2);
      return buildSearchResult(s, res, this._metamodel);
    }
    const keys2 = Object.keys(s2);
    if (keys2.length === 0) {
      const searchUrl = (this.searchGet ? this.serviceUrl + '/search' : this.serviceUrl);
      const res: string|SearchResult<T> = await this.http.get(searchUrl);
      return buildSearchResult(s, res, this._metamodel);
    } else {
      const params = this.makeUrlParameters(s2);
      let searchUrl = (this.searchGet ? this.serviceUrl + '/search' : this.serviceUrl);
      searchUrl = searchUrl + '?' + params;
      if (searchUrl.length <= 255) {
        const res: string|SearchResult<T> = await this.http.get(searchUrl);
        return buildSearchResult(s, res, this._metamodel);
      } else {
        const postSearchUrl = this.serviceUrl + '/search';
        const res: string|SearchResult<T> = await this.http.post<string|SearchResult<T>>(postSearchUrl, s2);
        return buildSearchResult(s, res, this._metamodel);
      }
    }
  }
}
export function buildSearchResult<T, S extends SearchModel>(s: S, res: string|SearchResult<T>|T[], metamodel: MetaModel): SearchResult<T>|Promise<SearchResult<T>> {
  if (typeof res === 'string') {
    return fromCsv<T>(s, res);
  } else {
    if (Array.isArray(res)) {
      const result: SearchResult<T> = {
        results: res,
        total: res.length
      };
      return jsonSearchResult(result, metamodel);
    } else {
      return jsonSearchResult(res, metamodel);
    }
  }
}
export function jsonSearchResult<T>(r: SearchResult<T>, metamodel: MetaModel): SearchResult<T> {
  if (r != null && r.results != null && r.results.length > 0) {
    jsonArray(r.results, metamodel);
  }
  return r;
}


export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}
export class DiffWebClient<T, ID>  {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected metadata: Metadata, metaModel?: MetaModel, _keys?: string[]) {
    this.diff = this.diff.bind(this);
    if (metaModel) {
      this._metaModel = metaModel;
      this._ids = metaModel.keys;
    } else if (metadata) {
      this._metaModel = build(metadata);
      this._ids = this._metaModel.keys;
    }
    if (!this._ids && _keys) {
      this._ids = _keys;
    }
  }
  protected _ids: string[];
  protected _metaModel: MetaModel;
  keys(): string[] {
    return this._ids;
  }
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    try {
      let url = this.serviceUrl + '/' + id + '/diff';
      if (this._ids && this._ids.length > 0 && typeof id === 'object') {
        url = this.serviceUrl;
        for (const name of this._ids) {
          url = url + '/' + id[name];
        }
        url = url + '/diff';
      }
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
      const data = (err &&  err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      } else {
        throw err;
      }
    }
  }
}

export enum Status {
  NotFound = 0,
  Success = 1,
  VersionError = 2,
  Error = 4
}
export class ApprWebClient<ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, metaModel?: MetaModel, _ids?: string[]) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._keys = metaModel.keys;
    } else if (_ids) {
      this._keys = _ids;
    } else if (model) {
      this._keys = buildKeys(model);
    } else {
      this._keys = [];
    }
  }
  protected _keys: string[];
  keys(): string[] {
    return this._keys;
  }

  async approve(id: ID): Promise<Status> {
    try {
      let url = this.serviceUrl + '/' + id + '/approve';
      if (this._keys && this._keys.length > 0 && typeof id === 'object') {
        url = this.serviceUrl;
        for (const name of this._keys) {
          url = url + '/' + id[name];
        }
        url = url + '/approve';
      }
      const res = await this.http.get<Status>(url);
      return res;
    } catch (err) {
      if (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return Status.NotFound;
        } else if (data.status === 409) {
          return Status.VersionError;
        }
      }
      return Status.Error;
    }
  }
  async reject(id: ID): Promise<Status> {
    try {
      let url = this.serviceUrl + '/' + id + '/reject';
      if (this._keys && this._keys.length > 0 && typeof id === 'object') {
        url = this.serviceUrl;
        for (const name of this._keys) {
          url = url + '/' + id[name];
        }
        url = url + '/reject';
      }
      const res = await this.http.get<Status>(url);
      return res;
    } catch (err) {
      if (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return Status.NotFound;
        } else if (data.status === 409) {
          return Status.VersionError;
        }
      }
      return Status.Error;
    }
  }
}

export class DiffApprWebClient<T, ID> extends DiffWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, metaModel?: MetaModel, keys?: string[]) {
    super(serviceUrl, http, model, metaModel, keys);
    this.apprWebClient = new ApprWebClient(serviceUrl, http, model, this._metaModel, this._ids);
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

export class ViewSearchWebClient<T, ID, S extends SearchModel> extends SearchWebClient<T, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model, metamodel, searchGet);
    this.viewWebClient = new ViewWebClient<T, ID>(serviceUrl, http, model, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
  }
  protected viewWebClient: ViewWebClient<T, ID>;

  keys(): string[] {
    return this.viewWebClient.keys();
  }
  metadata(): Metadata {
    return this.viewWebClient.metadata();
  }

  all(ctx?: any): Promise<T[]> {
    return this.viewWebClient.all(ctx);
  }

  load(id: ID, ctx?: any): Promise<T> {
    return this.viewWebClient.load(id, ctx);
  }
}

export class GenericSearchWebClient<T, ID, R, S extends SearchModel> extends SearchWebClient<T, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model, metamodel, searchGet);
    this.genericWebClient = new GenericWebClient<T, ID, R>(serviceUrl, http, model, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }
  protected genericWebClient: GenericWebClient<T, ID, R>;

  keys(): string[] {
    return this.genericWebClient.keys();
  }
  metadata(): Metadata {
    return this.genericWebClient.metadata();
  }
  all(ctx?: any): Promise<T[]> {
    return this.genericWebClient.all(ctx);
  }
  load(id: ID, ctx?: any): Promise<T> {
    return this.genericWebClient.load(id, ctx);
  }

  insert(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.insert(obj, ctx);
  }
  update(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.update(obj, ctx);
  }
  patch(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.patch(obj, ctx);
  }
  delete(id: ID, ctx?: any): Promise<number> {
    return this.genericWebClient.delete(id, ctx);
  }
}

export class ViewSearchDiffApprWebClient<T, ID, S extends SearchModel> extends ViewSearchWebClient<T, ID, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model, metamodel, searchGet);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, model, this._metamodel, this.keys());
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
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, model, this._metamodel, this.keys());
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
