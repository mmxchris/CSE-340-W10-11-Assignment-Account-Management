//Needed Recources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route to build account management view
router.get("/",  utilities.checkLogin,
   utilities.handleErrors(accountController.buildManagementView))

//Route to build account login view
router.get("/login/", utilities.handleErrors(accountController.buildLogin))

//Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to process registration form
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

//Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//Route to log out
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

//Route to build Edit Account view
router.get("/edit/:account_id", utilities.checkLogin,
    utilities.handleErrors(accountController.buildEditAccount))

//Route to process edit account form
router.post(
    "/edit/account-info",    
    regValidate.editAccountInfoRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.editAccount))

router.post(
  "/edit/password",
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.editAccountPassword)
)

module.exports = router;