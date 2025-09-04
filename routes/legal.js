const express = require('express');
const router = express.Router();

router.get("/privacy",(req,res)=>{
    res.render("./legal/privacy.ejs");
});

router.get("/termsCondition",(req,res)=>{
    res.render("./legal/terms.ejs");
});

router.get("/contactUs",(req,res)=>{
    res.render("./legal/contact.ejs");
});

module.exports=router;