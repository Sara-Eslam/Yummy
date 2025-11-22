var toggleIcon = document.querySelector("#toggle-icon");
var sideBar = document.querySelector(".sidebar");
var items = document.querySelectorAll(".nav-item");
var spinner = document.querySelector("#spinner");
var searchLink = document.querySelector(".search a");
var categoryLink = document.querySelector(".category a");
var areaLink = document.querySelector(".area a");
var ingradLink = document.querySelector(".ingrad a");
var contactLink = document.querySelector(".contact a");
var nameSearch = document.querySelector(".nameSearch");
var letterSearch = document.querySelector(".lettersearch");
var oneletter = /^[a-zA-Z$]/;

// INDEX.HTML
async function getInitialMeals() {
    spinner.classList.replace("d-none", "d-block");
    var firstResponse = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    var initialMeals = await firstResponse.json();
    var meals = initialMeals.meals;
    spinner.classList.replace("d-block", "d-none");
    var content = '';
    for (let i = 0; i < meals.length; i++) {
        content += `
<div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meals[i].idMeal}')">
        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${meals[i].strMeal}
        </div>
    </div>
</div>`;

    }
    document.querySelector(".main-meals").innerHTML = content;
}
const path = window.location.pathname;
if (path.endsWith("/") || path.endsWith("/index.html")) {
    getInitialMeals();
}



toggleIcon.addEventListener("click", function () {

    if (sideBar.style.transform === "translateX(0px)") {
        sideBar.style.transform = "translateX(-80%)";
        toggleIcon.classList.replace("fa-xmark", "fa-bars");
        items.forEach(item => {
            item.classList.remove("show");
        });

    } else {
        sideBar.style.transform = "translateX(0px)";
        toggleIcon.classList.replace("fa-bars", "fa-xmark");
        items.forEach((item, index) => {
            setTimeout(() => { item.classList.add("show"); }, index * 100);
        });
    }
});

// MEALDETAILS.HTML
function goToMeal(mealId) {
    window.location.href = `mealDetails.html?id=${mealId}`;
}

var spinner = document.querySelector("#spinner");
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");

if (mealId) {
    getMealDetails(mealId);
}

async function getMealDetails(id) {
    spinner.classList.replace("d-none", "d-block");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    const meal = data.meals[0];
    var content = `<div class="col-lg-4 col-md-5 col-12 mb-4">
                <div class="img-indetails rounded-3">
                    <img src="${meal.strMealThumb}" alt="" class="w-100 rounded-3">
                </div>
                <h3 class="pt-2 text-center">${meal.strMeal}</h3>
            </div>
            <div class="col-lg-8 col-md-7 col-12">
                <h4>Instructions</h4>
                <p>${meal.strInstructions}</p>
                <h4 class="area">Area : ${meal.strArea} </h4>
                <h4 class="category">Category :  ${meal.strCategory}</h4>
                <h4>Recipes:</h4>
                <div class="ingredients mb-3"></div>
                <h4>Tags:</h4>
                <div class="mb-3 tags"></div>
                <a href="${meal.strSource}" target="_blank" class="btn bg-success text-white source-btn me-2">Source</a>
                <a href ="${meal.strYoutube}" target="_blank" class="btn bg-danger text-white youtube-btn">Youtube</a>
            </div>`;
    document.querySelector(".meals").innerHTML = content;
    let ingredientsBox = document.querySelector(".ingredients");
    ingredientsBox.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredientsBox.innerHTML += `<span class="badge bg-warning text-dark m-1 p-2 fs-6">${measure} ${ingredient}</span>`;
        }
    }
}

// SEARCHPAGE.HTML

if (searchLink) {
    searchLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "searchPage.html";
    });
}


let timeout = null;
function searchByNameDelay(name) {
    clearTimeout(timeout);
    timeout = setTimeout(() => { searchByName(name); }, 400);
}

async function searchByName(mealName) {

    let foundedMeal = document.querySelector(".foundedMeal");
    foundedMeal.innerHTML = "";
    if (mealName.trim() === "") return;
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    if (data.meals === null) {
        foundedMeal.innerHTML = `<p class="fs-4 text-white">No meals found</p>`;
        return;
    }
    let meals = data.meals;
    let exactMeal = meals.find(m => m.strMeal.toLowerCase() === mealName.toLowerCase()
    );
    if (exactMeal) {
        foundedMeal.innerHTML = `
        <div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${exactMeal.idMeal}')">
        <img src="${exactMeal.strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${exactMeal.strMeal}
        </div>
    </div>
</div>`;
        return;
    }
    for (let i = 0; i < meals.length; i++) {
        foundedMeal.innerHTML += `
        <div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meals[i].idMeal}')">
        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${meals[i].strMeal}
        </div>
    </div>
</div>`;
    }
}
async function searchByLetter() {
    let letter = letterSearch.value.trim();
    if (!oneletter.test(letter)) return;

    let foundedMeal = document.querySelector(".foundedMeal");
    foundedMeal.innerHTML = "";

    spinner.classList.replace("d-none", "d-block");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");

    if (!data.meals) {
        foundedMeal.innerHTML = `<p class="fs-4 text-white">No meals found</p>`;
        return;
    }

    for (let meal of data.meals) {
        foundedMeal.innerHTML += `
        <div class="col-lg-3 col-md-4 col-12">
            <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" class="w-100 rounded-3">
                <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
                    ${meal.strMeal}
                </div>
            </div>
        </div>`;
    }
}

