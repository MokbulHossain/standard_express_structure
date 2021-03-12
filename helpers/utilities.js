
var fs = require('fs');
require('dotenv').config()


const genRandomInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min
const getlength=(number)=>number.toString().length
const  format = str => str.toString().length === 1 ? '0' + str : str;

const monthInLeter=['January','February','March','April','May','June','July','August','September','October','November','December']

 module.exports = {

    monthInLeter,

  base64fileUpload:(image,ext)=>{
   let data = image.split(';base64,')
    let buff = Buffer.from(data[1], 'base64');
    let initialUrl = `images/image${Date.now()}.${ext}`
    fs.writeFileSync(`./public/${initialUrl}`, buff);
    return `${process.env.host}/${initialUrl}`

  },
    // expand(3, 2) returns "($1, $2), ($3, $4), ($5, $6)" 
     expand:(rowCount, columnCount, startAt=1)=>{
      var index = startAt
      return Array(rowCount).fill(0).map(v => `(${Array(columnCount).fill(0).map(v => `$${index++}`).join(", ")})`).join(", ")
    },

    // flatten([[1, 2], [3, 4]]) returns [1, 2, 3, 4]
     flatten :(arr) => {
      var newArr = []
      arr.forEach(v => v.forEach(p => newArr.push(p)))
      return newArr
    },

    dateSplitReverse: str =>{
     return str.split("-").reverse().join("-");
    },
    format,

    getTimeStampToDateTime : str =>{
           var date = new Date(str);
           return date.toDateString() +' '+ date.toLocaleTimeString()
    },

    getTimeStampAfterSubtructSomeDays: (str = new Date(),subtructDate=2) =>{
        var date1 = new Date(str);
        var daysPrior = 2;
        date1.setDate(date1.getDate() - daysPrior);
        return date1.toISOString();
    },
  SecondDifferenceBetweenToDate: datetime =>{
        var t2 = new Date(datetime);
        var t1 = new Date(Date.now());
        var dif = t1.getTime() - t2.getTime();
        var Seconds_from_T1_to_T2 = dif / 1000;
    
       return Math.floor(Seconds_from_T1_to_T2);
    },
       DateDiffrenceBetweenToDate:datetime=>{
        var t1 = new Date(datetime);
        var t2 = new Date(Date.now());
        var dif = t1.getTime() - t2.getTime();
        var Date_from_T1_to_T2 = dif / (1000*60*60*24);
       return Math.floor(Date_from_T1_to_T2)
    },
    getFormattedDate: (str= new Date() ) => {

        const todayTime = new Date(str);
        const month = format(todayTime .getMonth() + 1);
        const day = format(todayTime .getDate());
        const year = (todayTime .getFullYear());
        return day + "/" + month + "/" + year;

    },
    getPreviousMonthYear:(str= new Date())=>{

        const todayTime = new Date(str);
        todayTime.setMonth(todayTime.getMonth()-1)
        const month = format(todayTime .getMonth());
        const year = (todayTime .getFullYear()); 
        return  monthInLeter[month] + "-" + year;
    },

    toDate: dateStr => {

        const [ day, month, year ] = dateStr.split("/");
        return new Date(year, month - 1, day).toISOString();

    },

    //10/12/2020   { day: '10', month: '12', year: '2020' }
    toDateMonthYear:dateStr=>{
        const [ day, month, year ] = dateStr.split("/");
        return {day, month, year};
    },

    genRandom : () => {

        return  Math.floor(100000 + Math.random() * 900000); //6 digit
    
    },
    genRandomInRange ,

     //*OYY!3@U6.y
     generateRandomString : ()=>{
       
        let input = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",0,1,2,3,4,5,6,7,8,9,'|','?','/','&','*','%','$','@','!','_','-','+',',',')','(','{','}','[',']']
 
        let stringNumber =  genRandomInRange(8,12) ,inputLength = input.length
        let randomString = '';
          for(let i=0;i<stringNumber;i++){
               
               randomString += input[genRandomInRange(0,inputLength)]
          }
 
          return randomString
 
     },

     //45896 = 5
     getlength,

     //548 = 000548
     fillWithZero:(number,fillLength=6)=>{

        const lenghtOfNumber = getlength(number)
        let output = number.toString()

        if(lenghtOfNumber < fillLength){
            for(let i=0;i<fillLength-lenghtOfNumber;i++){
                output ='0'+output
            }
            return output
        }
        else{
            return number
        }
     }
    

};