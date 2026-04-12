//convert [["name","prasad"],["age",25]] into [{"name":"prasad"},{"age":25}]

// function convertArrToObj(array){
//     let result=[];
//     for(let item of array){
//         let Obj={
//             [item[0]]:item[1]
//         }
//         result.push(Obj)
//     }
//     return result
// }

// console.log(convertArrToObj([["name","prasad"],["age",25],["village","svm"]]));

//convert [{"name":"prasad"},{"age":25}]  into [["name","prasad"],["age",25]]

// const obj=[{"name":"prasad","age":27,"village":"svm"}]

// function convertObjToArr(array){
//     for(let item of array){
//         return Object.entries(item);
//     }
// }

// console.log(convertObjToArr(obj));

// const findMax=(array)=>{
//     let num=array[0];
//     for(let i=1;i<array.length;i++){
//         if(num < array[i]){
//             num = array[i]
//         }
//     }
//     return num
// }
// console.log(findMax([1,2,5,6,251,95,0,62,45]));


// const sortingArray=(array)=>{
//     let newArra=[];
//     let num=array[0];
//     for(let i=1;i<array.length;i++){
//         for(let j=0;j<newArra.length;i++){
//             if(num < array[i]){
//                 num = array[i];
//             }
//         }
//     }
// };
// console.log(sortingArray([5,8,6,95,1,2,5]));

// const findSecondMax=(array)=>{
//     array.sort((a,b)=>b-a);
//     console.log(array[1]);
// };

// console.log(findSecondMax([1,2,5,6,21,95,0,62,45]));


// const obj={
//     a:2,
//     b:3,
//     sum:function(){
//         return this.a + this.b
//     }
// }
// let res = obj.sum.bind(obj);
// console.log(res());

// const a={};
// const b={key:"b"}
// const c={key:"c"}

// a[b] = 123;
// a[c] = 456;

// console.log(a[b]);


//missing number in sequence

const array=[1,2,5,3,7];
const n=7;

// const missingNum=(array,n)=>{
//     let nSum= n*(n+1)
//     let arraSum=array?.reduce((a,b)=>a+b,0);    
//     return nSum/2 - arraSum
// };

// console.log(missingNum(array,5));

// const missingNums=(array,n)=>{
//     let obj={};
//     let missArray=[];
//     for(let num of array){
//         obj[num] = num;
//     }
//     for(let i=1;i<n;i++){
//         if(obj[i] == undefined){
//             missArray.push(i)
//         }
//     }
//     return missArray
// };

// console.log(missingNums(array,n));

// const removeDuplicate=(array)=>{
//     let setArr = new Set(array);
//     let newArray=[];
//     for(let i=0;i<array.length;i++){
//         if(!newArray.includes(array[i])){
//             newArray.push(array[i])
//         }
//     }
//     return {
//         set:[...setArr],
//         newArray:newArray
//     }    
// };
// console.log(removeDuplicate([1,2,5,3,1,5,3,4,1,2]));

// const sorting=(array)=>{
//     for (let i = 0; i < array.length; i++) {
//         for (let j = 0; j < array.length - i - 1; j++) {
//             if (array[j] > array[j + 1]) {
//                 let temp = array[j];
//                 array[j] = array[j + 1];
//                 array[j + 1] = temp;
//             }
//         }
//     }
//     return {
//         sort : array.sort((a,b)=>a-b),
//         sorted:array
//     }
// };
// console.log(sorting([4,5,2,1,3]));


// const binarySort=(array)=>{
//     for(let i=0;i<array.length;i++){
//         for(let j=0;j<array.length - i - 1;j++){
//             if(array[j] > array[j+1]){
//                 let temp = array[j];
//                 array[j] = array[j+1];
//                 array[j+1] = temp
//             }
//         }
//     }
//     return {
//         sort:array.sort((a,b)=>a-b),
//         array:array
//     }
// };
// console.log(binarySort([1,0,1,1,0,1,0,0,1,0,1]));

// const checkTwoArrays=(array1,array2)=>{
//    if(array1.length !== array2.length){
//     return false
//    }else{
//     for(let i=0;i<array1.length;i++){
//         if(array1[i] == array2[i]){
//             return true
//         }
//     }
//    }
// };
// console.log(checkTwoArrays([1,2,3,"4"],[1,2,"3",4]));

// console.log(1+"1");//11
// console.log(1-"1");//0
// console.log(1 == 1);//true
// console.log(1 == "1");//true
// console.log(1 === "1");//false
// console.log(1 === 1);//true
// console.log({} == {}); //false
// console.log([] == {}); //false
// console.log([1] == 1); //true
// console.log([1] === 1); //false
// console.log(NaN == NaN);//false
// console.log(NaN === NaN);//false

// console.log([1] == {}) ;//false
// for(var i=0;i<3;i++){
//     setInterval(()=>{
//         console.log(i);
//     },1000)
// }

// for(let i=0;i<3;i++){
//     setInterval(()=>{
//         console.log(i);
//     },1000)
// }


// const str="hiuyfghfhgdtrhghg";
// function repeatedAlpha(str){
//     const arry=str.split("");
//     let obj={};
//     let count=0;
//     for(let i of arry){
//         obj[i] = (obj[i] + 1) || 1
//     }
//     return  obj
// }
// console.log(repeatedAlpha(str));
