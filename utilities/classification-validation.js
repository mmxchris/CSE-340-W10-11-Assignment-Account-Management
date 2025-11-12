const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

  /*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
 validate.classRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.") //on error this message is sent.
        .matches(/^[A-Za-z0-9]*$/)
        .withMessage("The classification must not contain any special characters or spaces.") //on error this message is sent.
    ]
 }

 validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
 }

 module.exports = validate