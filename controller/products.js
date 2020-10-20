
const pg = require('../config/database').pg;
const {DateDiffrenceBetweenToDate} = require('../helpers/utilities');

GetProductList = async (req,res)=>{
    let query = `Select product_id as "ProductID",product_name as "ProductName",
    product_details as "ProductDetails",product_price as "Price",product_image as "ProductImage",
    product_discount,discount_valid_date from products where product_status=1 and product_quantity > 0  ORDER BY RANDOM() `; //order by product_id DESC
    pg.query(query).then(async data=>{ 

    	if(data[0].length>0){
    	await data[0].forEach((item,inde)=>{
             let datediff = DateDiffrenceBetweenToDate(item.discount_valid_date)
                if(datediff < 1){
                   data[0][inde].product_discount = 0
                }
              delete data[0][inde].discount_valid_date
    		})
    	}
        res.json({ProductList:data[0]})
     }).catch(e=>res.json({success:false,message:"Database query execution error",data:{} }) )
}

StockInfo = async(req,res)=>{
	let query = `select product_id,product_name,product_quantity,product_capacity from products order by product_capacity DESC`
	pg.query(query).then(data=>{
		res.json({StackInfo:data[0]})
	}).catch(e=>res.json({success:false,message:"Database query execution error",data:{error:e.parent.routine}  }) )
}

module.exports = {GetProductList,StockInfo};