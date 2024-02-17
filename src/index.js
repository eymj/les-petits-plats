import getRecipes from "./recipes.js";
import recipeTemplate from "./templates/recipe.js"

const activeFilters = []
const form = document.getElementById("main-search-form");
form.addEventListener("submit", searchSubmit);

function getIngredientsList(recipes) {
    const ingredients = []

    for (var r in recipes) {
        for (var i in recipes[r].ingredients) {
            if (!ingredients.includes(recipes[r].ingredients[i].ingredient.toLowerCase())) {
                ingredients.push(recipes[r].ingredients[i].ingredient.toLowerCase())
            }
        }
    }

    return ingredients
}

function getUstensilsList(recipes) {
    const ustensils = []

    for (var r in recipes) {
        for (var u in recipes[r].ustensils) {
            if (!ustensils.includes(recipes[r].ustensils[u].toLowerCase())) {
                ustensils.push(recipes[r].ustensils[u].toLowerCase())
            }
        }
    }

    return ustensils
}

function getAppliancesList(recipes) {
    const appliances = []

    for (var r in recipes) {
        if (!appliances.includes(recipes[r].appliance.toLowerCase())) {
            appliances.push(recipes[r].appliance.toLowerCase())
        }
    }

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

    for (var i in ingredients) {
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(ingredients[i])
        if (activeFilters.includes(ingredients[i])) {
            btn.classList += " active"
        }
        _ingredients_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter); 
    }

    for (var a in appliances) {
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(appliances[a])
        if (activeFilters.includes(appliances[a])) {
            btn.classList += " active"
        }
        _appliances_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter);
    }

    for (var u in ustensils) {
        const btn = document.createElement("button");
        btn.classList = "dropdown-list-button"
        btn.textContent = capitalizeFirstLetter(ustensils[u])
        if (activeFilters.includes(ustensils[u])) {
            btn.classList += " active"
        }
        _ustensils_list.appendChild(btn)
        btn.addEventListener("click", toggleFilter);
    }

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
    
    for (var f in activeFilters) {
        const _filter = document.createElement("div");
        _filter.textContent = capitalizeFirstLetter(activeFilters[f])
        _filter.classList = "filter"
        _active_filters.appendChild(_filter)
    }

    updateData();
    
}

async function displayData(recipes) {
    const recipesList = document.querySelector(".recipes-list");

    updateFiltersList(recipes)

    if (recipes.length === 0) {
        const _empty_notice = document.createElement("p");
        _empty_notice.textContent = "Aucune recette ne corresponds à votre recherche."
        recipesList.appendChild(_empty_notice);
        return
    }

    for (var recipe in recipes) {
        const recipeModel = recipeTemplate(recipes[recipe]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesList.appendChild(recipeCardDOM);
    }

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
        for (var r in r1) {
            const ingredients = []
            for (var i in r1[r].ingredients) {
                ingredients.push(r1[r].ingredients[i].ingredient.toLowerCase())
            }
            if (r1[r].name.toLowerCase().includes(k)) {
                r2.push(r1[r])
            } else if (ingredients.includes(k)) {
                r2.push(r1[r])
            } else if (r1[r].description.toLowerCase().includes(k)) {
                r2.push(r1[r])
            }
         }
    } else {
        r2.push(...r1)
    }

    if (activeFilters.length > 0) {
        const filteredRecipes = []
        for (var r in r2) {
            const filterables = []
            for (var i in r2[r].ingredients) {
                filterables.push(r2[r].ingredients[i].ingredient.toLowerCase())
            }
            for (var u in r2[r].ustensils) {
                filterables.push(r2[r].ustensils[u].toLowerCase())
            }
            filterables.push(r2[r].appliance.toLowerCase())

            let a = 0
            for (var f in activeFilters) {
                if (filterables.includes(activeFilters[f])) {
                    a += 1
                }
            }

            if (a == activeFilters.length) {
                filteredRecipes.push(r2[r])
            }
        }

        r2.splice(0, r2.length)
        r2.push(...filteredRecipes)
    }

    displayData(r2)
}

async function init() {
    updateData()
}

init();