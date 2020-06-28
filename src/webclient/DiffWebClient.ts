import {HttpRequest} from '../http/HttpRequest';
import {Metadata, MetadataUtil, MetaModel} from './MetadataUtil';

export interface DiffModel<T, ID> {
  id?: ID;
  oldValue?: T;
  newValue: T;
}

export class DiffWebClient<T, ID>  {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected metadata: Metadata, ids?: string[], metaModel?: MetaModel) {
    this.diff = this.diff.bind(this);
    this._ids = (ids ? ids : MetadataUtil.ids(metadata));
    if (metaModel) {
      this._metaModel = metaModel;
    } else {
      this._metaModel = MetadataUtil.buildMetaModel(metadata);
    }
  }
  protected _ids: string[];
  private _metaModel: MetaModel;
  ids(): string[] {
    return this._ids;
  }
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    let url = this.serviceUrl + '/' + id + '/diff';
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
      url = url + '/diff';
    }
    try {
      const res = await this.http.get<DiffModel<any, ID>>(url);
      if (!res) {
        return null;
      }
      if (!res.newValue) {
        res.newValue = {};
      }
      if (typeof res.newValue === 'string') {
          res.newValue = JSON.parse(res.newValue);
      }
      if (!res.oldValue) {
        res.oldValue = {};
      }
      if (typeof res.oldValue === 'string') {
        res.oldValue = JSON.parse(res.oldValue);
      }
      if (res.newValue) {
        MetadataUtil.json(res.newValue, this._metaModel);
      }
      if (res.oldValue) {
        MetadataUtil.json(res.oldValue, this._metaModel);
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
