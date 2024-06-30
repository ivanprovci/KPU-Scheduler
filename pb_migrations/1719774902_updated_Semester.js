/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mu88sj62jpexrv2")

  // remove
  collection.schema.removeField("yaifj2ey")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mu88sj62jpexrv2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yaifj2ey",
    "name": "Department",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
