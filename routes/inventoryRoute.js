//Needed Recources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const classValidate = require('../utilities/classification-validation')
const invValidate = require('../utilities/inventory-validation')

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationID))

// Route to build vehicle detail by id view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleDetail))

//Route to build vehicle management view
router.get("/", utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementView))

//Route to build add classification view
router.get("/add-classification",utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification))

//Route to process add classification form
router.post(
    "/add-classification",
    utilities.checkAccountType,
    classValidate.classRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassification))

//Route to build add inventory view
router.get("/add-inventory", utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory))

//Route to process add inventory form
router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))

//Route to get inventory by classification
router.get("/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))

//Route to edit a vehicle
router.get("/edit/:inv_id",utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventoryView))

//Route to process edit vehicle form
router.post(
    "/edit",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.editInventory))

//Route to delete inventory view
router.get("/delete/:inv_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventoryView))

//Route to process delete inventory form
router.post("/delete/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;