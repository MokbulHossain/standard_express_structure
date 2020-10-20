const express = require('express');
const router = express.Router();
const pg = require('../config/database').pg;
const {CheckUserExist} = require('../helpers/sequelizeHelper');
const {base64fileUpload} = require('../helpers/utilities');
var fs = require('fs');
require('dotenv').config()
var bcrypt = require('bcryptjs');
var {PasswordValidator} = require('../middleware/validator')
const {Zone}  = require('../models');
router.get('/',async (req,res)=>{

   try{
    let query = `select us.user_id,us.phone,us.full_name,us.image,us.status,us.user_type,us.address,us.email,us.action_by,us.supplier_id as company_id,
                users.user_id as aid,users.full_name as afullname,com.company_name,zone.name as zone_name FROM users as us inner join users on users.user_id= us.action_by
                left join users as com on us.supplier_id= com.user_id left join zone on us.zone=zone.id  where us.user_type =2 order by user_id DESC`;
    pg.query(query).then(async data=>{  
      return res.status(200).json({data:data[0]})
    })
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})

router.get('/:userId',async (req,res)=>{

   try{
    let userId = parseInt(req.params.userId)
    let query = `select * FROM users where user_type =2 and users.user_id=${userId}`;
    pg.query(query).then(async data=>{  
      return res.status(200).json({data:data[0][0]})
    })
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})


router.post('/blockUser',async (req,res)=>{ 
   
   try{
    let {userid:userId,ActivityBy} = req.body
    pg.query(`update users set status=0 where user_id=${userId} and user_type=2`).then(async data=>{  

      return res.status(200).json({success:true,message:"User Account is Lock Successfully" })

    }).catch(e=>res.status(404).json({success:false,message:"Please Try again" }) )

   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) } 
})

router.post('/activeUser',async (req,res)=>{ 
   
   try{
    let {userid:userId,ActivityBy} = req.body
    pg.query(`update users set status=1 where user_id=${userId} and user_type=2`).then(async data=>{  

      return res.status(200).json({success:true,message:"User Account is Active Successfully" })

    }).catch(e=>res.status(404).json({success:false,message:"Please Try again" }) )

   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) } 
})

router.post('/createNewUser',async (req,res)=>{  
   
 try{   
  
    let {image,phone,password,fullname,address,email,company_name:supplier_id,zone,shop_name,retailerType} = req.body
     let {user_type,user_id} = req.user_info;
     let error = await PasswordValidator(password);
      if(error){ return res.json({passerror:error})}
    let imageUrl = image?await base64fileUpload(image,'jpeg'):null;
     var salt = await bcrypt.genSaltSync(10);
      var hashpass =await bcrypt.hashSync(password, salt);

   supplier_id = retailerType=='global'?null:supplier_id

    pg.query(`insert into users(phone, password,full_name,user_type,image,address,email,action_by,status,supplier_id,zone,shop_name) 
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) `,
    { bind:[phone,hashpass,fullname,2,imageUrl,address,email,user_id,0,supplier_id,zone,shop_name], type: pg.QueryTypes.INSERT} ).then(async data=>{
         return res.status(200).json({success:true,message:"User Create Successfully" })
    }).catch(e=>{
       return res.status(200).json({success:false,message:"Try Again" })
    })


  }catch (e) {
    return res.status(200).json({success:false,message:"can't Upload File"})

    }

})

router.put('/updateUser/:id',async (req,res)=>{  
   
 try{       
    let imageUrl=null,hashpass=null;
    let {image1:image,phone,password1:password,full_name,address,email,status,company_name:supplier_id,zone,retailerType,shop_name} = req.body
    let updateUserId = parseInt(req.params.id);
     let user_id = parseInt(req.user_info.user_id);
     let users = await pg.query(`select * from users where user_id=${updateUserId} and user_type>0`)

     if(!users[0].length){return res.status(404).json({success:true,message:"User Dosen't Exist" })}
     if(!password){
      hashpass = users[0][0].password;
     }
     else{
      let error = await PasswordValidator(password);
      if(error){ return res.json({passerror:error})}
      var salt = await bcrypt.genSaltSync(10);
       hashpass =await bcrypt.hashSync(password, salt);
     }

     if(!image){
       imageUrl = users[0][0].image
     }
     else{
       imageUrl = await base64fileUpload(image,'jpeg');
     }
    supplier_id = retailerType=='global'?null:supplier_id

    pg.query(`update users set phone=$1, password=$2,full_name=$3,user_type=$4,image=$5,address=$6,email=$7,status=$8,supplier_id=$10,zone=$11,shop_name=$12
    where user_id = $9`,
    { bind:[phone,hashpass,full_name,2,imageUrl,address,email,status,updateUserId,supplier_id,zone,shop_name], type: pg.QueryTypes.UPDATE } ).then(async data=>{
        
         return res.status(200).json({success:true,message:"User Update Successfully" })

    }).catch(e=>{ console.log(e)
       return res.status(404).json({success:false,message:"Phone Number Already Exist" })
    })


  }catch (e) {
    return res.status(404).json({success:false,message:"can't Upload File"})

    }

})

module.exports = router;