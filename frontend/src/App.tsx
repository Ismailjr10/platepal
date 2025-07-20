import React, { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import RecipeList from "./components/RecipeList";

interface Recipe {
  title: string;
  ingredientsUsed: string[];
  instructions: string;
  time: string;
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(ingredients: string[]) {
    setLoading(true);
    setRecipes([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch {
      setRecipes([]);
      alert("Failed to fetch recipes. Try again!");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white rounded shadow p-8 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">PlatePal 🍳</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your ingredients and PlatePal will suggest recipes you can make!
        </p>
        <IngredientInput onGenerate={handleGenerate} loading={loading} />
      </div>
      <RecipeList recipes={recipes} />
      <footer className="mt-10 text-gray-400 text-sm">
        Made with <span className="text-pink-400">♥</span> by PlatePal
      </footer>
    </div>
  );
};

export default App;