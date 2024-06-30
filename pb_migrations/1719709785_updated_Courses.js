/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2kwkhspv",
    "name": "Start_Time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^(?:[01]\\d|2[0-3]):[0-5]\\d$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "crfufbjt",
    "name": "End_Time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^(?:[01]\\d|2[0-3]):[0-5]\\d$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // remove
  collection.schema.removeField("2kwkhspv")

  // remove
  collection.schema.removeField("crfufbjt")

  return dao.saveCollection(collection)
})
