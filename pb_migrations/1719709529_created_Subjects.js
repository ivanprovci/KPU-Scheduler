/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "513zbraa4kqfpdm",
    "created": "2024-06-30 01:05:29.175Z",
    "updated": "2024-06-30 01:05:29.175Z",
    "name": "Subjects",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zxwixlxz",
        "name": "Subject_Code",
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
        "id": "f2xuedtg",
        "name": "Subject_Name",
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
  const collection = dao.findCollectionByNameOrId("513zbraa4kqfpdm");

  return dao.deleteCollection(collection);
})
