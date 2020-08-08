export interface CsvService {
  fromString(value: string): Promise<string[][]>;
}
// tslint:disable-next-line:class-name
export class resource {
  static csv: CsvService;
}
export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
    this.fromString = this.fromString.bind(this);
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise( resolve => {
      this._csv({noheader: true, output: 'csv'}).fromString(value).then(v => resolve(v));
    });
  }
}
export function fromString(value: string): Promise<string[][]> {
  return resource.csv.fromString(value);
}
