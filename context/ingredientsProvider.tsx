import React, { createContext, useContext, useState } from 'react';

interface IngredientsContextType {
    ingredients: any[];
    setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
}

const IngredientsContext = createContext<IngredientsContextType | null>(null);

export const IngredientsProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [ingredients, setIngredients] = useState<any[]>([]);

    return (
        <IngredientsContext.Provider value={{ ingredients, setIngredients }}>
            {children}
        </IngredientsContext.Provider>
    );
};

export const useIngredients = () => useContext(IngredientsContext); 