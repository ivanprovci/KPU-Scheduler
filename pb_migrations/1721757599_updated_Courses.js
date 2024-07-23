/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // remove
  collection.schema.removeField("aiobqu1v")

  // remove
  collection.schema.removeField("f0dmakop")

  // remove
  collection.schema.removeField("bfnjuotg")

  // remove
  collection.schema.removeField("drh3kdlg")

  // remove
  collection.schema.removeField("x7jjh7z7")

  // remove
  collection.schema.removeField("lbjll8qh")

  // remove
  collection.schema.removeField("ecnrumqp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vnvmenhg",
    "name": "M",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wngcfjj9",
    "name": "T",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qdzjbs6r",
    "name": "W",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gjws7dph",
    "name": "R",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r80c8drm",
    "name": "F",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pkrglonh",
    "name": "S",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iz6tdbl1",
    "name": "U",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aiobqu1v",
    "name": "M",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f0dmakop",
    "name": "T",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bfnjuotg",
    "name": "W",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "drh3kdlg",
    "name": "R",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x7jjh7z7",
    "name": "F",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lbjll8qh",
    "name": "S",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ecnrumqp",
    "name": "U",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 1,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("vnvmenhg")

  // remove
  collection.schema.removeField("wngcfjj9")

  // remove
  collection.schema.removeField("qdzjbs6r")

  // remove
  collection.schema.removeField("gjws7dph")

  // remove
  collection.schema.removeField("r80c8drm")

  // remove
  collection.schema.removeField("pkrglonh")

  // remove
  collection.schema.removeField("iz6tdbl1")

  return dao.saveCollection(collection)
})
