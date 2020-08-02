import {HttpRequest} from '../http/HttpRequest';
import {build, json, jsonArray, Metadata, MetaModel} from './json';

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
      if (err && (err.status === 404 || err.status === 410)) {
        return null;
      }
      throw err;
    }
  }
}
