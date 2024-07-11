const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schems.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");


const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});




router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createRoute));
  

//Render a form for creating a route
router.get("/new",isLoggedIn, listingController.renderFormForListing);

router
  .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyRoute));


  

//View All Listing route
router.get("/",wrapAsync(listingController.index));


//render a page for editing 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditPage));


module.exports=router;