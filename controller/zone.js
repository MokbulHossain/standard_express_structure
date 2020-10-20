const express = require('express');
const router = express.Router();
const pg = require('../config/database').pg;
const {CheckUserExist} = require('../helpers/sequelizeHelper');

const {Zone}  = require('../models');


router.get('/',async(req,res)=>{

   try{
    
    pg.query(`select zone.id,zone.name,zone.created_by,users.full_name from zone left join users on users.user_id= zone.created_by;
`).then(data=>res.json({success:true,data:data[0]})).catch(e=>res.json({success:false,message:'Try again'}))
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})


router.post('/',async(req,res)=>{

   try{
    let {name2:name} =req.body
    let user_id = parseInt(req.user_info.user_id);
    pg.query(`insert into zone(name,created_by) values($1,$2)`,{bind:[name,user_id]}).then(data=>res.json({success:true,message:"Create successfull"})).catch(e=>res.json({success:false,message:'Try again'}))
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})

router.put('/',async(req,res)=>{

   try{
    let {id,name} =req.body
    let user_id = parseInt(req.user_info.user_id);
    pg.query(`update zone set name=$1,created_by=$3 where id=$2 `,{bind:[name,id,user_id]}).then(data=>res.json({success:true,message:"update info successfull"})).catch(e=>res.json({success:false,message:'Try again'}))
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})

module.exports = router;