import getRecipes from "./recipes.js";
import recipeTemplate from "./templates/recipe.js"

const activeFilters = []
let recipes = []
const form = document.getElementById("main-search-form");
form.addEventListener("submit", searchSubmit);

const _ingredients_search = document.getElementById("ingredients-search");
const _appliances_search = document.getElementById("appliances-search");
const _ustensils_search = document.getElementById("ustensils-search");
_ingredients_search.addEventListener("input", filterSearchInput);
_appliances_search.addEventListener("input", filterSearchInput);
_ustensils_search.addEventListener("input", filterSearchInput);

function getIngredientsList() {
    const ingredients = []

    recipes.forEach((r) => {
        r.ingredients.forEach((i) => {
            if (!ingredients.includes(i.ingredient.toLowerCase())) {
                ingredients.push(i.ingredient.toLowerCase())
            }
        })
    })

    return ingredients
}

function getUstensilsList() {
    const ustensils = []

    recipes.forEach((r) => {
        r.ustensils.forEach((u) => {
            if (!ustensils.includes(u.toLowerCase())) {
                ustensils.push(u.toLowerCase())
            }
        })
    })

    return ustensils
}

function getAppliancesList() {
    const appliances = []

    recipes.forEach((r) => {
        if (!appliances.includes(r.appliance.toLowerCase())) {
            appliances.push(r.appliance.toLowerCase())
        }
    })

    return appliances
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateFiltersList() {

    const ingredients = getIngredientsList()
    const appliances = getAppliancesList()
    const ustensils = getUstensilsList()

    const _ingredients_list = document.getElementById("ingredients-list");
    const _appliances_list = document.getElementById("appliances-list");
    const _ustensils_list = document.getElementById("ustensils-list");

    _ingredients_list.innerHTML = ""
    _appliances_list.innerHTML = ""
    _ustensils_list.innerHTML = ""

    ingredients.forEach((i) => {
        const k = _ingredients_search.value.toLowerCase()
        if (!i.toLowerCase().includes(k)){
            return
        }
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(i)
        if (activeFilters.includes(i)) {
            btn.classList += " active"
        }
        _ingredients_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter); 
    })

    appliances.forEach((a) => {
        const k = _appliances_search.value.toLowerCase()
        if (!a.toLowerCase().includes(k)){
            return
        }
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(a)
        if (activeFilters.includes(a)) {
            btn.classList += " active"
        }
        _appliances_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter);
    })

    ustensils.forEach((u) => {
        const k = _ustensils_search.value.toLowerCase()
        if (!u.toLowerCase().includes(k)){
            return
        }
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(u)
        if (activeFilters.includes(u)) {
            btn.classList += " active"
        }
        _ustensils_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter);
    })

}

function toggleFilter(event) {
    const f = event.target.textContent

    if (activeFilters.includes(f.toLowerCase())) {
        activeFilters.splice(activeFilters.indexOf(f.toLowerCase()), 1)
    } else {
        activeFilters.push(f.toLowerCase())
    }

    updateActiveFilters()
}

function updateActiveFilters() {

    const _active_filters = document.getElementById("filters-active");

    _active_filters.innerHTML = ""
    
    activeFilters.forEach((f) => {
        const _filter = document.createElement("div");
        _filter.textContent = capitalizeFirstLetter(f)
        _filter.classList = "filter"
        _active_filters.appendChild(_filter)
    })

    updateData();
    
}

async function displayData() {
    const recipesList = document.querySelector(".recipes-list");

    updateFiltersList(recipes)

    if (recipes.length === 0) {
        console.log("test")
        const _empty_notice = document.createElement("p");
        _empty_notice.textContent = "Aucune recette ne corresponds à votre recherche."
        recipesList.appendChild(_empty_notice);
        return
    }

    recipes.forEach((recipe) => {
        const recipeModel = recipeTemplate(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesList.appendChild(recipeCardDOM);
    });
}

function searchSubmit(event) {
    event.preventDefault();
    updateData()
}

function filterSearchInput(event) {
    event.preventDefault();
    updateFiltersList()
}

async function updateData() {
    // Clear recipes list before updating it
    const list = document.getElementById("recipes-list");
    list.innerHTML = ""

    const searchBar = document.getElementById("main-search")
    const k = searchBar.value.toLowerCase()
    const r1 = getRecipes()
    const r2 = []

    if (k.length > 3) {
        r1.forEach(r => {
            const ingredients = []
            r.ingredients.forEach(i => {
                ingredients.push(i.ingredient.toLowerCase())
            })

            if (r.name.toLowerCase().includes(k)) {
                r2.push(r)
            } else if (ingredients.includes(k)) {
                r2.push(r)
            } else if (r.description.toLowerCase().includes(k)) {
                r2.push(r)
            }
        });
    } else {
        r2.push(...r1)
    }

    if (activeFilters.length > 0) {
        const filteredRecipes = []
        r2.forEach(r => {

            const filterables = []
            r.ingredients.forEach(i => {
                filterables.push(i.ingredient.toLowerCase())
            })
            r.ustensils.forEach(u => {
                filterables.push(u.toLowerCase())
            })
            filterables.push(r.appliance.toLowerCase())

            let a = 0
            activeFilters.forEach(f => {
                if (filterables.includes(f)) {
                    a += 1
                }
            })

            if (a == activeFilters.length) {
                filteredRecipes.push(r)
            }
        })
        r2.splice(0, r2.length)
        r2.push(...filteredRecipes)
    }

    recipes = r2

    displayData()
}

async function init() {
    updateData()
}

init();