import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {Status} from './ApprWebClient';
import {DiffApprWebClient} from './DiffApprWebClient';
import {DiffModel} from './DiffWebClient';
import {Metadata, MetaModel} from './json';
import {ViewSearchWebClient} from './ViewSearchWebClient';

export class ViewSearchDiffApprWebClient<T, ID, R, S extends SearchModel> extends ViewSearchWebClient<T, ID, S> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, this._metamodel);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprWebClient<T, ID>;
  async diff(id: ID): Promise<DiffModel<T, ID>> {
    return this.diffWebClient.diff(id);
  }

  async approve(id: ID): Promise<Status> {
    return this.diffWebClient.approve(id);
  }

  async reject(id: ID): Promise<Status> {
    return this.diffWebClient.reject(id);
  }
}
