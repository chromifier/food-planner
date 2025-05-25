import React, { createContext, useContext, useState } from 'react';

interface RecipesContextType {
    recipes: any[];
    setRecipes: React.Dispatch<React.SetStateAction<any[]>>;
}

const RecipesContext = createContext<RecipesContextType | null>(null);

export const RecipesProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [recipes, setRecipes] = useState<any[]>([]);

    return (
        <RecipesContext.Provider value={{ recipes, setRecipes }}>
            {children}
        </RecipesContext.Provider>
    );
};

export const useRecipes = () => useContext(RecipesContext);