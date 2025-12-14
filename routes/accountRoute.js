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
//Route to Build User Management View
router.get("/admin", utilities.checkIfAdmin,
    utilities.handleErrors(accountController.buildUserManagement))

//Route to Build Admin Edit Account View
router.get("/admin/edit/:account_id", utilities.checkIfAdmin,
    utilities.handleErrors(accountController.buildAdminEditAccount))

//Route to process admin edit account form
router.post(
  "/admin/edit/update",
  utilities.checkIfAdmin,
  regValidate.accountTypeRules(),
  regValidate.checkAccountType,
  utilities.handleErrors(accountController.updateAccountType))

//Route to process password reset reset
router.post("/admin/reset-password",
  utilities.checkIfAdmin,
  utilities.handleErrors(accountController.resetPassword))

//Route to delete account
router.get("/admin/delete/:account_id", utilities.checkIfAdmin,
    utilities.handleErrors(accountController.buildDeleteAccount))

//Route to process delete account form
router.post("/admin/delete", utilities.checkIfAdmin,
    utilities.handleErrors(accountController.deleteAccount))



module.exports = router;