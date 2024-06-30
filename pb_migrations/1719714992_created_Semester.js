/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mu88sj62jpexrv2",
    "created": "2024-06-30 02:36:32.580Z",
    "updated": "2024-06-30 02:36:32.580Z",
    "name": "Semester",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
        "system": false,
        "id": "vpoaic6i",
        "name": "Name",
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
  const collection = dao.findCollectionByNameOrId("mu88sj62jpexrv2");

  return dao.deleteCollection(collection);
})
