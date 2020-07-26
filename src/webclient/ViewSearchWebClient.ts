import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {Metadata, MetaModel} from './json';
import {SearchWebClient} from './SearchWebClient';
import {ViewWebClient} from './ViewWebClient';

export class ViewSearchWebClient<T, ID, S extends SearchModel> extends SearchWebClient<T, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metamodel?: MetaModel, searchGet?: boolean) {
    super(serviceUrl, http, model, metamodel, searchGet);
    this.viewWebClient = new ViewWebClient<T, ID>(serviceUrl, http, model, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
  }
  protected viewWebClient: ViewWebClient<T, ID>;

  keys(): string[] {
    return this.viewWebClient.keys();
  }
  metadata(): Metadata {
    return this.viewWebClient.metadata();
  }

  all(ctx?: any): Promise<T[]> {
    return this.viewWebClient.all(ctx);
  }

  load(id: ID, ctx?: any): Promise<T> {
    return this.viewWebClient.load(id, ctx);
  }
}
