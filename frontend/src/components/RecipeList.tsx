import React from "react";

export interface Recipe {
  title: string;
  ingredientsUsed: string[];
  instructions: string;
  time: string;
}

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="mt-8 text-gray-400 text-center">
        No recipes yet. Enter ingredients to get started!
      </div>
    );
  }
  return (
    <div className="mt-8 w-full max-w-2xl flex flex-col gap-6">
      {recipes.map((r, i) => (
        <div
          key={i}
          className="bg-white shadow rounded p-5 border"
        >
          <div className="text-xl font-semibold mb-2">🍽 {r.title}</div>
          <div className="mb-1">
            <span className="font-bold">📝 Ingredients Used:</span>{" "}
            {r.ingredientsUsed.join(", ")}
          </div>
          <div className="mb-1">
            <span className="font-bold">🧑‍🍳 Instructions:</span>{" "}
            {r.instructions}
          </div>
          <div>
            <span className="font-bold">⏱️ Time:</span> {r.time}
          </div>
          <button
            className="mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `🍽 ${r.title}\n📝 Ingredients: ${r.ingredientsUsed.join(", ")}\n🧑‍🍳 Instructions: ${r.instructions}\n⏱️ Time: ${r.time}`
              );
            }}
            type="button"
          >
            Copy Recipe
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;