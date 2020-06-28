"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataType;
(function (DataType) {
  DataType["ObjectId"] = "ObjectId";
  DataType["DateTime"] = "DateTime";
  DataType["Bool"] = "Bool";
  DataType["Number"] = "Number";
  DataType["Integer"] = "Integer";
  DataType["String"] = "String";
  DataType["Object"] = "Object";
  DataType["Array"] = "Array";
  DataType["Binary"] = "Binary";
})(DataType = exports.DataType || (exports.DataType = {}));
var MetaModel = (function () {
  function MetaModel() {
  }
  return MetaModel;
}());
exports.MetaModel = MetaModel;
var DefaultMetaModelBuilder = (function () {
  function DefaultMetaModelBuilder() {
  }
  DefaultMetaModelBuilder.prototype.build = function (model) {
    if (model && !model.source) {
      model.source = model.name;
    }
    var metadata = new MetaModel();
    metadata.model = model;
    var primaryKeys = new Array();
    var dateFields = new Array();
    var objectFields = new Array();
    var arrayFields = new Array();
    var keys = Object.keys(model.attributes);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      var attr = model.attributes[key];
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
              var x = this.build(attr.typeOf);
              x.attributeName = key;
              objectFields.push(x);
            }
            break;
          }
          case DataType.Array: {
            if (attr.typeOf) {
              var y = this.build(attr.typeOf);
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
    metadata.primaryKeys = primaryKeys;
    metadata.dateFields = dateFields;
    metadata.objectFields = objectFields;
    metadata.arrayFields = arrayFields;
    return metadata;
  };
  return DefaultMetaModelBuilder;
}());
var MetadataUtil = (function () {
  function MetadataUtil() {
  }
  MetadataUtil.ids = function (model) {
    var keys = Object.keys(model.attributes);
    var primaryKeys = [];
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
      var key = keys_2[_i];
      var attr = model.attributes[key];
      if (attr && attr.ignored !== true && attr.primaryKey === true && attr.name && attr.name.length > 0) {
        primaryKeys.push(attr.name);
      }
    }
    return primaryKeys;
  };
  MetadataUtil.getMetaModel = function (model) {
    var meta = MetadataUtil._cache[model.name];
    if (!meta) {
      meta = this._builder.build(model);
      this._cache[model.name] = meta;
    }
    return meta;
  };
  MetadataUtil.json = function (obj, meta) {
    MetadataUtil.jsonToDate(obj, meta.dateFields);
    if (meta.objectFields) {
      for (var _i = 0, _a = meta.objectFields; _i < _a.length; _i++) {
        var objectField = _a[_i];
        if (obj[objectField.attributeName]) {
          MetadataUtil.json(obj[objectField.attributeName], objectField);
        }
      }
    }
    if (meta.arrayFields) {
      for (var _b = 0, _c = meta.arrayFields; _b < _c.length; _b++) {
        var arrayField = _c[_b];
        if (obj[arrayField.attributeName]) {
          var arr = obj[arrayField.attributeName];
          if (Array.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
              MetadataUtil.json(arr[i], arrayField);
            }
          }
        }
      }
    }
  };
  MetadataUtil.jsonToDate = function (obj, fields) {
    if (!obj || !fields) {
      return obj;
    }
    if (!Array.isArray(obj)) {
      for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var field = fields_1[_i];
        var val = obj[field];
        if (val && !(val instanceof Date)) {
          obj[field] = MetadataUtil.convertJsonToDate(val);
        }
      }
    }
  };
  MetadataUtil.convertJsonToDate = function (dateStr) {
    if (!dateStr || dateStr === '') {
      return null;
    }
    var i = dateStr.indexOf(MetadataUtil._datereg);
    if (i >= 0) {
      var m = MetadataUtil._re.exec(dateStr);
      var d = parseInt(m[0], null);
      return new Date(d);
    }
    else {
      if (isNaN(dateStr)) {
        return new Date(dateStr);
      }
      else {
        var d = parseInt(dateStr, null);
        return new Date(d);
      }
    }
  };
  MetadataUtil._datereg = '/Date(';
  MetadataUtil._re = /-?\d+/;
  MetadataUtil._cache = {};
  MetadataUtil._builder = new DefaultMetaModelBuilder();
  return MetadataUtil;
}());
exports.MetadataUtil = MetadataUtil;
