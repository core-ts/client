import {HttpRequest} from '../http/HttpRequest';
import {Metadata, MetadataUtil} from './MetadataUtil';

export enum Status {
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

  async approve(id: ID): Promise<Status> {
    let url = this.serviceUrl + '/' + id + '/approve';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
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
        throw err;
      }
    }
  }
  async reject(id: ID): Promise<Status> {
    let url = this.serviceUrl + '/' + id + '/reject';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
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
        throw err;
      }
    }
  }
}
