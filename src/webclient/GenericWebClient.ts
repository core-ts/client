import {HttpRequest} from '../http/HttpRequest';
import {Metadata, json} from './json';
import {ViewWebClient} from './ViewWebClient';

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
    const res = await this.http.put<R>(url, obj);
    return this.formatResultInfo(res);
  }

  async patch(obj: T): Promise<R> {
    let url = this.serviceUrl;
    const keys = this.keys();
    if (keys && keys.length > 0) {
      for (const name of keys) {
        url += '/' + obj[name];
      }
    }
    const res = await this.http.patch<R>(url, obj);
    return this.formatResultInfo(res);
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
        return null;
      } else {
        throw err;
      }
    }
  }
}
