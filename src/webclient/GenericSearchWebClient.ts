import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {GenericWebClient} from './GenericWebClient';
import {Metadata, MetaModel} from './json';
import {SearchWebClient} from './SearchWebClient';

export class GenericSearchWebClient<T, ID, R, S extends SearchModel> extends SearchWebClient<T, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model, metamodel, searchGet);
    this.genericWebClient = new GenericWebClient<T, ID, R>(serviceUrl, http, model, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }
  protected genericWebClient: GenericWebClient<T, ID, R>;

  keys(): string[] {
    return this.genericWebClient.keys();
  }
  metadata(): Metadata {
    return this.genericWebClient.metadata();
  }
  all(ctx?: any): Promise<T[]> {
    return this.genericWebClient.all(ctx);
  }
  load(id: ID, ctx?: any): Promise<T> {
    return this.genericWebClient.load(id, ctx);
  }

  insert(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.insert(obj, ctx);
  }
  update(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.update(obj, ctx);
  }
  patch(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.patch(obj, ctx);
  }
  delete(id: ID, ctx?: any): Promise<number> {
    return this.genericWebClient.delete(id, ctx);
  }
}
