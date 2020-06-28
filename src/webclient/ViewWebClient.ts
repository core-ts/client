import {HttpRequest} from '../http/HttpRequest';
import {Metadata, MetadataUtil, MetaModel} from './MetadataUtil';

export class ViewWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata) {
    this.metadata = this.metadata.bind(this);
    this.ids = this.ids.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.formatObject = this.formatObject.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    const metaModel = MetadataUtil.buildMetaModel(this.model);
    const keys = metaModel.primaryKeys;
    if (keys) {
      for (const key of keys) {
        if (key.name && key.name.length > 0) {
          this._ids.push(key.name);
        }
      }
    }
    this._metamodel = metaModel;
  }
  private _ids: string[] = [];
  protected _metamodel: MetaModel;

  ids(): string[] {
    return this._ids;
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
    if (this._ids && this._ids.length > 0 && typeof id === 'object') {
      url = this.serviceUrl;
      for (const name of this._ids) {
        url = url + '/' + id[name];
      }
    }
    try {
      const res = await this.http.get(url);
      return this.formatObject(res);
    } catch (err) {
      if (err && err.status === 404) {
        return null;
      } else {
        throw err;
      }
    }
  }

  protected formatObjects(list: any[]): any[] {
    if (!list || list.length === 0) {
      return list;
    }
    for (const obj of list) {
      MetadataUtil.json(obj, this._metamodel);
    }
    return list;
  }

  protected formatObject(obj): any {
    MetadataUtil.json(obj, this._metamodel);
    return obj;
  }
}