// GATERORIESPAGE.HTML

if (categoryLink) {
    categoryLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "categoriesPage.html";
    })

}

async function getAllcategories() {
    spinner.classList.replace("d-none", "d-block");
    let content = "";
    let response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    for (let i = 0; i < data.categories.length; i++) {
        let words = data.categories[i].strCategoryDescription.split(" ");
        let shortDesc = "";
        if (words.length <= 20) {
            shortDesc = data.categories[i].strCategoryDescription;
        } else if (words.length <= 40) {
            shortDesc =
                words.slice(0, Math.floor(words.length / 2)).join(" ") + "...";
        } else {
            shortDesc =
                words.slice(0, Math.floor(words.length / 4)).join(" ") + "...";
        }
        content += `
        <div class="col-lg-3 col-md-4 col-12">
            <div class="card cat bg-black" onclick="goToCatMeals('${data.categories[i].strCategory}')">
                <img src="${data.categories[i].strCategoryThumb}" alt="">
                <div class="card-layer rounded-1 text-center text-black">
                    <h4>${data.categories[i].strCategory}</h4>
                    <p>${shortDesc}</p>
                </div>
            </div>
        </div>`;
    }
    document.querySelector(".cats").innerHTML = content;
}
if (window.location.href.includes("categoriesPage.html")) {
    getAllcategories();
}
const urlCatParams = new URLSearchParams(window.location.search);
const cateName = urlParams.get("categoryName");
function goToCatMeals(catName) {
    window.location.href = `mealsBassedCategory.html?categoryName=${catName}`;
}
if (cateName) {
    getCategoryMeals(cateName);
}
async function getCategoryMeals(catName) {
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`);
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    let meals = data.meals;
    let content = '';
    let length;
    if (meals.length >= 20) {
        length = 20
    }
    else {
        length = meals.length;
    }
    for (let i = 0; i < length; i++) {
        content += `<div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meals[i].idMeal}')">
        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${meals[i].strMeal}
        </div>
    </div>
</div>`
    }
    document.querySelector(".catMeals").innerHTML = content;
}

// AREAS.HTML

if (areaLink) {
    areaLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "areasPage.html";
    });
}

async function getAllAreas() {
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    let meals = data.meals;
    let content = '';
    for (let i = 0; i < 20; i++) {
        content += `<div class=" col-lg-3 col-md-4 col-12">
                <div class="card text-center bg-black text-white" onclick="goToAreaMeals('${meals[i].strArea}')">
                    <i class="fa-solid fa-house-laptop fa-4x area-icon"></i>
                    <h3>${meals[i].strArea}</h3>
                </div>
            </div>`
    }
    document.querySelector(".areas").innerHTML = content;

}
if (window.location.href.includes("areasPage.html")) {
    getAllAreas();
}

function goToAreaMeals(areaName) {
    window.location.href = `mealsBassedArea.html?areaName=${areaName}`;
}
const urlAreaParams = new URLSearchParams(window.location.search);
const areaName = urlParams.get("areaName");
if (areaName) {
    getAreaMeals(areaName);
}
async function getAreaMeals(areaName) {
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    meals = data.meals;
    let content = '';
    let length;
    if (meals.length >= 20) {
        length = 20
    }
    else {
        length = meals.length;
    }
    for (let i = 0; i < length; i++) {
        content += `<div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meals[i].idMeal}')">
        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${meals[i].strMeal}
        </div>
    </div>
