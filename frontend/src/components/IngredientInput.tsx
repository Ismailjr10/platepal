import React, { useState } from "react";

interface IngredientInputProps {
  onGenerate: (ingredients: string[]) => void;
  loading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onGenerate, loading }) => {
  const [input, setInput] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const addIngredient = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIngredients([...ingredients, input.trim()]);
    setInput("");
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) return;
    onGenerate(ingredients);
  };

  const fillExample = () => {
    setIngredients(["eggs", "cheese", "bread", "tomato"]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-2 items-center"
    >
      <div className="flex w-full">
        <input
          className="border rounded-l px-3 py-2 flex-1"
          type="text"
          placeholder="e.g. eggs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={e => e.key === "Enter" && addIngredient(e)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={addIngredient}
          type="button"
          disabled={loading}
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {ingredients.map((ing, i) => (
          <span
            key={i}
            className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
          >
            {ing}
            <button
              className="ml-2 text-red-400 hover:text-red-700"
              onClick={() => removeIngredient(i)}
              type="button"
              aria-label={`Remove ${ing}`}
              disabled={loading}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex w-full gap-2 mt-2">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded flex-1"
          type="submit"
          disabled={loading || ingredients.length === 0}
        >
          {loading ? "Generating..." : "Get Recipes"}
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex-0"
          type="button"
          onClick={fillExample}
          disabled={loading}
        >
          Surprise Me!
        </button>
      </div>
    </form>
  );
};

export default IngredientInput;