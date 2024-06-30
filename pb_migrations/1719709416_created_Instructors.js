/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "5hmit91f5tgxnz6",
    "created": "2024-06-30 01:03:36.170Z",
    "updated": "2024-06-30 01:03:36.170Z",
    "name": "Instructors",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rhifk0z4",
        "name": "Instructor_ID",
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
        "id": "bstp1vcf",
        "name": "Last_Name",
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
        "id": "b10rglxz",
        "name": "First_Name",
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
  const collection = dao.findCollectionByNameOrId("5hmit91f5tgxnz6");

  return dao.deleteCollection(collection);
})
