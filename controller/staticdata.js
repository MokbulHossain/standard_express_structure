const express = require('express');
const router = express.Router();
const pg = require('../config/database').pg;
const  {OK, INTERNAL_SERVER_ERROR} =require('../helpers/responseHelper')

Roles=async(req,res)=>{
    try{
    const role_type = parseInt(req.params.role_type)
    pg.query(`select * from roles where role_type=${role_type}`)
       .then(data=>res.json({success:true,data:data[0]}))
       .catch(e=>res.json({success:false,message:'Try again'}))
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
}

CompanyList = async(req,res) =>{
 companyName = await pg.query(`select user_id as id,company_name FROM users where company_name IS NOT NULL`)
 res.status(200).send(OK( companyName[0], null, req));
}

ZoneList = async(req,res) =>{ Zone = await pg.query(`select id,name from zone where status=1`);res.status(200).send(OK( Zone[0], null, req)) }

 RetailerListUnderOfficer=async(req,res) =>{
  let {company_id,zone} = req.user_info;
  let List = await pg.query(`select user_id as retailer_id,shop_name,phone,address from users where zone=${parseInt(zone)} and supplier_id=${parseInt(company_id)} and user_type=2`)
  return res.status(200).send(OK( List[0], null, req)); 
}


module.exports = {Roles,CompanyList,ZoneList,RetailerListUnderOfficer}