export interface CsvService {
  fromString(value: string): Promise<string[][]>;
}
export interface SearchConfig {
  page?: string;
  limit?: string;
  firstLimit?: string;
  total?: string;
  results?: string;
  last?: string;
}
// tslint:disable-next-line:class-name
export class resources {
  static config: SearchConfig;
  static ignoreDate?: boolean;
  static csv: CsvService | ((value: string) => Promise<string[][]>);
}

export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
    | 'boolean' | 'number' | 'integer' | 'string' | 'text'
    | 'object' | 'array' | 'primitives' | 'binary';
export interface Metadata {
  name?: string;
  attributes: Attributes;
  source?: string;
}

export interface Attribute {
  name?: string;
  type: DataType;
  key?: boolean;
  ignored?: boolean;
  typeof?: Metadata;
}
export interface Attributes {
  [key: string]: Attribute;
}

export interface MetaModel {
  model: Metadata;
  attributeName?: string;
  keys?: string[];
  dateFields?: string[];
  objectFields?: MetaModel[];
  arrayFields?: MetaModel[];
}

export function build(model: Metadata): MetaModel {
  if (model && !model.source) {
    model.source = model.name;
  }
  const primaryKeys: string[] = new Array<string>();
  const dateFields = new Array<string>();
  const objectFields = new Array<MetaModel>();
  const arrayFields = new Array<MetaModel>();
  const ids: string[] = Object.keys(model.attributes);
  for (const key of ids) {
    const attr: Attribute = model.attributes[key];
    if (attr) {
      attr.name = key;
      if (attr.ignored !== true) {
        if (attr.key === true) {
          primaryKeys.push(attr.name);
        }
      }

      switch (attr.type) {
        case 'datetime': {
          dateFields.push(attr.name);
          break;
        }
        case 'date': {
          if (resources.ignoreDate) {
            dateFields.push(attr.name);
          }
          break;
        }
        case 'object': {
          if (attr.typeof) {
            const x = build(attr.typeof);
            x.attributeName = key;
            objectFields.push(x);
          }
          break;
        }
        case 'array': {
          if (attr.typeof) {
            const y = build(attr.typeof);
            y.attributeName = key;
            arrayFields.push(y);
          }
          break;
        }
        default:
          break;
      }
    }
  }
  const metadata: MetaModel = {model};
  if (primaryKeys.length > 0) {
    metadata.keys = primaryKeys;
  }
  if (dateFields.length > 0) {
    metadata.dateFields = dateFields;
  }
  if (objectFields.length > 0) {
    metadata.objectFields = objectFields;
  }
  if (arrayFields.length > 0) {
    metadata.arrayFields = arrayFields;
  }
  return metadata;
}

export function buildKeys(model: Metadata): string[] {
  const ids: string[] = Object.keys(model.attributes);
  const pks: string[] = [];
  for (const key of ids) {
    const attr: Attribute = model.attributes[key];
    if (attr && attr.ignored !== true && attr.key === true && attr.name && attr.name.length > 0) {
      pks.push(attr.name);
    }
  }
  return pks;
}

const _rd = '/Date(';
const _rn = /-?\d+/;

function jsonToDate(obj: any, fields: string[]) {
  if (!obj || !fields) {
    return obj;
  }
  if (!Array.isArray(obj)) {
    for (const field of fields) {
      const v = obj[field];
      if (v && !(v instanceof Date)) {
        obj[field] = toDate(v);
      }
    }
  }
}

function toDate(v: any): Date {
  if (!v || v === '') {
    return null;
  }
  if (v instanceof Date) {
    return v;
  } else if (typeof v === 'number') {
    return new Date(v);
  }
  const i = v.indexOf(_rd);
  if (i >= 0) {
    const m = _rn.exec(v);
    const d = parseInt(m[0], null);
    return new Date(d);
  } else {
    if (isNaN(v)) {
      return new Date(v);
    } else {
      const d = parseInt(v, null);
      return new Date(d);
    }
  }
}

export function json(obj: any, meta?: MetaModel): any {
  if (!meta) {
    return obj;
  }
  jsonToDate(obj, meta.dateFields);
  if (meta.objectFields) {
    for (const objectField of meta.objectFields) {
      if (obj[objectField.attributeName]) {
        json(obj[objectField.attributeName], objectField);
      }
    }
  }
  if (meta.arrayFields) {
    for (const arrayField of meta.arrayFields) {
      if (obj[arrayField.attributeName]) {
        const arr = obj[arrayField.attributeName];
        if (Array.isArray(arr)) {
          for (const a of arr) {
            json(a, arrayField);
          }
        }
      }
    }
  }
  return obj;
}

export function jsonArray<T>(list: T[], metaModel: MetaModel): T[] {
  if (!metaModel) {
    return list;
  }
  if (!list || list.length === 0) {
    return list;
  }
  for (const obj of list) {
    json(obj, metaModel);
  }
  return list;
}
