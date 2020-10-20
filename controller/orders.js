
const pg = require('../config/database').pg;
const {CheckUserAccount,MinusFormUserAccount,InsertTransectionTable} = require('../helpers/sequelizeHelper');
const {DateDiffrenceBetweenToDate,expand,flatten} = require('../helpers/utilities');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const {OrderItem,Orders,Products,StatusType}  = require('../models');

const CalculateAmount = async(OrderDetailsList)=>{
    let totalCalculateAmount = 0;
    let ids = OrderDetailsList.map(item=>item.ProductID);
    let r = await pg.query(`select product_price,product_quantity,product_discount,discount_valid_date from products where product_id in (${ids.toString()}) and product_quantity>0 `)
    //check stock...
    if(r[0].length != ids.length){return {totalCalculateAmount:0,stockOut:0,Product2D:null} }

   let check =1,Product2D = [[]];
    r[0].some((item,inde)=>{ 
    	//check stock...
    	if(OrderDetailsList[inde].qty > item.product_quantity){
           check=0; return true;
    	}
    	 let datediff = DateDiffrenceBetweenToDate(item.discount_valid_date),singletotal = 0
    	 //check discount validity...
	        if(datediff > 0){
              //calculate discount...
	           singletotal = (OrderDetailsList[inde].qty*item.product_price)-((OrderDetailsList[inde].qty*item.product_price)*(item.product_discount/100))
	           totalCalculateAmount += singletotal
	        }
	        else{
	        	singletotal= OrderDetailsList[inde].qty*item.product_price
	        	totalCalculateAmount += singletotal
	        }
	      //product_id,product_quantity,total_price
	     Product2D[inde] = [OrderDetailsList[inde].ProductID,OrderDetailsList[inde].qty,singletotal] 
    })
    //check stock...
  if (!check) {return {totalCalculateAmount:0,stockOut:0,Product2D:null} }

    return {totalCalculateAmount:totalCalculateAmount,stockOut:1,Product2D:Product2D};
}

SubmitOrderDB = async (req,res)=>{
	let {OrderDetailsList} = req.body;
	OrderDetailsList = JSON.parse(OrderDetailsList)
    let user_id = parseInt(req.user_info.user_id);
    let useraccount = await CheckUserAccount(user_id);
    let {totalCalculateAmount,stockOut,Product2D} =await CalculateAmount(OrderDetailsList)
    //check stock...
    if(!stockOut){ return res.json({success:false,message:"Some of Product is not in stock",data:{} }) }

    //check Balance...
  if(useraccount.balance < totalCalculateAmount ){
   	return res.json({success:false,message:"Insufficient balance",data:{} })
   }
	
	pg.query(`insert into orders (user_id,grand_total,order_status,order_message) values($1,$2,$3,$4) RETURNING order_id`,
		{ bind:[user_id,totalCalculateAmount,3,'We have placed the order'], type: pg.QueryTypes.INSERT } ).then(async data=>{
		let order_id = data[0][0].order_id

		let NewProduct2D = Product2D.map( single_product => [parseInt(order_id),...single_product])
        await pg.query(`insert into order_product(order_id,product_id,product_quantity,total_price) values ${expand(NewProduct2D.length, 4)}`,
        	{ bind: flatten(NewProduct2D), type: pg.QueryTypes.INSERT } )
     //Reduce Balance...
      await MinusFormUserAccount(user_id,totalCalculateAmount);
      //insert inside transection...
      await InsertTransectionTable(user_id,totalCalculateAmount,1,3,order_id);

		return res.json({success:true,message:"Sucessfully Order placed",data:{} })

	}).catch(e=>res.json({success:false,message:"Database query execution error",data:{} }) )

}


 RetailerOrderList = async(req,res) =>{
	let user_id = parseInt(req.user_info.user_id);

 let orders = await Orders.findAll({
                attributes: ['order_id','order_date','grand_total'],
                  include: [ {model: OrderItem,
                              as: 'Items', 
                              include:[{model:Products,as:'product',attributes:['product_name']} ]
                          }, ],
                  where:{user_id:user_id},
                   order: [['order_id','DESC']],
            })
 //modify obj data...
let newObj = [],product_name=[],Pending=0,Accepted=0,Prepared=0,Dispatch=0,Completed=0
  for(index in orders){
  	var {order_id,order_date,grand_total,Items} = orders[index];
  	let ItemCount=0,Pending=0,Accepted=0,Prepared=0,Dispatch=0,delivery_status='0%';
  	  for(i in Items){
  	  	if(Items[i].status_id == 3){Pending ++}
  	  	if(Items[i].status_id == 7){Accepted ++}
  	  	if(Items[i].status_id == 5){Prepared ++}
  	  	if(Items[i].status_id == 6){Dispatch ++}
  	  	if(Items[i].status_id == 2){Completed ++}
  	  	product_name[i] = Items[i].product.product_name;ItemCount++
  	  }
  delivery_status = (Completed ==ItemCount )?'Completed':((Completed/ItemCount)*100)+'%'
  	  	product_item_name = product_name.toString()
  	  order_date = (new Date(order_date)).toLocaleDateString(undefined, options)
  	  	newObj[index] ={order_id,order_date,grand_total,product_item_name,Pending,Accepted,Prepared,Dispatch,delivery_status} 
  }
 return res.json({RetailerOrderList:newObj})

 }

 RetailerSingleOrderDetail = async(req,res) =>{
 	let order_id = req.params.order_id;
	let user_id = parseInt(req.user_info.user_id);
	let query = `select O.order_id ,order_date,grand_total
	 FROM orders AS O INNER JOIN status_types AS st on
	 O.order_status = st.id where O.user_id = ${user_id} and O.order_id=${order_id}`;

	 pg.query(query).then( async data =>{
	 	if (!data[0].length) {return res.json({RetailerOrderList:[]})}
         let products_query =`
			     select P.product_name,OP.product_quantity,(OP.total_price/OP.product_quantity) as product_price,
			       total_price, OP.status_id,st.status_name,u.full_name as delivery_man_name,u.lat as delivery_man_current_lat,
			       u.long as delivery_man_current_long
			from order_product as OP inner join products as P on OP.product_id=P.product_id
			       left join delivery d on OP.id = d.order_id
			left join users u on d.user_id = u.user_id
			left join status_types as st on OP.status_id=st.id
			where OP.order_id=${order_id};
			`
	 	 let products = await pg.query(products_query)
	 	     data[0][0].products =products[0] ;
	 	     //date formate...
	 	     let x= new Date(data[0][0].order_date)
           data[0][0].order_date = x.toLocaleDateString(undefined, options)

	 	return res.json({RetailerOrderList:data[0][0]})
	 })
 }


