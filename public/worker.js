//worker.js
const countSum= (n)=>{
 let sum = 0;
 for(let i =1; i <= n; i++){
  sum += i;
 }
 return sum
} 

self.addEventListener('message', function(e) {
  console.log("In worker (public): received data: "+ e.data)
  let sum = countSum(e.data)
  let message = 'In worker (public): The sum of 1 to ' + e.data + ' is ' + sum
  console.log(message)
  self.postMessage(sum)
}, false);