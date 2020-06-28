export enum DataType {
  ObjectId = 'ObjectId',
  DateTime = 'DateTime',
  Bool = 'Bool',

  Number = 'Number',
  Integer = 'Integer',
  String = 'String',

  Object = 'Object',
  Array = 'Array',
  Binary = 'Binary'
}

export interface Metadata {
  name: string;
  attributes: any;
  source?: string;
  model?: any;
  schema?: any;
}

export interface Attribute {
  name: string;
  field: string;
  type: DataType;
  primaryKey?: boolean;
  ignored?: boolean;
  typeOf?: Metadata;
}

export interface MetaModel {
  model: Metadata;
  attributeName?: string;
  primaryKeys: Attribute[];
  dateFields: string[];
  objectFields: MetaModel[];
  arrayFields: MetaModel[];
}

class DefaultMetaModelBuilder {
  build(model: Metadata): MetaModel {
    if (model && !model.source) {
      model.source = model.name;
    }
    const primaryKeys: Attribute[] = new Array<Attribute>();
    const dateFields = new Array<string>();
    const objectFields = new Array<MetaModel>();
    const arrayFields = new Array<MetaModel>();
    const keys: string[] = Object.keys(model.attributes);
    for (const key of keys) {
      const attr: Attribute = model.attributes[key];
      if (attr) {
        attr.name = key;
        if (attr.ignored !== true) {
          if (attr.primaryKey === true) {
            primaryKeys.push(attr);
          }
        }

        switch (attr.type) {
          case DataType.DateTime: {
            dateFields.push(attr.name);
            break;
          }
          case DataType.Object: {
            if (attr.typeOf) {
              const x = this.build(attr.typeOf);
              x.attributeName = key;
              objectFields.push(x);
            }
            break;
          }
          case DataType.Array: {
            if (attr.typeOf) {
              const y = this.build(attr.typeOf);
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
    const metadata: MetaModel = {
      model,
      primaryKeys,
      dateFields,
      objectFields,
      arrayFields
    };
    return metadata;
  }
}

export class MetadataUtil {
  private static _datereg = '/Date(';
  private static _re = /-?\d+/;
  private static _cache: any = {};
  private static _builder = new DefaultMetaModelBuilder();

  static ids(model: Metadata): string[] {
    const keys: string[] = Object.keys(model.attributes);
    const primaryKeys: string[] = [];
    for (const key of keys) {
      const attr: Attribute = model.attributes[key];
      if (attr && attr.ignored !== true && attr.primaryKey === true && attr.name && attr.name.length > 0) {
        primaryKeys.push(attr.name);
      }
    }
    return primaryKeys;
  }

  static buildMetaModel(model: Metadata): MetaModel {
    const meta = this._builder.build(model);
    return meta;
  }

  static getMetaModel(model: Metadata): MetaModel {
    let meta: MetaModel = MetadataUtil._cache[model.name];
    if (!meta) {
      meta = this._builder.build(model);
      this._cache[model.name] = meta;
    }
    return meta;
  }

  // Use parse datetime string field to datetime date field.
  static json(obj: any, meta: MetaModel): void {
    MetadataUtil.jsonToDate(obj, meta.dateFields);
    if (meta.objectFields) {
      for (const objectField of meta.objectFields) {
        if (obj[objectField.attributeName]) {
          MetadataUtil.json(obj[objectField.attributeName], objectField);
        }
      }
    }
    if (meta.arrayFields) {
      for (const arrayField of meta.arrayFields) {
        if (obj[arrayField.attributeName]) {
          const arr = obj[arrayField.attributeName];
          if (Array.isArray(arr)) {
            for (const a of arr) {
              MetadataUtil.json(a, arrayField);
            }
          }
        }
      }
    }
  }
  private static jsonToDate(obj, fields: string[]) {
    if (!obj || !fields) {
      return obj;
    }
    if (!Array.isArray(obj)) {
      for (const field of fields) {
        const val = obj[field];
        if (val && !(val instanceof Date)) {
          obj[field] = MetadataUtil.convertJsonToDate(val);
        }
      }
    }
  }
  private static convertJsonToDate(dateStr): Date {
    if (!dateStr || dateStr === '') {
      return null;
    }
    const i = dateStr.indexOf(MetadataUtil._datereg);
    if (i >= 0) {
      const m = MetadataUtil._re.exec(dateStr);
      const d = parseInt(m[0], null);
      return new Date(d);
    } else {
      if (isNaN(dateStr)) {
        return new Date(dateStr);
      } else {
        const d = parseInt(dateStr, null);
        return new Date(d);
      }
    }
  }
}
