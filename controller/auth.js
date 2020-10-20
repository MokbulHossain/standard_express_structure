const express = require('express');
const jwt = require('jsonwebtoken');
const appkey = require('../config/appKey');
require('dotenv').config()
const pg = require('../config/database').pg;
const _ = require('lodash');
const router = express.Router();
var bcrypt = require('bcryptjs');
const module_check = require('../middleware/check_module')
const {AccountLock,WrongPinAttemptInc,WrongPinAttemptWithDefaultValue} = require('../helpers/sequelizeHelper');
const {session_login,session_logout} = require('../session/session_operation')

/*
router.post('/register',async (req,res)=>{
    try {
       let {key,api_url,user_fullname,company_name,username,password,mobileno,email,address, companyid, ip, port, userimage, report_cdr_id,createdby,userrole} = req.body;
       //for password validation with table password_configuration....
       /*
        var special_format = /[!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]/;
       
        var schema = new passwordValidator();
        let {key,api_url,user_fullname,company_name,username,password,mobileno,email,address, companyid, ip, port, userimage, report_cdr_id,createdby,userrole} = req.body;
         let is_special_charecter = special_format.test(password)//true or false

        let passwordConfiger = await pg.query(`select * from password_configuration limit 1`)

       if(passwordConfiger.rows[0].length){
        schema.is().min(passwordConfiger.rows[0].length)
         if(!schema.validate(password)){
            return res.json({passerror:`password length must be ${passwordConfiger.rows[0].length} or more`})
        }
    }
       if(passwordConfiger.rows[0].islowercase){
        schema.has().lowercase()
      if(!schema.validate(password)){
            return res.json({passerror:`password contain lowercase charecter `})
        }
    }
       if(passwordConfiger.rows[0].isuppercase){
        schema.has().uppercase()
    if(!schema.validate(password)){
            return res.json({passerror:`password contain uppercase charecter `})
        }
    }
       if(passwordConfiger.rows[0].isnumber){
        schema.has().digits()
     if(!schema.validate(password)){
            return res.json({passerror:`password contain digits `})
        }
    }
       if(passwordConfiger.rows[0].is_special_charecter){
         if(!is_special_charecter){
         return res.json({passerror:'password must have contain special charecter'})
        }
      }

       var salt = bcrypt.genSaltSync(10);
      var hashpass = bcrypt.hashSync(password, salt);

       
        let user = await pg.query(`select * from user_info where username='${username}' `);
        if (user.rowLength > 0) {
           return  res.status(400).json({error:"username is already taken"})
        }

        let query = `insert into user_info (key,user_fullname,company_name,userid, username , password,mobileno,email,address, companyid, ip, port, userimage, report_cdr_id, createddate, createdby,userrole,status) 
        values ('${key}','${user_fullname}','${company_name}',${uuid+=1}, '${username}','${hashpass}','${encrypt.encryptString(mobileno)}', '${encrypt.encryptString(email)}', '${encrypt.encryptString(address)}',${parseInt(companyid)}, '${encrypt.encryptString(ip)}','${encrypt.encryptString(port)}','${userimage}','${report_cdr_id}',toTimestamp(now()), ${parseInt(createdby)}, ${parseInt(userrole)}, 2);`;

        pg.query(query).then(()=>{ 
         
            // log4js.loggerinfo.info(`${uuid +=1} id User create Successfully by ${createdby}` );
            res.status(201).json({success:"User create Successfully"});
        }).catch(e=>res.json(e));

    }catch (e) {
        //log4js.loggererror.info(` can't create user` );
        res.json({error:"can't create user"})
    }
});
*/

router.post('/userlogin',module_check,async (req,res)=>{
    let {UserId,Password,Fcm} = req.body; console.log(req.body)
    let query = `select users.*,user_role.role_id as permissions from users left join user_role on users.user_id=user_role.user_id where users.phone='${UserId}'`;
    pg.query(query).then(async data=>{  
      
      if (data[0].length != 0) {

           let hashpass = data[0][0].password;
           let match =  bcrypt.compareSync(Password, hashpass);
           if(match){
      //check account is lock or not...
            if(data[0][0].status == 0 ){
                return res.json({success:false,message:"Your Account is Locked",data:{} })
            }
            else if( data[0][0].wrong_pin_attempt >= parseInt(process.env.wrong_pin_attempt)){
              AccountLock(data[0][0].user_id)
              return res.json({success:false,message:"Your Account is Locked",data:{} })
            }
            else{
              WrongPinAttemptWithDefaultValue(data[0][0].user_id)
            }

             let {user_id,phone,full_name,email,user_type,image,address,point,permissions,supplier_id:company_id,zone} = data[0][0]
             let account_info = await pg.query(`select balance from accounts where user_id= ${user_id}`);
             let balance = (account_info[0].length>0)?account_info[0][0].balance:0
             let UserInfo = {UserLoginId:user_id,FullName:full_name,Mobile:phone,EmailID:email,UserTypeID:user_type,Image:image,Address:address,MyPoint:point,Balance:balance}
             let login_datetime = new Date();
             let payload = {user_id,phone,full_name,email,user_type,login_datetime,permissions,zone,company_id}
             let  token = await jwt.sign(payload,appkey.jwtKye,{ expiresIn: '23h' });
                 try{ 
                     //store this token in session......
                     let x = await session_login(token,user_id,login_datetime);
                     if(!x){return res.json({success:false,message:"error while token store in session file",data:{} }) }
                  }catch(e){return res.json({success:false,message:"error while token store in session file",data:{} }) }
      
      return res.json({success:true,message:"Login Successfully done",data:{UserInfo:UserInfo,token:token}})

           }else{
            WrongPinAttemptInc(data[0][0].user_id)
            return res.json({success:false,message:`Your Account Will be locked more then ${process.env.wrong_pin_attempt-data[0][0].wrong_pin_attempt-1} wrong attempt`,data:{} })
          }
    }
    else{return res.json({success:false,message:"UserId is not Match",data:{} })}  

    }).catch(e=>res.json({success:false,message:"Database query execution error",data:{} }) )
  
});



router.post('/logout',async (req,res)=>{

    let authorization = req.header("authorization")
    if(!authorization){ return res.status(400).json({error:"no token provided"}); }
    authorization = authorization.split(" "); 
    if( authorization[0] != 'Bearer'){  return res.status(400).json({error:"Invalid token"}) }
    authorization = authorization[1]; 

   (session_logout(authorization))?res.json({success:true,message:"Logout Successfull",data:{} }):res.json({success:false,message:"Can't logout",data:{}})
})

module.exports = router;