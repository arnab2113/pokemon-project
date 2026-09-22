const createBtn =document.querySelector("#create");
const formDiv =document.querySelector(".form");
const closeBtn =document.querySelector("#close")

const productDiv =document.querySelector(".products")
const form=document.querySelector("form")

const productsArr=[];
let lsd = JSON.parse(localStorage.getItem("products"));
let updateIndex=null;

let ui =()=>{
    productDiv.innerHTML ="",
    lsd.forEach((elem,index)=>{
     productDiv.innerHTML += `  <div class="product-card">
            <div class="img">
                <img src="${elem.image}" alt="">
            </div>
            <div class="text">
                <h3>${elem.productName}</h3>
                <p>${elem.description}</p>
                <p>${elem.price}</p>
            </div>
            <div class="btns">
                <button onclick ="updateProduct('${elem.productName}')"  id="update">Update</button>
                <button onclick ="deleteProduct('${index}')"   id="delete">Delete</button>
            </div>
        </div>`;
    });
}
ui();

createBtn.addEventListener("click", ()=>{
    formDiv.style.display="flex";
});
closeBtn.addEventListener("click",()=>{
    formDiv.style.display="none";
});
 form.addEventListener('submit',(event)=>{
   event.preventDefault();
   let productName=event.target[0].value;
   let description=event.target[1].value;
   let price=event.target[2].value;
   let image=event.target[3].value;
   if(productName.trim() ==="" || 
   description.trim()==="" || 
   price.trim() === "" || 
   image.trim() === ""){
    alert("plese fill all the fields");
    return ;
   }  


   let obj={
    productName,
    description,
    price,
    image
   };
   if(updateIndex !== null){
    productsArr[updateIndex]=obj;
    updateIndex=  null;
    localStorage.setItem("products",JSON.stringify(productsArr));
   }
   else{
        productsArr.push(obj);
        localStorage.setItem("products",JSON.stringify(productsArr));
   }

   ui();
   console.log(productsArr)

   form.reset();
   formDiv.style.display="none";
 });

 const updateProduct = (name) =>{
     formDiv.style.display="flex";
    let product = productsArr.find((elem) => elem.productName ===  name);
     updateIndex = productsArr.findIndex((elem) => elem.productName ===  name);
    form[0].value = product.productName;
    form[1].value = product.description;
    form[2].value = product.price;
    form[3].value = product.image;
 };
 const deleteProduct = (index) =>{
    productsArr.splice(index,1);
    ui();
 }


//  localStorage.setItem('name','Arnab');
//   localStorage.setItem('song','dj');
// const ar=localStorage.getItem('name');
// console.log(ar);

// let  data =[
//     {
//         name:'Arnab Maity',
//         age: 21,
//         address:'Keshapat',
//         pincode:721139,
//     },
//      {
//         name:'Arpita Maity',
//         age: 22,
//         address:'Keshapat',
//         pincode:721139,
//     },
//      {
//         name:'Amit Maity',
//         age: 50,
//         address:'Keshapat',
//         pincode:721139,
//     },
//      {
//         name:'Rajashree Maity',
//         age: 21,
//         address:'Keshapat',
//         pincode:721139,
//     },
//     {
//         name:'Arnesh Maity',
//         age: 21,
//         address:'Keshapat',
//         pincode:721139,
//     },
// ];
// localStorage.setItem("family Member" , JSON.stringify(data));
// const lsd = localStorage.getItem("family Member");

// let value =JSON.parse(lsd);
// console.log(value);