</div>`
    }
    document.querySelector(".areaMeals").innerHTML = content;
}
// INGREDIANTS.HTML
if (ingradLink) {
    ingradLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "ingrediantPage.html";
    });
}
async function getAllIngred() {
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    let meals = data.meals;
    for (let i = 0; i < meals.length; i++) {
        let words = meals[i].strDescription.split(" ");
        let shortDesc = "";
        if (words.length <= 20) {
            shortDesc = meals[i].strDescription;
        } else if (words.length <= 40) {
            shortDesc =
                words.slice(0, Math.floor(words.length / 2)).join(" ");
        } else {
            shortDesc =
                words.slice(0, Math.floor(words.length / 4)).join(" ");
        }
        let content = '';
        for (let i = 0; i < 20; i++) {
            content += `<div class=" col-lg-3 col-md-4 col-12">
                <div class="card text-center bg-black text-white" onclick="goToIngredMeals('${meals[i].strIngredient}')">
                    <i class="fa-solid fa-drumstick-bite fa-4x ingred-icon"></i>
                    <h3>${meals[i].strIngredient}</h3>
                    <p>${shortDesc}</p>
                </div>
            </div>`;
        }
        document.querySelector(".ingrds").innerHTML = content;

    }
}
if (window.location.href.includes("ingrediantPage.html")) {
    getAllIngred();
}

function goToIngredMeals(ingredName) {
    window.location.href = `mealsBassedIngrediant.html?ingredName=${ingredName}`;
}

const urlIngredParams = new URLSearchParams(window.location.search);
const ingeName = urlParams.get("ingredName");
if (ingeName) {
    getIngredMeals(ingeName);
}

async function getIngredMeals(ingrediantName) {
    spinner.classList.replace("d-none", "d-block");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediantName}`);
    let data = await response.json();
    spinner.classList.replace("d-block", "d-none");
    meals = data.meals;
    let content = '';
    let length;
    if (meals.length >= 20) {
        length = 20
    }
    else {
        length = meals.length;
    }
    for (let i = 0; i < length; i++) {
        content += `<div class=" col-lg-3 col-md-4 col-12 ">
    <div class="card position-relative border-0 rounded-3" onclick="goToMeal('${meals[i].idMeal}')">
        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3">
        <div class="card-layer rounded-1 d-flex align-items-center text-black ps-3 fs-2 fw-medium">
            ${meals[i].strMeal}
        </div>
    </div>
</div>`
    }
    document.querySelector(".ingrdmeals").innerHTML = content;
}

// CONTACT.HTML

if (contactLink) {
    contactLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "contact.html";
    });
}

// --- Only run this code if we are on contact.html ---
const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const ageInput = document.getElementById("ageInput");
const passInput = document.getElementById("passInput");
const repassInput = document.getElementById("repassInput");

if (submitBtn && nameInput && emailInput && phoneInput && ageInput && passInput && repassInput) {

    // --- Regex rules ---
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const phoneRegex = /^01[0-5][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/;

    // --- Error message elements ---
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const ageError = document.getElementById("ageError");
    const passError = document.getElementById("passError");
    const repassError = document.getElementById("repassError");
    const inputs = [nameInput, phoneInput, emailInput, ageInput, passInput, repassInput];
    submitBtn.disabled = true;
    function checkInput(input) {
        if (input === nameInput) {
            if (!nameRegex.test(input.value)) {
                nameError.classList.replace("d-none","d-block");
                return false;
            } else {
                nameError.classList.replace("d-block","d-none");
                return true;
            }
        }
        if (input === phoneInput) {
            if (!phoneRegex.test(input.value)) {
                phoneError.classList.replace("d-none","d-block");
                return false;
            } else {
                phoneError.classList.replace("d-block","d-none");
                return true;
            }
        }

        if (input === emailInput) {
            if (!emailRegex.test(input.value)) {
                emailError.classList.replace("d-none","d-block");
                return false;
            } else {
                emailError.classList.replace("d-block","d-none");
                return true;
            }
        }

        if (input === passInput) {
            if (!passRegex.test(input.value)) {
                passError.classList.replace("d-none","d-block");
                return false;
            } else {
                passError.classList.replace("d-block","d-none");
                return true;
            }
        }

        if (input === ageInput) {
            if (input.value < 10 || input.value > 100) {
                ageError.classList.replace("d-none","d-block");
                return false;
            } else {
                ageError.classList.replace("d-block","d-none");
                return true;
            }
        }

        if (input === repassInput) {
            if (input.value !== passInput.value || input.value === "") {
                repassError.classList.replace("d-none","d-block");
                return false;
            } else {
                repassError.classList.replace("d-block","d-none");
                return true;
            }
        }

        return false;
    }
    function checkForm() {
        const isValid =
            nameRegex.test(nameInput.value) &&
            phoneRegex.test(phoneInput.value) &&
            emailRegex.test(emailInput.value) &&
            passRegex.test(passInput.value) &&
            ageInput.value >= 10 &&
            ageInput.value <= 100 &&
            repassInput.value === passInput.value;
            submitBtn.disabled = !isValid;
    }
    inputs.forEach(input => {
        input.addEventListener("keyup", () => {
            checkInput(input);
            checkForm();
        });
    });
    checkForm();
}

