import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import callOpenAI from '../../hooks/callOpenAI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIngredients } from '@/context/ingredientsProvider';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const Meals = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [ingredientsString, setIngredientsString] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

    const ingredientsContext = useIngredients();
    if (!ingredientsContext) {
        throw new Error('useIngredients must be used within an IngredientsProvider');
    }
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

        loadIngredients();
        console.log('Stored ingredients loaded:', ingredients); // Log the ingredients to check if they are loaded correctly
        setIngredientsString(JSON.stringify(ingredients)); // Ensure ingredients are in the correct format for OpenAI
        // getRecipes();
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
        </View>
    );

    const selectedRecipe = (recipe: any) => {
        setSelectedRecipes((prev) => {
            if (prev.includes(recipe.title)) {
                // If the section is already selected, remove it
                return prev.filter((title) => title !== recipe.title);
            } else {
                // Otherwise, add it to the selected sections
                return [...prev, recipe.title];
            }
        });

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
                                selectedRecipes.includes(section.title) && styles.selectedRecipeContainer, // Apply selected style
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