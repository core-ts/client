import {Metadata, MetadataUtil, MetaModel} from './MetadataUtil';

export interface SearchModel {
  keyword: string;
  sortField: string;
  sortType: string;
  pageIndex: number;
  pageSize: number;
  initPageSize: number;
  fields: string[];
  excluding: any;
}

export interface SearchResult<T> {
  itemTotal: number;
  results: T[];
  lastPage: boolean;
}

export class WebParameterUtil {
  public static param(obj: any): string {
    const keys = Object.keys(obj);
    const arrs = [];
    for (const item of keys) {
      const str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
      arrs.push(str);
    }
    return arrs.join('&');
  }
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

export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise( resolve => {
      this._csv({noheader: true, output: 'csv'}).fromString(value).then(v => resolve(v));
    });
  }
}

export class CsvUtil {
  private static _csvService: CsvService;
  static setCsvService(csvService: CsvService) {
    CsvUtil._csvService = csvService;
  }
  static fromString(value: string): Promise<string[][]> {
    return CsvUtil._csvService.fromString(value);
  }
}

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

export class ViewWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata) {
    this.metadata = this.metadata.bind(this);
    this.ids = this.ids.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.formatObject = this.formatObject.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    const metaModel = MetadataUtil.getMetaModel(this.model);
    const keys = metaModel.primaryKeys;
    if (keys) {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].name && keys[i].name.length > 0) {
          this._ids.push(keys[i].name);
        }
      }
    }
    this._metamodel = metaModel;
  }
  private _ids: string[] = [];
  protected _metamodel: MetaModel;

  ids(): string[] {
    return this._ids;
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
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
    }
    const res = await this.http.get(url);
    return this.formatObject(res);
  }

  protected formatObjects(list: any[]): any[] {
    if (!list || list.length === 0) {
      return list;
    }
    for (const obj of list) {
      MetadataUtil.json(obj, this._metamodel);
    }
    return list;
  }

  protected formatObject(obj): any {
    MetadataUtil.json(obj, this._metamodel);
    return obj;
  }
}

export class GenericWebClient<T, ID, R> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata) {
    super(serviceUrl, http, model);
    this.formatResultInfo = this.formatResultInfo.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }

  protected formatResultInfo(result: any): any {
    if (result.status === 1 && result.value) {
      result.value = MetadataUtil.json(result.value, this._metamodel);
    }
    return result;
  }

  async insert(obj: T): Promise<R> {
    MetadataUtil.json(obj, this._metamodel);
    const res = await this.http.post<R>(this.serviceUrl, obj);
    return this.formatResultInfo(res);
  }

  async update(obj: T): Promise<R> {
    const metadata = this.metadata();
    let url = this.serviceUrl;
    for (const item of this._metamodel.primaryKeys) {
      url += '/' + obj[item.name];
    }
    const res = await this.http.put<R>(url, obj);
    return this.formatResultInfo(res);
  }

  async patch(obj: T, body: object): Promise<R> {
    const metadata = this.metadata();
    let url = this.serviceUrl;
    for (const item of this._metamodel.primaryKeys) {
      url += '/' + obj[item.name];
    }
    const res = await this.http.patch<R>(url, body);
    return this.formatResultInfo(res);
  }

  delete(id: ID): Promise<number> {
    let url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && this.model) {
      if (this._metamodel.primaryKeys && this._metamodel.primaryKeys.length > 0) {
        url = this.serviceUrl;
        for (const key of this._metamodel.primaryKeys) {
          url = url + '/' + id[key.name];
        }
      }
    }
    return this.http.delete<number>(url);
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
      const metaModel2 = MetadataUtil.getMetaModel(model);
      this._metamodel = metaModel2;
    }
  }
  protected _metamodel: MetaModel;

  protected formatSearch(s: any) {

  }

  async search(s: S): Promise<SearchResult<T>> {
    this.formatSearch(s);
    if (this._metamodel && s.fields && s.fields.length > 0) {
      if (this._metamodel.primaryKeys && this._metamodel.primaryKeys.length > 0) {
        for (const id of this._metamodel.primaryKeys) {
          if (s.fields.indexOf(id.name) < 0) {
            s.fields.push(id.name);
          }
        }
      }
    }
    const s2 = SearchUtil.optimizeSearchModel(s);
    const keys2 = Object.keys(s2);
    if (keys2.length === 0) {
      const searchUrl = this.serviceUrl + '/search';
      const res: string|SearchResult<T> = await this.http.get(searchUrl);
      if (typeof res === 'string') {
        return SearchUtil.fromCsv<T>(s, res);
      } else {
        return this.buildSearchResult(res);
      }
    } else {
      const params = WebParameterUtil.param(s2);
      const searchUrl = this.serviceUrl + '/search' + '?' + params;
      if (searchUrl.length <= 1) {
        const res: string|SearchResult<T> = await this.http.get(searchUrl);
        if (typeof res === 'string') {
          return SearchUtil.fromCsv<T>(s, res);
        } else {
          return this.buildSearchResult(res);
        }
      } else {
        const postSearchUrl = this.serviceUrl + '/search';
        const res: string|SearchResult<T> = await this.http.post<string|SearchResult<T>>(postSearchUrl, s2);
        if (typeof res === 'string') {
          return SearchUtil.fromCsv<T>(s, res);
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
        MetadataUtil.json(obj, this._metamodel);
      }
    }
    return list;
  }
}

