import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {SearchUtil} from '../util/SearchUtil';
import {WebParameterUtil} from '../util/WebParameterUtil';
import {Metadata, MetadataUtil, MetaModel} from './MetadataUtil';

export class SearchWebClient<T, S extends SearchModel> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    this.formatSearch = this.formatSearch.bind(this);
    this.search = this.search.bind(this);
    this.buildSearchResult = this.buildSearchResult.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
    } else {
      const metaModel2 = MetadataUtil.buildMetaModel(model);
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
