// const five=document.querySelector("#five");
// const main= document.querySelector("main")

// five.addEventListener("click",(event) =>{
//     console.log(event.target);
// })
// main.addEventListener("click",(e) =>{
//     console.log(e.target);
// })
// setInterval(()=>{
//     console.log("hey....")
// },1000)
// setTimeout(()=>{
//     console.log("i'm timeout....")
// },1000)
// let random=Math.random();
// let r=Math.floor(random);
// console.log(r);

const main= document.querySelector("main");
const overlay = document.querySelector("#overlay");

const btn = document.querySelector("button");
const timer= document.querySelector("#timer");
const scoree= document.querySelector("#score")
const box = document.createElement("div");
box.classList.add("box");
let time=0;
let score = 0;
let interval;
const randomColor = ()=>{
let r= Math.floor(Math.random()*256);
let g= Math.floor(Math.random()*256);
let b= Math.floor(Math.random()*256);
return `rgb(${r},${g},${b})`;
};
const randomBox=()=>{
    box.style.backgroundColor=randomColor();
    main.append(box)
    let mainH =main.clientHeight - box.offsetHeight;
    let mainW =main.clientWidth - box.offsetWidth;
    
    const rY=Math.random() * mainH;
    const rX=Math.random() * mainW;
    box.style.top= `${rY}px`;
    box.style.left=`${rX}px`;
};


btn.addEventListener('click', ()=>{
    
    clearInterval(interval);
   
    interval=setInterval(()=>{
    randomBox();
      time +=1;
     timer.textContent=time;
    },1000);
    setTimeout(() => {
       clearInterval(interval);
       overlay.style.display="flex"
    },10000);
});
box.addEventListener("click",() =>{
    score +=1;
    scoree.textContent= score;
});