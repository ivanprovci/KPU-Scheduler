/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("whr2e8dynmtwkku")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k5bpjim8",
    "name": "Rooms_Campus_ID",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "j7lzjqp0gbtyofa",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("whr2e8dynmtwkku")

  // remove
  collection.schema.removeField("k5bpjim8")

  return dao.saveCollection(collection)
})
