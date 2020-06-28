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

export class CsvUtil {
  private static _csvService: CsvService;
  static setCsvService(csvService: CsvService) {
    CsvUtil._csvService = csvService;
  }
  static fromString(value: string): Promise<string[][]> {
    return CsvUtil._csvService.fromString(value);
  }
}
