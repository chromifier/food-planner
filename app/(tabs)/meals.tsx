import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import callOpenAI from '@/hooks/callOpenAI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIngredients } from '@/context/ingredientsProvider';
import { useRecipes } from '@/context/recipesProvider';

const Meals = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    // const [ingredientsString, setIngredientsString] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState<{ title: string; }[]>([]);

    const ingredientsContext = useIngredients();
    if (!ingredientsContext) {
        throw new Error('useIngredients must be used within an IngredientsProvider');
    }

    const recipesContext = useRecipes();
    if (!recipesContext) {
        throw new Error('useRecipes must be used within a RecipesProvider');
    }
    const { recipes, setRecipes } = recipesContext;

    const { ingredients, setIngredients } = ingredientsContext;
    const responseData = '{"recipes":[{"name":"Grilled Chicken with Rice","ingredients":["chicken breast","rice","olive oil"],"instructions":"Marinate chicken breast with olive oil, salt, and pepper. Grill until cooked through. Cook rice separately. Serve chicken on a bed of rice.","timeToCook":"30 minutes"},{"name":"Chicken Stir Fry","ingredients":["chicken breast","rice","olive oil"],"instructions":"Slice chicken breast and stir fry in olive oil until cooked. Add vegetables if available and cook until tender. Serve over cooked rice.","timeToCook":"25 minutes"},{"name":"Chicken and Rice Bowl","ingredients":["chicken breast","rice","olive oil"],"instructions":"Cook rice and pan-fry chicken until golden. Assemble in a bowl with rice and sliced chicken on top. Drizzle with olive oil.","timeToCook":"20 minutes"}]}';

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const storedIngredients = await AsyncStorage.getItem('storedIngredients');
                if (storedIngredients) {
                    setIngredients(JSON.parse(storedIngredients));
                }
            } catch (error) {
                console.error('Error loading ingredients in meals:', error);
            }
        };

        const loadRecipes = async () => {
            try {
                const storedRecipes = await AsyncStorage.getItem('storedRecipes');
                if (storedRecipes) {
                    setRecipes(JSON.parse(storedRecipes));
                }
            } catch (error) {
                console.log('Error loading recipes in meals:', error);
            }
        };

        loadIngredients();
        loadRecipes();
        console.log('Stored ingredients loaded:', ingredients); // Log the ingredients to check if they are loaded correctly
        console.log('Stored recipes loaded:', recipes); // Log the ingredients to check if they are loaded correctly
        // setIngredientsString(JSON.stringify(ingredients)); // Ensure ingredients are in the correct format for OpenAI
        setResponse(JSON.parse(responseData));
    }, []);



    const getRecipes = async () => {
        console.log("entered getRecipes");
        try {
            const result = await callOpenAI(ingredients); // Uncomment if you want to call OpenAI with the ingredients
            setResponse(JSON.parse(result.data) || "No response received.");
        } catch (error: any) {
            console.error("Error fetching recipes:", error.response.data);
        }
    };

    const formatResponse = (response: any) => {
        try {
            const jsonResponse = response;

            if (jsonResponse.recipes && Array.isArray(jsonResponse.recipes)) {
                return jsonResponse.recipes.map((recipe: any) => ({
                    title: recipe.name,
                    data: [`Ingredients: ${recipe.ingredients}`, `Instructions: ${recipe.instructions}`, `Time to Cook: ${recipe.timeToCook}`]
                }));
            } else {
                console.error("Invalid response format:", jsonResponse);
                return [];
            }
        } catch (error: any) {
            console.error("Error parsing response:", error.message);
            return [];
        }
    };

    const showIngredients = () => {
        if (ingredients.length > 0) {
            const ingredientList = ingredients.map((item, index) => `${index + 1}. ${item.ingredient} (${item.size})`).join('\n');
            alert(`Available Ingredients:\n${ingredientList}`);
        } else {
            alert("No ingredients available.");
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.textContent}>
                To contain selection of meals to choose from based on ingredients available in your household
            </Text>
            <View style={{ marginTop: 20 }}>
                <Button title="Click to view available ingredients" onPress={showIngredients} />
            </View>
            <View style={{ marginTop: 20 }}>
                <Button color={'#5cb85c'} title="Get New Recipes" onPress={getRecipes} />
            </View>
            <View style={{ marginTop: 20 }}>
                <Button color={'#5cb85c'} title="Save Selected Recipes" onPress={saveSelectedRecipes} />
            </View>
        </View>
    );

    const addRecipe = async (recipe: any) => {
        const updatedRecipes = [...selectedRecipes, recipe];
        setIngredients(updatedRecipes);
        setSelectedRecipes((prev) => [...prev, recipe]); // Add the selected recipe to the selected recipes state

        try {
            await AsyncStorage.setItem('storedRecipes', JSON.stringify(updatedRecipes));
            console.log('Recipe added to AsyncStorage:', updatedRecipes);
        } catch (error) {
            console.error('Error adding recipe to AsyncStorage:', error);
        }
    };

    const saveSelectedRecipes = async () => {
        console.log("Saving selected recipes:", selectedRecipes);
        try {
            await AsyncStorage.setItem('storedRecipes', JSON.stringify(selectedRecipes));
            console.log('Selected recipes saved to AsyncStorage:', selectedRecipes);
        } catch (error) {
            console.error('Error saving selected recipes:', error);
        }
    };

    const selectedRecipe = (recipe: any) => {
        console.log("Selected recipe:", recipe);
        setSelectedRecipes((prev) => {
            // Check if the recipe is already selected by comparing the title
            const isSelected = prev.some((selected) => selected.title === recipe.title);

            if (isSelected) {
                // If the recipe is already selected, remove it
                return prev.filter((selected) => selected.title !== recipe.title);
            } else {
                // Otherwise, add it to the selected recipes
                return [...prev, recipe];
            }
        });

        // Log whether the recipe was selected or deselected
        const isSelected = selectedRecipes.some((selected) => selected.title === recipe.title);
        console.log(isSelected ? "Recipe deselected" : "Recipe selected");
        console.log("Updated selected recipes:", selectedRecipes);

    };

    const displayResponse = () => {
        if (response) {
            const formattedResponse = formatResponse(response);

            if (formattedResponse.length === 0) {
                return <Text style={styles.response}>No recipes available.</Text>;
            }

            return (
                <SectionList
                    sections={formattedResponse}
                    keyExtractor={(item, index) => index.toString()}
                    renderSectionHeader={({ section }) => (
                        <TouchableOpacity onPress={() => selectedRecipe(section)}>
                            <View style={[
                                styles.sectionContainer,
                                selectedRecipes.some((selected) => selected.title === section.title) && styles.selectedRecipeContainer, // Apply selected style
                            ]}>
                                {/* Section Header */}
                                <View style={styles.sectionHeaderContainer}>
                                    <Text style={styles.sectionHeaderText}>{section.title}</Text>
                                </View>

                                {/* Section Items */}
                                {section.data.map((item, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </TouchableOpacity>
                    )}
                    renderItem={() => null} // No need to render items here as they are already rendered in the section header
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
            );
        } else {
            return <Text style={styles.response}>No response yet.</Text>;
        }
    };

    return <View style={styles.container}>{displayResponse()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    sectionContainer: {
        margin: 10, // Add spacing between sections
        backgroundColor: '#3c3c3c', // Background color for the entire section
        borderRadius: 10, // Optional: Rounded corners for the section container
        padding: 5,
    },
    sectionHeaderContainer: {
        // backgroundColor: '#444', // Background color for section headers
        paddingTop: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    selectedRecipeContainer: {
        backgroundColor: '#5cb85c', // Highlighted background color for selected sections
    },
    itemContainer: {
        // backgroundColor: '#555', // Background color for items
        padding: 10,
        marginTop: 5, // Add spacing between items
        borderRadius: 5, // Optional: Rounded corners for items
    },
    itemText: {
        fontSize: 16,
        color: '#fff',
    },
    header: {
        padding: 20,
    },
    textHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    textContent: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        width: '80%',
        color: "#fff",
        borderRadius: 5,
    },
    response: {
        marginTop: 20,
        fontSize: 16,
        color: "#fff",
    },
});

export default Meals;