export interface DiffModel<T, Id> {
  id: Id;
  oldValue: T;
  newValue: T;
}

export class DiffWebClient<T, ID>  {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, ids?: string[]) {
    this.diff = this.diff.bind(this);
    this._ids = (ids ? ids : MetadataUtil.ids(model));
  }
  private _ids: string[];
  ids(): string[] {
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
    const res = await this.http.get<DiffModel<any, ID>>(url);
    if (!res.newValue) {
      res.newValue = {};
    }
    if (typeof res.newValue === 'string') {
        res.newValue = JSON.parse(res.newValue);
    }
    if (!res.oldValue) {
      res.oldValue = {};
    }
    if (typeof res.oldValue === 'string') {
      res.oldValue = JSON.parse(res.oldValue);
    }
    return res;
  }
}

export enum StatusCode {
  DataNotFound = 0,
  Success = 1,
  Error = 2,
  DataVersionError = 4,
}

export class ApprWebClient<ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, ids?: string[]) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this._ids = (ids ? ids : MetadataUtil.ids(model));
  }
  protected _ids: string[];
  ids(): string[] {
    return this._ids;
  }

  async approve(id: ID): Promise<StatusCode> {
    let url = this.serviceUrl + '/' + id + '/approve';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
      url = url + '/approve';
    }
    const res = await this.http.get<StatusCode>(url);
    return res;
  }

  async reject(id: ID): Promise<StatusCode> {
    let url = this.serviceUrl + '/' + id + '/reject';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
      url = url + '/reject';
    }
    const res = await this.http.get<StatusCode>(url);
    return res;
  }
}

export class DiffApprWebClient<T, ID> extends ApprWebClient<ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, ids?: string[]) {
    super(serviceUrl, http, model, ids);
    this.diffWebClient = new DiffWebClient(serviceUrl, http, null, this._ids);
    this.diff = this.diff.bind(this);
  }
  private diffWebClient: DiffWebClient<T, ID>;
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    return this.diffWebClient.diff(id);
  }
}

export class ViewSearchWebClient<T, ID, S extends SearchModel> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata) {
    super(serviceUrl, http, model);
    this.searchWebClient = new SearchWebClient<T, S>(serviceUrl, http, null, this._metamodel);
  }
  protected searchWebClient: SearchWebClient<T, S>;

  search(s: S): Promise<SearchResult<T>> {
    return this.searchWebClient.search(s);
  }
}

export class GenericSearchWebClient<T, ID, R, S extends SearchModel> extends GenericWebClient<T, ID, R> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata) {
    super(serviceUrl, http, model);
    this.searchWebClient = new SearchWebClient<T, S>(serviceUrl, http, null, this._metamodel);
  }

  protected searchWebClient: SearchWebClient<T, S>;

  search(s: S): Promise<SearchResult<T>> {
    return this.searchWebClient.search(s);
  }
}

export class GenericSearchDiffApprWebClient<T, ID, R, S extends SearchModel> extends GenericSearchWebClient<T, ID, R, S> {
  constructor(serviceUrl: string, model: Metadata, http: HttpRequest) {
    super(serviceUrl, http, model);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, this.ids());
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprWebClient<T, ID>;
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    return this.diffWebClient.diff(id);
  }

  async approve(id: ID): Promise<StatusCode> {
    return this.diffWebClient.approve(id);
  }

  async reject(id: ID): Promise<StatusCode> {
    return this.diffWebClient.reject(id);
  }
}
