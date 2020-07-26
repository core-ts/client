import {HttpRequest} from '../http/HttpRequest';
import {keys, Metadata} from './json';

export enum Status {
  DataNotFound = 0,
  Success = 1,
  Error = 2,
  DataVersionError = 4,
}

export class ApprWebClient<ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, _keys?: string[]) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.keys = this.keys.bind(this);
    this._keys = (_keys ? _keys : keys(model));
  }
  protected _keys: string[];
  keys(): string[] {
    return this._keys;
  }

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