RetailerOrderTracking = async(req,res) =>{
  let user_id = parseInt(req.user_info.user_id);
  /*let AllOrderQuery = `select order_id as "CustomerOrderID",order_date as "OrderDate",order_message as "Comment",st.status_name as "StatusName",order_status as
	 "OrderStatusID" FROM orders AS O INNER JOIN status_types AS st on
	 O.order_status = st.id where O.user_id=${user_id} order by O.order_date ASC`*/

	 let AllOrderQuery = `select O.order_id as "CustomerOrderID",order_date as "OrderDate",order_message as "Comment",st.status_name as "StatusName",
       order_status as "OrderStatusID" ,u.full_name as DriverName,u.image as DriverImage,d.from_lat,d.from_long,d.to_lat,d.to_long
   FROM orders AS O INNER JOIN status_types AS st on
	 O.order_status = st.id left join delivery d on O.order_id = d.order_id
           left join users u on d.user_id = u.user_id where O.user_id=${user_id} order by O.order_date ASC`

	  pg.query(AllOrderQuery).then(async data =>{
	  	let NewOrder=null,AcceptedOrder=null,PreparedOrder=null,DispatchedOrder=null;
	  	 data[0].forEach((item,index)=>{
	  	 	let OrderStatusID = item.OrderStatusID
	  	 	//for all..delete OrderStatusID
	  	 delete data[0][index].OrderStatusID

	  	 	let x= new Date(item.OrderDate)
           data[0][index].OrderDate = x.toLocaleDateString(undefined, options)
           data[0][index].OrderTime = x.toLocaleTimeString()
            
            let storedata = {...data[0][index]};
            //delete unwanted key..
            delete storedata.drivername;delete storedata.driverimage
            delete storedata.from_lat;delete storedata.from_long
            delete storedata.to_lat;delete storedata.to_long

	  	 	if(OrderStatusID == 3){NewOrder=storedata}
	  	 	else if(OrderStatusID == 7){AcceptedOrder=storedata}
	  	 	else if(OrderStatusID == 5){PreparedOrder=storedata}
	  	 	else if(OrderStatusID == 6){DispatchedOrder=data[0][index]}
	  	 })
	 	return res.json({NewOrder:NewOrder,AcceptedOrder:AcceptedOrder,PreparedOrder:PreparedOrder,DispatchedOrder:DispatchedOrder})
	 })
}

 RequestList = async(req,res) =>{
   let query = `select order_id,order_date,order_location,order_lat,order_long,order_status as "StatusId",st.status_name,us.full_name,us.image FROM orders AS O INNER JOIN status_types AS st on
	 O.order_status = st.id inner join users as us on O.user_id = us.user_id order by O.order_id desc `
    
     pg.query(query).then(async data =>{
	 	return res.json({RetailerOrderList:data[0]})
	 })
 }

 RequestListSpecifyWithStatus=async(req,res)=>{
  let {statusId=7}=req.body
    let query = `select order_id,order_date,order_location,order_lat,order_long,order_status as "StatusId",st.status_name,us.full_name,us.image FROM orders AS O INNER JOIN status_types AS st on
   O.order_status = st.id inner join users as us on O.user_id = us.user_id where O.order_status=${parseInt(statusId)} order by O.order_id desc `
    
     pg.query(query).then(async data =>{
    return res.json({RetailerOrderList:data[0]})
   })
 }

 SingleRequestList = async(req,res) =>{
 	let order_id = req.params.order_id;
   let query = `select O.user_id,O.order_id as "CustomerOrderID",order_date as "OrderDate",order_message as "Comment",grand_total as "TotalAmount",order_lat as "OrderLat",
	 order_long as "OrderLong",order_location as "Location",O.order_status as "StatusId",st.status_name as "StatusName",O.order_discount as "Discount" FROM orders AS O INNER JOIN status_types AS st on
	 O.order_status = st.id where O.order_id=${order_id}`;
    
     pg.query(query).then(async data =>{
	 	if (!data[0].length) {return res.json({RetailerOrderList:[]})}
         let products_query =`select OP.product_id,P.product_name,OP.product_quantity,(OP.total_price/OP.product_quantity) as product_price,total_price from order_product as OP inner join products as P on OP.product_id=P.product_id where OP.order_id=${order_id}`
	 	 let products = await pg.query(products_query);
	 	 let user_info_query = `select full_name from users where user_id=${data[0][0].user_id}`
	 	 let user_data = await pg.query(user_info_query);
	 	 let driver_info_query = `select full_name from users inner join delivery on users.user_id=delivery.user_id where delivery.order_id=${order_id}`
	 	  let driver_info = await pg.query(user_info_query);

	 	     data[0][0].FullName =user_data[0][0].full_name ;
	 	     data[0][0].DriverName =driver_info[0][0].full_name ;
	 	     data[0][0].Products =products[0] ;
	 	return res.json({RetailerOrderList:data[0]})
	 })
 }

 AcceptRequest = async(req,res) =>{
 	let {OrderId} = req.body
 	let user_id = parseInt(req.user_info.user_id);
 	let query = `update orders set order_status=7,actionby_id=${user_id},update_date=now() where order_id=${parseInt(OrderId)}`
 	pg.query(query).then(data =>{
 		if(data[1].rowCount>0){return res.json({success:true,message:"Sucessfully Request is Accepted",data:{} })}
 		return res.json({success:false,message:"Error Occured",data:{} })
 	})
 }

 PreparedRequest = async(req,res) =>{
 	let {OrderId} = req.body
 		let user_id = parseInt(req.user_info.user_id);
 	let query = `update orders set order_status=5,actionby_id=${user_id},update_date=now() where order_id=${parseInt(OrderId)}`
 	pg.query(query).then(data =>{
 		if(data[1].rowCount>0){return res.json({success:true,message:"Sucessfully Request is Prepared",data:{} })}
 		return res.json({success:false,message:"Error Occured",data:{} })
 	})
 }

 DispatchOrder = async(req,res) =>{
 	let {OrderId} = req.body
 	let user_id = parseInt(req.user_info.user_id);
 	let query = `update orders set order_status=6,actionby_id=${user_id},update_date=now() where order_id=${parseInt(OrderId)}`
    pg.query(query).then(data =>{
 		if(data[1].rowCount>0){return res.json({success:true,message:"Sucessfully Request is Dispatch",data:{} })}
 		return res.json({success:false,message:"Error Occured",data:{} })
 	})
 }

 OrderComplete = async(req,res) =>{
    let {OrderId} = req.body
 	let user_id = parseInt(req.user_info.user_id);
 	let query = `update orders set order_status=2,actionby_id=${user_id},update_date=now() where order_id=${parseInt(OrderId)}`
    pg.query(query).then(async data =>{
    	let earning_amount = 10
    	let delivery_query = `update delivery set delivery_status=2,delivery_complete_date=now(),user_earn=${earning_amount} where order_id=${parseInt(OrderId)} `
    	await pg.query(delivery_query)
 		if(data[1].rowCount>0){return res.json({success:true,message:"Sucessfully Delivery is Complete",data:{earning_amount:earning_amount} })}
 		return res.json({success:false,message:"Error Occured",data:{} })
 	})
 }

//for Territori Officer...
OrderVsTergetGraphInfo=async(req,res) =>{
  let user_id = parseInt(req.user_info.user_id);

 let points=[{"barindex":0,"value":233,"lable":"01"},{"barindex":1,"value":300,"lable":"02"},
            {"barindex":2,"value":400,"lable":"03"},{"barindex":3,"value":200,"lable":"04"},
            {"barindex":4,"value":250,"lable":"05"},{"barindex":5,"value":324,"lable":"06"},
            {"barindex":6,"value":265,"lable":"07"},{"barindex":7,"value":489,"lable":"08"},
            {"barindex":8,"value":500,"lable":"09"},{"barindex":9,"value":401,"lable":"10"}]
 let orderamount = 7001,targer=10000,currentdate='01 April 2020'
 let OrderVsTerget = {currentdate,orderamount,targer,points}
   return res.json({success:true,data:OrderVsTerget})

}






module.exports = {
	               SubmitOrderDB,RetailerOrderList,RequestList,
	               RetailerSingleOrderDetail,SingleRequestList,
	               AcceptRequest,PreparedRequest,DispatchOrder,
	               OrderComplete,RetailerOrderTracking,RequestListSpecifyWithStatus,
                 OrderVsTergetGraphInfo
	             };