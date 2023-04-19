

export default function average(arr, key) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === "TRUE") {
        //console.log(arr[i][key])
        sum += 1;
      }
      else if (arr[i][key] === "FALSE") {
        //console.log(arr[i][key])
        sum += 0;
      }
      else if (arr[i][key] === "null") {
        sum += 0;
      }
      else {
      sum += parseInt(arr[i][key]);
      }
    }
    let ave = sum / arr.length;
    return parseFloat(ave.toFixed(2));
    
  }
  