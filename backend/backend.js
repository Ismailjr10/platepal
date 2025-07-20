// Sample recipe database (now in a separate file for easier editing)
const fs = require('fs');
const path = require('path');

const recipesPath = path.join(__dirname, 'recipes.json');
let recipeDB = [];
try {
  recipeDB = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
} catch {
  // fallback sample recipes if file missing/invalid
  recipeDB = [
    {
      title: "Classic Omelette",
      ingredients: ["eggs", "salt", "pepper", "butter"],
      instructions: "Beat eggs with salt and pepper, melt butter in pan, cook eggs until set. Fold and serve.",
      time: "10 min"
    },
    {
      title: "Tomato Pasta",
      ingredients: ["pasta", "tomato", "olive oil", "garlic", "salt"],
      instructions: "Cook pasta. Sauté garlic in olive oil, add tomato and salt, simmer. Toss with pasta.",
      time: "20 min"
    },
    {
      title: "Avocado Toast",
      ingredients: ["bread", "avocado", "salt", "pepper", "lemon"],
      instructions: "Toast bread, mash avocado with lemon, salt, pepper. Spread on toast.",
      time: "5 min"
    },
    {
      title: "Vegetable Stir Fry",
      ingredients: ["vegetable", "soy sauce", "garlic", "oil"],
      instructions: "Stir fry chopped vegetables in oil, add garlic and soy sauce. Serve hot.",
      time: "15 min"
    }
  ];
}

// Ingredient alias map for smarter agent-like matching
const aliases = {
  eggs: ["egg"],
  tomato: ["tomatoes"],
  bread: ["toast", "baguette", "roll"],
  vegetable: [
    "carrot", "pepper", "broccoli", "onion", "spinach", "zucchini", "pea", "mushroom", "cabbage"
  ],
  cheese: ["cheddar", "mozzarella", "parmesan", "gouda", "feta"],
  chicken: ["chicken breast", "chicken thigh", "chicken drumstick"],
  potato: ["potatoes", "sweet potato"],
  pasta: ["spaghetti", "penne", "macaroni", "fusilli"],
  rice: ["basmati", "jasmine", "brown rice"],
  beef: ["steak", "ground beef"],
  fish: ["salmon", "tuna"],
  avocado: ["avocados"],
};

function canonicalize(ingredient) {
  const lower = ingredient.trim().toLowerCase();
  for (const [main, group] of Object.entries(aliases)) {
    if (main === lower || group.includes(lower)) return main;
  }
  return lower;
}

function ingredientMatch(recipeIng, userIngs) {
  const recipeCanon = canonicalize(recipeIng);
  return userIngs.some(ui => {
    const userCanon = canonicalize(ui);
    if (recipeCanon === userCanon) return true;
    if (aliases[recipeCanon] && aliases[recipeCanon].includes(userCanon)) return true;
    if (aliases[userCanon] && aliases[userCanon].includes(recipeCanon)) return true;
    // substring match for "vegetable" or "cheese" style flexible base
    if (
      ["vegetable", "cheese"].includes(recipeCanon) &&
      userCanon !== recipeCanon &&
      (aliases[recipeCanon] || []).some(v => userCanon.includes(v))
    ) {
      return true;
    }
    return false;
  });
}

function generateRecipes(userIngredients) {
  const normalizedInput = userIngredients.map(i => i.trim().toLowerCase());

  const matches = recipeDB
    .map(recipe => {
      const used = recipe.ingredients.filter(ri => ingredientMatch(ri, normalizedInput));
      const matchScore = used.length / recipe.ingredients.length;
      return { ...recipe, usedIngredients: used, matchScore };
    })
    .filter(r => r.matchScore >= 0.5)
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches.map(r => ({
    title: r.title,
    ingredientsUsed: r.usedIngredients,
    instructions: r.instructions,
    time: r.time
  }));
}

module.exports = generateRecipes;