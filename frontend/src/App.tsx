import React, { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import RecipeList from "./components/RecipeList";
import { Recipe } from "./types"; // Or wherever your types are defined

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setRecipes(data.recipes);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1>PlatePal</h1>
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onGenerate={fetchRecipes}
      />
      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default App;