import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {param} from '../util/param';
import {fromCsv, optimizeSearchModel} from '../util/search';
import {build, json, jsonArray, Metadata, MetaModel} from './json';

export class SearchWebClient<T, S extends SearchModel> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
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
      const searchUrl = this.serviceUrl + '/search';
      const res: string|SearchResult<T> = await this.http.get(searchUrl);
      return buildSearchResult(s, res, this._metamodel);
    } else {
      const params = this.makeUrlParameters(s2);
      const searchUrl = this.serviceUrl + '/search' + '?' + params;
      // const searchUrl = this.serviceUrl + '' + '?' + params;
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
