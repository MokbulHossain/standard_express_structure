
var fs = require('fs');
require('dotenv').config()

 module.exports = {

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
    format: str => {

        return str.toString().length === 1 ? '0' + str : str;

    },

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
    getFormattedDate: str => {

        const todayTime = new Date(str);
        const month = this.format(todayTime .getMonth() + 1);
        const day = this.format(todayTime .getDate());
        const year = (todayTime .getFullYear());
        return day + "/" + month + "/" + year;

    },

    toDate: dateStr => {

        const [ day, month, year ] = dateStr.split("/");
        return new Date(year, month - 1, day).toISOString();

    },

    genRandom : () => {

        return  Math.floor(100000 + Math.random() * 900000); //6 digit
    
    },
    /*
    [1, 2, 3].includes(2);     // true
    [1, 2, 3].includes(4);     // false
    [1, 2, 3].includes(1, 2);  // false (second parameter is the index position in this array at which to begin searching)
    */

    /*
     const credits = { producer: 'John', director: 'Jane', assistant: 'Peter' };
    const arr1 = Object.entries(credits); // [ [ 'producer', 'John' ],[ 'director', 'Jane' ],[ 'assistant', 'Peter' ] ]  
    const arr2 = Object.keys(credits); //[ 'producer', 'director', 'assistant' ]   
    const arr3 = Object.values(credits); //[ 'John', 'Jane', 'Peter' ]   
    */

};