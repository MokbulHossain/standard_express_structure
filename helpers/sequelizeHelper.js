const pg = require('../config/database').pg;

module.exports= { 

    CheckUserExist: async (req,res) => {
      let user_id = parseInt(req.user_info.user_id);
      let userinfo = await pg.query(`select * from users where user_id= ${user_id}`);
      if(userinfo[0].length == 0){
        return res.status(400).json({success:false,message:"UserId is not Match",data:{} })
      }else{
        return userinfo[0][0];
      }
    },

     CheckUserExistWithAccountStatus: async (req,res) => {
      let user_id = parseInt(req.user_info.user_id);
      let userinfo = await pg.query(`select * from users where user_id= ${user_id} `);
      if(userinfo[0].length == 0){
        return res.json({success:false,message:"UserId is not Match",data:{} })
      }else{
          if(userinfo[0][0].status == 0){
            return res.status(400).json({success:false,message:"This Account is Locked",data:{} })
          }
        return userinfo[0][0];
      }
    },

     CheckUserAccount: async (user_id) => {
      let UserAccountInfo = await pg.query(`select * from accounts where user_id= ${user_id} `);
        return UserAccountInfo[0][0];
    },
  MinusFormUserAccount:async(user_id,balance)=>{
    await pg.query(`update accounts set balance= balance-${balance} where user_id=${user_id};`)
  },

  InsertTransectionTable:async(user_id,amount,typeId,statusId,order_id=null)=>{
    await pg.query(`insert into transections(user_id, transection_amount, transection_type_id, transection_status, transection_date,order_id) values (${user_id},${amount},${typeId},${statusId},now(),${order_id})`)
  },

  AccountLock:async(user_id)=>{
     await pg.query(`update users set status=0 where user_id=${user_id}`)
  },
  WrongPinAttemptInc:async(user_id)=>{
    await pg.query(`update users set wrong_pin_attempt=wrong_pin_attempt+1 where user_id=${user_id}`)
  },
   WrongPinAttemptWithDefaultValue:async(user_id)=>{
    await pg.query(`update users set wrong_pin_attempt=0 where user_id=${user_id}`)
   }

};