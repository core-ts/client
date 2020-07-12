export interface CsvService {
  fromString(value: string): Promise<string[][]>;
}

export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise( resolve => {
      this._csv({noheader: true, output: 'csv'}).fromString(value).then(v => resolve(v));
    });
  }
}

export class resource {
  static csv: CsvService;
}

export function fromString(value: string): Promise<string[][]> {
  return resource.csv.fromString(value);
}
