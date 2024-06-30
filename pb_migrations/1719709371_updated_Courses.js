/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xweqksgr",
    "name": "Exam_Date_Time",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d8nwgwgy",
    "name": "Room_ID",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "awhlvntq",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8s9ma7ob",
    "name": "Crosslist_Code",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cp7510h4",
    "name": "Link_ID",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fc6a4xac",
    "name": "Additional_Information",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "umwaujju",
    "name": "Zero_Textbook_Cost_Adobe_Creative_Cloud",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9bovdyel",
    "name": "Program_Restrictions",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kofuw3tt",
    "name": "Reserved_Seats",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ppowkv9l",
    "name": "Overflow_Y_N",
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
    "id": "b346wzh7",
    "name": "Date_Reserves_Removed",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kc7hpzjh",
    "name": "Fee_Detail_Code",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4yqmwx21",
    "name": "Addtl_Mandatory_Course_Fee",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cy6z4pmg",
    "name": "Funding_Source",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zukmfr1h27fvgba")

  // remove
  collection.schema.removeField("xweqksgr")

  // remove
  collection.schema.removeField("d8nwgwgy")

  // remove
  collection.schema.removeField("awhlvntq")

  // remove
  collection.schema.removeField("8s9ma7ob")

  // remove
  collection.schema.removeField("cp7510h4")

  // remove
  collection.schema.removeField("fc6a4xac")

  // remove
  collection.schema.removeField("umwaujju")

  // remove
  collection.schema.removeField("9bovdyel")

  // remove
  collection.schema.removeField("kofuw3tt")

  // remove
  collection.schema.removeField("ppowkv9l")

  // remove
  collection.schema.removeField("b346wzh7")

  // remove
  collection.schema.removeField("kc7hpzjh")

  // remove
  collection.schema.removeField("4yqmwx21")

  // remove
  collection.schema.removeField("cy6z4pmg")

  return dao.saveCollection(collection)
})
