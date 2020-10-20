const express = require('express');
const router = express.Router();
const pg = require('../config/database').pg;
const {CheckUserExist} = require('../helpers/sequelizeHelper');
const {base64fileUpload} = require('../helpers/utilities');
var fs = require('fs');
require('dotenv').config()
var bcrypt = require('bcryptjs');
var {PasswordValidator} = require('../middleware/validator')
router.get('/',async (req,res)=>{

   try{
    let query = `select us.user_id,us.phone,us.full_name,us.image,us.status,us.user_type,us.address,us.email,us.action_by,us.supplier_id as company_id,
                 users.user_id as aid,users.full_name as afullname,com.company_name,zone.name as zone_name FROM users as us
                 left join users on users.user_id= us.action_by left join users as com on us.supplier_id= com.user_id
                left join zone on us.zone=zone.id where us.user_type =3 order by user_id DESC`;
    pg.query(query).then(async data=>{  
    	return res.status(200).json({data:data[0]})
    })
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})

router.get('/:userId',async (req,res)=>{

   try{
    let {userId} = req.params  //+variable convert string to integer or float..
      let query = `select * FROM users  where user_type =3 and user_id = ${+userId}`;
    pg.query(query).then(async data=>{  
      return res.status(200).json({data:data[0][0]})
    })
    
   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) }
})


router.post('/blockUser',async (req,res)=>{ 
   
   try{
    let {userid:userId,ActivityBy} = req.body
    pg.query(`update users set status=0 where user_id=${userId} and user_type=3`).then(async data=>{  

      return res.status(200).json({success:true,message:"User Account is Lock Successfully" })

    }).catch(e=>res.status(404).json({success:false,message:"Please Try again" }) )

   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) } 
})

router.post('/activeUser',async (req,res)=>{ 
   
   try{
    let {userid:userId,ActivityBy} = req.body
    pg.query(`update users set status=1 where user_id=${userId} and user_type=3`).then(async data=>{  

      return res.status(200).json({success:true,message:"User Account is Active Successfully" })

    }).catch(e=>res.status(404).json({success:false,message:"Please Try again" }) )

   }catch(e){return res.status(404).json({success:false,message:"Database query execution error"}) } 
})

router.post('/createNewUser',async (req,res)=>{  
   
 try{        
    let {image,phone,password,fullname,address,email,zone,company_name:supplier_id} = req.body
     let user_id = parseInt(req.user_info.user_id);
     let error = await PasswordValidator(password); 
      if(error){ return res.json({passerror:error})}
    let imageUrl = image?await base64fileUpload(image,'jpeg'):null;
     var salt = await bcrypt.genSaltSync(10);
      var hashpass =await bcrypt.hashSync(password, salt);

    pg.query(`insert into users(phone, password,full_name,user_type,image,address,email,action_by,status,zone,supplier_id) 
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    { bind:[phone,hashpass,fullname,3,imageUrl,address,email,user_id,0,zone,supplier_id], type: pg.QueryTypes.INSERT } ).then(async data=>{
        
         return res.status(200).json({success:true,message:"User Create Successfully" })
    }).catch(e=>{
       return res.status(404).json({success:false,message:"Try Again" })
    })


  }catch (e) {
    return res.status(404).json({success:false,message:"can't Upload File"})

    }

})

router.put('/updateUser/:id',async (req,res)=>{  
   
 try{        
    let imageUrl=null,hashpass=null;
    let {image1:image,phone,password1:password,full_name,address,email,status,zone,company_name:supplier_id} = req.body
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


    pg.query(`update users set phone=$1, password=$2,full_name=$3,user_type=$4,image=$5,address=$6,email=$7,status=$8,zone=$10,supplier_id=$11
    where user_id = $9`,
    { bind:[phone,hashpass,full_name,3,imageUrl,address,email,status,updateUserId,zone,supplier_id], type: pg.QueryTypes.UPDATE } ).then(async data=>{
        
         return res.status(200).json({success:true,message:"User Update Successfully" })

    }).catch(e=>{ console.log(e)
       return res.status(404).json({success:false,message:"Phone Number Already Exist" })
    })


  }catch (e) {
    return res.status(404).json({success:false,message:"can't Upload File"})

    }

})

module.exports = router;