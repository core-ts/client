import {HttpRequest} from '../http/HttpRequest';
import {build, json, Metadata, MetaModel} from './json';

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
