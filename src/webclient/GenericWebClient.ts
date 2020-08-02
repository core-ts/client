import {HttpRequest} from '../http/HttpRequest';
import {json, Metadata, MetaModel} from './json';
import {ViewWebClient} from './ViewWebClient';

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
    let url = this.serviceUrl;
    const keys = this.keys();
    if (keys && keys.length > 0) {
      for (const name of keys) {
        url += '/' + obj[name];
      }
    }
    try {
      const res = await this.http.put<R>(url, obj);
      return this.formatResultInfo(res, ctx);
    } catch (err) {
      if (err) {
        if (err.status === 404 || err.status === 410) {
          const x: any = 0;
          return x;
        } else if (err.status === 409) {
          const x: any = -1;
          return x;
        }
      }
      throw err;
    }
  }

  async patch(obj: T, ctx?: any): Promise<R> {
    let url = this.serviceUrl;
    const keys = this.keys();
    if (keys && keys.length > 0) {
      for (const name of keys) {
        url += '/' + obj[name];
      }
    }
    try {
      const res = await this.http.patch<R>(url, obj);
      return this.formatResultInfo(res, ctx);
    } catch (err) {
      if (err) {
        if (err.status === 404 || err.status === 410) {
          const x: any = 0;
          return x;
        } else if (err.status === 409) {
          const x: any = -1;
          return x;
        }
      }
      throw err;
    }
  }

  async delete(id: ID, ctx?: any): Promise<number> {
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
      if (err && (err.status === 404 || err.status === 410)) {
        return 0;
      } else {
        throw err;
      }
    }
  }
}
