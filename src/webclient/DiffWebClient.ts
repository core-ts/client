import {HttpRequest} from '../http/HttpRequest';
import {build, json, Metadata, MetaModel} from './json';

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
      if (err && err.status === 404) {
        return null;
      } else {
        throw err;
      }
    }
  }
}
