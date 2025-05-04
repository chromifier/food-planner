import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SectionList,
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
} from 'react-native';
import { useIngredients } from '@/context/ingredientsProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ingredients = () => {
    const [ingredientsState, setIngredientsState] = useState({
        ingredient: '',
        size: '',
        selectedIngredients: [] as { ingredient: string; size: string; }[],
    });

    const ingredientsContext = useIngredients();
    if (!ingredientsContext) {
        throw new Error('useIngredients must be used within an IngredientsProvider');
    }
    const { ingredients, setIngredients } = ingredientsContext;

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const storedIngredients = await AsyncStorage.getItem('storedIngredients');
                if (storedIngredients) {
                    setIngredientsState((prevState) => ({
                        ...prevState,
                        selectedIngredients: JSON.parse(storedIngredients),
                    }));
                    setIngredients(JSON.parse(storedIngredients));
                }
                console.log('Stored ingredients loaded:', storedIngredients);
            } catch (error) {
                console.error('Error loading ingredients:', error);
            }
        };

        loadIngredients();
    }, []);

    const addIngredient = async () => {
        const updatedIngredients = [
            ...ingredientsState.selectedIngredients,
            { ingredient: ingredientsState.ingredient, size: ingredientsState.size },
        ];

        setIngredients(updatedIngredients);
        setIngredientsState((prevState) => ({
            ...prevState,
            selectedIngredients: updatedIngredients,
            ingredient: '',
            size: '',
        }));

        try {
            await AsyncStorage.setItem('storedIngredients', JSON.stringify(updatedIngredients));
            console.log('Ingredients updated in AsyncStorage:', updatedIngredients);
        } catch (error) {
            console.error('Error updating ingredients:', error);
        }
    };

    const removeIngredient = async (item: { ingredient: string; size: string; }) => {
        const updatedIngredients = ingredientsState.selectedIngredients.filter(
            (ingredient) => ingredient !== item
        );

        setIngredients(updatedIngredients);
        setIngredientsState((prevState) => ({
            ...prevState,
            selectedIngredients: updatedIngredients,
        }));

        try {
            await AsyncStorage.setItem('storedIngredients', JSON.stringify(updatedIngredients));
            console.log('Ingredients updated in AsyncStorage:', updatedIngredients);
        } catch (error) {
            console.error('Error updating ingredients during removal:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SectionList
                sections={[
                    {
                        title: 'Your Ingredients',
                        data: ingredientsState.selectedIngredients,
                    },
                ]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 10,
                        }}
                    >
                        <Text style={styles.textContent}>
                            {item.ingredient} ({item.size})
                        </Text>
                        <Button
                            title="Remove"
                            onPress={() => removeIngredient(item)}
                        />
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.textHeader}>{title}</Text>
                )}
                ListHeaderComponent={
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter name (chicken breast, broccoli, etc.)"
                            placeholderTextColor="#ccc"
                            value={ingredientsState.ingredient}
                            onChangeText={(text) =>
                                setIngredientsState((prevState) => ({
                                    ...prevState,
                                    ingredient: text,
                                }))
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount (1 lb, 2 cups, etc.)"
                            placeholderTextColor="#ccc"
                            value={ingredientsState.size}
                            onChangeText={(text) =>
                                setIngredientsState((prevState) => ({
                                    ...prevState,
                                    size: text,
                                }))
                            }
                        />
                        <Button title="Add Ingredient" onPress={addIngredient} />
                    </View>
                }
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#25292e',

    },
    form: {
        width: '100%',
        marginTop: 20,
        maxWidth: 400,
        padding: 10,
        flex: 1,
        alignItems: 'center',
        marginBottom: 30,
        gap: 5,
    },
    textHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    textContent: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        width: '80%',
        color: '#fff',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
});

export default Ingredients;