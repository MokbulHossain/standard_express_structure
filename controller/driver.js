
const pg = require('../config/database').pg;

DriverDashboard = async(req,res)=>{
    let user_id = parseInt(req.user_info.user_id);
	let {trigger,history_date} = req.body
	let select_fields='',query='',history=false;

	if(!trigger || trigger.toLowerCase()=='all'){
       select_fields=`D.delivery_id,Us.full_name,O.order_id,D.from_location,D.to_location,O.grand_total`
        query = `select ${select_fields} from delivery as D inner join orders as O on O.order_id=D.order_id inner join users as Us on O.user_id=Us.user_id  where D.user_id=${user_id}`
	}
  else if(trigger.toLowerCase()=='ongoing'){ 
       select_fields=`D.delivery_id,Us.full_name,O.order_id,D.from_location,D.to_location,D.from_lat,D.from_long,D.to_lat,D.to_long,O.grand_total`
        query = `select ${select_fields} from delivery as D inner join orders as O on O.order_id=D.order_id inner join users as Us on O.user_id=Us.user_id  where D.user_id=${user_id} and D.delivery_status=8`	
  }
  else if(trigger.toLowerCase()=='complete'){
        select_fields=`D.delivery_id,Us.full_name,O.order_id,D.from_location,D.to_location,D.delivery_complete_date,O.grand_total`
        query = `select ${select_fields} from delivery as D inner join orders as O on O.order_id=D.order_id inner join users as Us on O.user_id=Us.user_id  where D.user_id=${user_id} and D.delivery_status=2`	
  
  }
   
  else if(trigger.toLowerCase()=='history'){
      history = true;
      select_fields=`D.delivery_id,Us.full_name,O.order_id,D.to_location,D.assign_date,O.grand_total`
       query = `select ${select_fields} from delivery as D inner join orders as O on O.order_id=D.order_id inner join users as Us on O.user_id=Us.user_id  where D.user_id=${user_id} and D.assign_date::date ='${history_date}'`	
 
  }

  if(history){

    pg.query(query).then(data=>{
      data[0].forEach((item,index)=>{
        let x= new Date(item.assign_date)
         data[0][index].assign_date = x.toLocaleTimeString()
      }) 
    return res.json({DriverDeliveryList:data[0]})
   }).catch(e=>res.json({success:false,message:"Database query execution error",data:{error:e.parent.routine} }) )

  }
  else{
       pg.query(query).then(data=>{
    return res.json({DriverDeliveryList:data[0]})
   }).catch(e=>res.json({success:false,message:"Database query execution error",data:{error:e.parent.routine} }) )
  }
 
 }

module.exports = {DriverDashboard}