import {HttpRequest} from '../http/HttpRequest';
import {buildKeys, Metadata, MetaModel} from './json';

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
        if (err.status === 404 || err.status === 410) {
          return Status.NotFound;
        } else if (err.status === 409) {
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
        if (err.status === 404 || err.status === 410) {
          return Status.NotFound;
        } else if (err.status === 409) {
          return Status.VersionError;
        }
      }
      return Status.Error;
    }
  }
}
