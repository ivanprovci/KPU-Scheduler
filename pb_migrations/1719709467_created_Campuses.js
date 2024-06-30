/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "j7lzjqp0gbtyofa",
    "created": "2024-06-30 01:04:27.268Z",
    "updated": "2024-06-30 01:04:27.268Z",
    "name": "Campuses",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3enhddoe",
        "name": "Campus_ID",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "jmt0a4qp",
        "name": "Campus_Name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "l67oueit",
        "name": "Campus_Location",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("j7lzjqp0gbtyofa");

  return dao.deleteCollection(collection);
})
