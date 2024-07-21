/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3mndfaoo",
    "name": "Exam_Date_Time",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3mndfaoo",
    "name": "Exam_Date_And_Time",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
