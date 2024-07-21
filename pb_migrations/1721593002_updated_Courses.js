/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "acszzgwa",
    "name": "Semester_ID",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "mu88sj62jpexrv2",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // remove
  collection.schema.removeField("acszzgwa")

  return dao.saveCollection(collection)
})
