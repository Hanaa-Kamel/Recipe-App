
const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn= document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');

getRandomMeal();
fetchFavMeals();


//----------Random Meal
async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);

}

//----------Meal By ID
async function getMealById(id) {
    const resp = await fetch('https://polar-thicket-79161.herokuapp.com/http://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}

//----------Search for meal
async function getMealBySearch(term) {
    const resp = await fetch('https://polar-thicket-79161.herokuapp.com/http://www.themealdb.com/api/json/v1/1/search.php?s=' + term)

    const respData = await resp.json();
    const meals =  respData.meals;

    return meals;
}

//---------- add random meal
function addMeal(mealData, random = false) {
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
<div class="meal-header">
${random ? `<span class="random">Random Recipe </span>` : ''}
  <img 
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
  />
</div>
<div class="meal-body">
  <h4>${mealData.strMeal}</h4>
  <button class="fav-btn"><i class="fas fa-heart"></i></button>
</div>
    `;
    //add meal to header
    const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener
        (("click"), () => {
            if (btn.classList.contains("active")) {
                removeMeallS(mealData.idMeal);
                btn.classList.remove("active");
            } else {
                addMealslS(mealData.idMeal);
                btn.classList.add("active");
            }
          
            fetchFavMeals();
        });

        //show ingredients
        meal.addEventListener('click',()=>{
            showMealInfo(mealData);
        } )
    mealsEl.appendChild(meal);
};

//----------add meal to local storge
function addMealslS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

//----------remove meal from local storge
function removeMeallS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem("mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

//----------update meal to fav list meal 
function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}

//----------SHOW meal to fav list meal UI
async function fetchFavMeals() {
    //cleanthe container
    favContainer.innerHTML="";

    const mealIds = getMealsLS();
    const meals = [];
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        //add meals to screen
        addMealFav(meal);
    }
}

function addMealFav(mealData) {
  
    const favMeal = document.createElement('li');

  

    favMeal.innerHTML = `
  <li>
   <img
     src="${mealData.strMealThumb}"
     alt="${mealData.strMeal}"
   />
   <span>${mealData.strMeal}</span>
   </li>
    <button class="clear"><i class="fas fa-window-close"></i></button>
   `;

   const btn = favMeal.querySelector('.clear');
//remove meal 
   btn.addEventListener('click',()=>{
    removeMeallS(mealData.idMeal);
    fetchFavMeals();
   });
//show ingredirnts for fav meal
   favMeal.addEventListener('click',()=>{
    showMealInfo(mealData);
   });
    favContainer.appendChild(favMeal);
};

//---------- show meal info / ingredirnts

function showMealInfo(mealData){
    //clean meal info
    mealInfoEl.innerHTML ="";
    //update meal info
    const mealEl = document.createElement('div');

    const ingredirnts =[];
//get ingredirnts and measures 
    for(let i=1; i<20 ; i++){
        if(mealData['strIngredient'+i]){
            ingredirnts.push(
                `${mealData['strIngredient'+i]} 
                - ${mealData['strMeasure'+i]}`);
        }
        else{
            break;
        }
    }

    mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">
    <p>${mealData.strInstructions}
      </p>
      <h3>Ingredirnts: </h3>
      <ul>
      ${ingredirnts
        .map(
            (ing) =>
            `
        <li>${ing}</li>
        `
      )
      .join("")}

      </ul>
 
      `
    mealInfoEl.appendChild(mealEl);
    //show popup
    mealPopup.classList.remove('hidden');
}

//---------- Search 

searchBtn.addEventListener('click', async ()=>{
   // Clean container
   mealsEl.innerHTML="";
    const search = searchTerm.value;

    console.log(await getMealBySearch(search));
    const meals = await getMealBySearch(search);

   if(meals){
    meals.forEach((meal)=>{
        addMeal(meal);
    });
   }

})


//---------- ingredients
popupCloseBtn.addEventListener('click',()=>{
    mealPopup.classList.add('hidden');
})
