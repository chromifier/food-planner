import axios from 'axios';

const callOpenAI = async (data) => {
    console.log("entered callOpenAI function with data:", data);
    console.log("converting data to usable API format");
    const userPromptString = data
    .map(item => `${item.ingredient} (${item.size})`)
    .join(", ");
    console.log("converted data to usable API format:", userPromptString);

    try {
        const response = await axios.post('http://10.0.0.25:3000/api/generate', {
            userPrompt: userPromptString,
        });
        return response.data;
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response.data);
        throw error;
    }
};

export default callOpenAI;