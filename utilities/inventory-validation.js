const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
 validate.inventoryRules = () => {
     return [
         //make is required and must be string
         body("inv_make")
             .trim()             
             .notEmpty()
             .withMessage("Please provide a make.")//on error this message is sent.
             .matches(/^[A-Za-z0-9]*$/)
             .withMessage("The make must not contain any special characters or spaces.") //on error this message is sent.
             .escape(),
 
         //model is required and must be string
         body("inv_model")
             .trim()             
             .notEmpty()
             .withMessage("Please provide a model.") //on error this message is sent.
             .matches(/^[A-Za-z0-9\s\-]+$/)
             .withMessage("The model can only have letters, numbers, spaces and hyphens.") //on error this message is sent.
             .escape(),
         
         //year is required and must be a 4 digit number
         body("inv_year")
             .trim()             
             .notEmpty()
             .withMessage("Please provide a year.")
             .isInt({ min: 0 })
             .withMessage("Year must be a positive number with no decimals."), //on error this message is sent.
             
 
         //description is required and must be string
         body("inv_description")
             .trim()             
             .notEmpty()
             .withMessage("Please provide a description.") //on error this message is sent.
             .escape(),             
 
         //thumbnail is required and must be string
         body("inv_thumbnail")
             .trim()             
             .notEmpty()          
             .withMessage("Please provide a thumbnail."), //on error this message is sent.
            
         //image is required and must be string
         body("inv_image")
             .trim()             
             .notEmpty()             
             .withMessage("Please provide an image."), //on error this message is sent.             
 
         //price is required and must be a number
         body("inv_price")
             .trim()            
             .notEmpty()
             .withMessage("Please provide a price.") //on error this message is sent.
             .isFloat({ min: 0.01 })
             .withMessage("Price must be a positive number.") //on error this message is sent.
             .escape(),
 
         //miles is required and must be a number
         body("inv_miles")
             .trim()
             .notEmpty()
             .withMessage("Please provide the mileage.")
             .isInt({ min: 0 })
             .withMessage("Mileage must be a positive number with no decimals.") //on error this message is sent.
             .escape(),
 
         //color is required and must be string
        body("inv_color")
             .trim()
             .escape()
             .notEmpty()             
             .withMessage("Please provide a color.") //on error this message is sent.
             .matches(/^[A-Za-z0-9]*$/)
             .withMessage("The color must not contain any special characters or spaces.") //on error this message is sent.
             .escape(),
 
         //classification is required and must be a number
         body("classification_id")
             .trim()
             .notEmpty()
             .withMessage("Please provide a classification.")//on error this message is sent.
             .isInt({ min: 1 })
             .withMessage("Select a valid classification.") //on error this message is sent.
             .escape()
     ]
 }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
    const { inv_make,
            inv_model, inv_year,
            inv_description,
            inv_thumbnail, inv_image,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classSelect = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classSelect,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_thumbnail,
            inv_image,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

module.exports = validate