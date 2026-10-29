/**
 * 🛡️ Default Dynamic Selectors for RCH Manager Portal Elements
 * Automatically seeded into MongoDB and editable on the web Admin Panel (/admin).
 * Mapped directly to the extension automation files.
 */
module.exports = {
  // 1. Global Page Headers & Hierarchy (common_function.js)
  global: {
    pageTitle: "lblPageTitle",
    hierarchyLabel: "lblHierarchy",
    userLabel: "lblUserName",
    parentLabel: "lblParent"
  },

  // 2. Set Location Module (SetLocation.js)
  location: {
    ddlPhc: "SingleMainContent_UserInfoBoxControl2_ddlPhc",
    ddlSubCentre: "SingleMainContent_UserInfoBoxControl2_ddlSubCentre",
    ddlVillage: "SingleMainContent_UserInfoBoxControl2_ddlVillage",
    btnSave: "SingleMainContent_UserInfoBoxControl2_btnSave",
    minuteTimer: "minute"
  },

  // 3. Mother Registration Form (page.js)
  motherEntry: {
    ddlAnm: "SingleMainContent_ddlAnm",
    ddlAsha: "SingleMainContent_ddlAsha",
    ddlWhoseMob: "SingleMainContent_ddlWhoseMob",
    txtRegSrNo: "SingleMainContent_txtRegSrNo",
    txtWifeName: "SingleMainContent_txtWifeName",
    txtHusbandName: "SingleMainContent_txtHusbandName",
    txtMobNo: "SingleMainContent_txtMobNo",
    txtRegDate: "SingleMainContent_txtRegDate",
    txtWifeCurrentAge: "SingleMainContent_txtWifeCurrentAge",
    txtwomenDOB: "SingleMainContent_txtwomenDOB",
    txtAddress: "SingleMainContent_txtAdderss",
    ddlBplApl: "SingleMainContent_ddlBplApl",
    btnSave: "SingleMainContent_btnSave",
    btnContinue: "SingleMainContent_btnContinue",
    btnContinueAlt: "SingleMainContent_DoubleMainContent_btnContinue",
    lblRegNo: "SingleMainContent_lblRegNo",
    lblRegistrationId: "SingleMainContent_lblRegistration_Id",
    abhaCreateBtn: "SingleMainContent_btnAbhaCreateCbr",
    abhaRadioBtn: "SingleMainContent_rdbAbhaCbr_1",
    reqValidator4: "SingleMainContent_RequiredFieldValidator4",
    ddlPregnancyTest: "SingleMainContent_ddlPregnancyTest",
    ddlPregnancy: "SingleMainContent_ddlPregnancy",
    ddlMethod: "SingleMainContent_ddlMethod",
    txtVisitDate: "SingleMainContent_txtVisitDate"
  },

  // 4. Mother Update: ANC & Delivery (motherUp.js)
  motherUpdate: {
    txtLmpDate: "SingleMainContent_DoubleMainContent_txtLmpDate",
    txtDeliveryDate: "SingleMainContent_DoubleMainContent_txtDeliveryDate",
    txtDeliveryTimeHH: "SingleMainContent_DoubleMainContent_txtDeliveryTimeHH",
    txtDeliveryTimeMM: "SingleMainContent_DoubleMainContent_txtDeliveryTimeMM",
    txtDischargeDate: "SingleMainContent_DoubleMainContent_txtDischargeDate",
    txtDischargeTimeHH: "SingleMainContent_DoubleMainContent_txtDischargeTimeHH",
    txtDischargeTimeMM: "SingleMainContent_DoubleMainContent_txtDischargeTimeMM",
    ddlDeliveryPlace: "SingleMainContent_DoubleMainContent_ddlDeliveryPlace",
    ddlDeliveryType: "SingleMainContent_DoubleMainContent_ddlDeliveryType",
    ddlDeliveryConducted: "SingleMainContent_DoubleMainContent_ddlDeliveryConducted",
    ddlFacilityPlaceId: "SingleMainContent_DoubleMainContent_ddlFacilityPlaceId",
    txtFacilityPlaceName: "SingleMainContent_DoubleMainContent_txtFacilityPlaceName",
    txtPlaceName: "SingleMainContent_DoubleMainContent_txtPlaceName",
    txtWeight: "SingleMainContent_DoubleMainContent_txtWeight",
    txtMotherWeight: "SingleMainContent_DoubleMainContent_txtMotherWeight",
    ddlBabyCried: "SingleMainContent_DoubleMainContent_ddlBabyCried",
    ddlHBTest: "SingleMainContent_DoubleMainContent_ddlHBTest",
    ddlInfantSex: "SingleMainContent_DoubleMainContent_ddlInfantSex",
    txtBirthWeight: "SingleMainContent_DoubleMainContent_txtBirthWeight",
    lvCustomersTable: "SingleMainContent_DoubleMainContent_lvDetails_customers",
    ddlFPforANCDone: "SingleMainContent_DoubleMainContent_ddlFPforANCDone",
    btnSave: "SingleMainContent_DoubleMainContent_btnSave",
    btnContinue: "SingleMainContent_DoubleMainContent_btnContinue",
    chkNone: "SingleMainContent_DoubleMainContent_chkNone",
    txtAncDate: "SingleMainContent_DoubleMainContent_txtAncDate",
    txtIfaTabs: "SingleMainContent_DoubleMainContent_txtIfaTabs",
    txtFolicAcidTabs: "SingleMainContent_DoubleMainContent_txtFolicAcidTabs",
    txtTt1Date: "SingleMainContent_DoubleMainContent_txtTt1Date",
    txtFundalFH: "SingleMainContent_DoubleMainContent_txtFundalFH",
    ddlDeliveryOutcomes: "SingleMainContent_DoubleMainContent_ddlDeliveryOutcomes",
    ddlLiveBirth: "SingleMainContent_DoubleMainContent_ddlLiveBirth",
    ddlStillBirth: "SingleMainContent_DoubleMainContent_ddlStillBirth",
    ddlFacilityForDelivery: "SingleMainContent_DoubleMainContent_ddlFacilityForDelivery"
  },

  // 5. Child Registration Form (child.js)
  childEntry: {
    txtChildName: "SingleMainContent_DoubleMainContent_txtChildName",
    ddlGender: "SingleMainContent_DoubleMainContent_ddlGender",
    txtBirthWeight: "SingleMainContent_DoubleMainContent_txtBirthWeight",
    txtMotherName: "SingleMainContent_DoubleMainContent_txtMotherName",
    txtFatherName: "SingleMainContent_DoubleMainContent_txtFatherName",
    txtMobileNo: "SingleMainContent_DoubleMainContent_txtMobileNo",
    ddlWhoseMobNo: "SingleMainContent_DoubleMainContent_ddlWhoseMobNo",
    txtRegistrationDate: "SingleMainContent_DoubleMainContent_txtRegistrationDate",
    txtSnoRch: "SingleMainContent_DoubleMainContent_txtSnoRch",
    txtImmuDate: "SingleMainContent_DoubleMainContent_txtImmu_Date",
    ddlImmunization: "SingleMainContent_DoubleMainContent_ddlImmunization",
    btnSave: "SingleMainContent_DoubleMainContent_btnSave",
    ddlAsha: "SingleMainContent_DoubleMainContent_ddlAsha",
    ddlAnm: "SingleMainContent_DoubleMainContent_ddlAnm"
  },

  // 6. Child Immunization Update (childUp.js)
  childUpdate: {
    lvCustomersTable: "SingleMainContent_DoubleMainContent_lvDetails_customers",
    txtImmuDate: "SingleMainContent_DoubleMainContent_txtImmu_Date",
    ddlImmunization: "SingleMainContent_DoubleMainContent_ddlImmunization",
    chkImu1: "SingleMainContent_DoubleMainContent_ChkBoxImu1",
    chkImu2: "SingleMainContent_DoubleMainContent_ChkBoxImu2",
    chkImu3: "SingleMainContent_DoubleMainContent_ChkBoxImu3",
    chkImu4: "SingleMainContent_DoubleMainContent_ChkBoxImu4",
    chkImu5: "SingleMainContent_DoubleMainContent_ChkBoxImu5",
    chkImu6: "SingleMainContent_DoubleMainContent_ChkBoxImu6",
    btnSave: "SingleMainContent_DoubleMainContent_btnSave"
  },

  // 7. Asha & ANM Collection (collectAsha.js)
  ashaSearch: {
    lvCustomers: "SingleMainContent_lvSearch_customers",
    ddlValidated: "SingleMainContent_ddlValidated",
    ddlStatus: "SingleMainContent_ddlStatus",
    btnSearch: "SingleMainContent_btnSearch"
  }
};
