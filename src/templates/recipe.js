export default function recipeTemplate(data) {
    const { id, image, name, servings, ingredients, time, description, appliance, ustensils } = data;

    function getRecipeCardDOM() {
        // Définitions des éléments
        const _recipe = document.createElement("div");
        const _recipe_header = document.createElement("div");
        const _recipe_header_wrapper = document.createElement("div");
        const _recipe_cooktime = document.createElement("span");
        const _image = document.createElement("img");
        const _recipe_content = document.createElement("div");
        const _recipe_title = document.createElement("div");
        const _recipe_title_text = document.createElement("h2");
        const _recipe_description = document.createElement("div");
        const _recipe_description_title = document.createElement("h3");
        const _recipe_description_text = document.createElement("p");
        const _recipe_ingredients = document.createElement("div");
        const _recipe_ingredients_title = document.createElement("h3");
        const _recipe_ingredients_list = document.createElement("ul");

        // Paramétrage des éléments
        _recipe.classList = "recipe"
        _recipe.setAttribute("id", id)
        _recipe_header.classList = "recipe-header"
        _image.setAttribute("src", "res/img/" + image);
        _recipe_cooktime.classList = "recipe-cooktime"
        _recipe_cooktime.textContent = time + "m"
        _recipe_content.classList = "recipe-content"
        _recipe_title.classList = "recipe-title"
        _recipe_title_text.textContent = name
        _recipe_description.classList = "recipe-description"
        _recipe_description_title.textContent = "Recette"
        _recipe_description_text.className = "recipe-description-text"
        _recipe_description_text.textContent = description
        _recipe_ingredients.classList = "recipe-ingredients"
        _recipe_ingredients_title.textContent = "Ingrédients"
        _recipe_ingredients_list.classList = "recipe-ingredients-list"

        // Construction de la carte
        _recipe.appendChild(_recipe_header)
        _recipe_header.appendChild(_image)
        _recipe_header.appendChild(_recipe_header_wrapper)
        _recipe_header_wrapper.appendChild(_recipe_cooktime)
        _recipe.appendChild(_recipe_content)
        _recipe_content.appendChild(_recipe_title)
        _recipe_title.appendChild(_recipe_title_text)
        _recipe_content.appendChild(_recipe_description)
        _recipe_description.appendChild(_recipe_description_title)
        _recipe_description.appendChild(_recipe_description_text)
        _recipe_content.appendChild(_recipe_ingredients)
        _recipe_ingredients.appendChild(_recipe_ingredients_title)
        _recipe_ingredients.appendChild(_recipe_ingredients_list)

        // Création des ingrédients
        ingredients.forEach(i => {
            const _ingredient = document.createElement("li");
            const _ingredient_name = document.createElement("span");
            const _ingredient_quantity = document.createElement("span");

            _ingredient.classList = "ingredient"
            _ingredient_name.classList = "ingredient-name"
            _ingredient_name.textContent = i.ingredient
            _ingredient_quantity.classList = "ingredient-quantity"
            _ingredient_quantity.textContent = (i.quantity ? i.quantity : "") + " " + (i.unit ? i.unit : "")

            _ingredient.appendChild(_ingredient_name)
            _ingredient.appendChild(_ingredient_quantity)
            _recipe_ingredients_list.appendChild(_ingredient)
        });

        return _recipe;
    }
    return { data, getRecipeCardDOM };
}