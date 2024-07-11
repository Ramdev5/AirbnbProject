const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});

};

module.exports.renderFormForListing=(req,res)=>{
  
    res.render("./listings/new.ejs");
};

module.exports.createRoute=async (req,res,next)=>{


    let url=req.file.path;
    let filename=req.file.filename;

    const newlisting=  new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");


};


module.exports.showListing=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing){
        req.flash("error","This listing has been deleted");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
};


module.exports.renderEditPage=async (req,res)=>{
    let {id}=req.params;

    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","This listing has been deleted");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    console.log(originalImageUrl);
    res.render("./listings/edit.ejs",{listing,originalImageUrl});

};

module.exports.updateListing=async (req,res)=>{

    
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
         let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect("/listings");

};


module.exports.destroyRoute= async (req,res)=>{
    let {id}=req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};





