import getRecipes from "./recipes.js";
import recipeTemplate from "./templates/recipe.js"

const activeFilters = []
const form = document.getElementById("main-search-form");
form.addEventListener("submit", searchSubmit);

function getIngredientsList(recipes) {
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

function getUstensilsList(recipes) {
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

function getAppliancesList(recipes) {
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

function updateFiltersList(recipes) {

    const ingredients = getIngredientsList(recipes)
    const appliances = getAppliancesList(recipes)
    const ustensils = getUstensilsList(recipes)

    const _ingredients_list = document.getElementById("ingredients-list");
    const _appliances_list = document.getElementById("appliances-list");
    const _ustensils_list = document.getElementById("ustensils-list");

    _ingredients_list.innerHTML = ""
    _appliances_list.innerHTML = ""
    _ustensils_list.innerHTML = ""

    ingredients.forEach((i) => {
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

async function displayData(recipes) {
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

    displayData(r2)
}

async function init() {
    updateData()
}

init();