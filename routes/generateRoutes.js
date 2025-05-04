require("dotenv").config();
const OpenAI  = require("openai");
const express = require("express");
const router = express.Router();
const z = require("zod");
const zodResponseFormat = require("openai/helpers/zod");


const apiKey = process.env.OPENAI_API_KEY;
const systemPrompt = `
You are a nutrition professional. The user will provide you with data the contains a list of ingredients that they have in their house.
Your job is to take the available ingredients provided and come up with potential recipes that they can make with the ingredients they have.
{
    "ingredients": [
        {
            "ingredient": "chicken breast",
            "size": "2 lb"
        },
        {
            "ingredient": "broccoli",
            "size": "1 lb"
        },
        {
            "ingredient": "olive oil",
            "size": "1 cup"
        }
    ]
}

The user will provide you with a list of ingredients in the JSON format above. You will then respond with a list of recipes that they can make with the provided ingredients.

The recipes should be in the following JSON format, you may provide multiple recipes if you can think of them. You should also provide the time it takes to prepare and cook the recipe.:
{
    "recipes": [
        {
            "name": "recipe name",
            "ingredients": ["1 lb chicken breast", "1 lb broccoli", "1 cup olive oil"],
            "instructions": "1. Preheat the oven to 375°F (190°C). 2. Season the chicken breast with salt and pepper. 3. Heat olive oil in a pan over medium heat. 4. Add broccoli and sauté for 5 minutes. 5. Place chicken in the oven for 25 minutes. 6. Serve with broccoli."
            "timeToPrepare": "15 minutes",
            "timeToCook": "30 minutes",
        },
    ]
}

Always respond with valid JSON format.
`;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the environment variables.");
} 
else {
    console.log("API Key is set.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



router.post("/generate", async (req, res) => {
  const { userPrompt } = req.body;

  const RecipeResponse = z.object({
      recipes: z.array(
          z.object({
              name: z.string(), // Recipe name
              ingredients: z.array(z.string()), // List of ingredients as strings
              instructions: z.string(), // Instructions as a single string
              timeToPrepare: z.string(), // Time to prepare as a string (e.g., "15 minutes")
              timeToCook: z.string(), // Time to cook as a string (e.g., "30 minutes")
          })
      ),
  });

  if (!userPrompt) {
    return res.status(400).json({ error: "userPrompt is required" });
  }

  console.log("Received userPrompt:", userPrompt);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'user', content: userPrompt }
      ],
      functions: [
        {
          name: 'generate_meals',
          description: 'The user will provide you with data the contains a list of ingredients that they have in their house. Your job is to take the available ingredients provided and come up with potential recipes that they can make with the ingredients they have.',
          parameters: {
            type: 'object',
            properties: {
              recipes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    ingredients: { type: 'array', items: { type: 'string' } },
                    instructions: { type: 'string' },
                    timeToCook: { type: 'string' },
                    timeToPrepare: { type: 'string' }
                  },
                  required: ['name', 'ingredients', 'instructions', 'timeToCook', 'timeToPrepare']
                }
              }
            },
            required: ['recipes']
          }
        }
      ],
      function_call: 'auto'
    });
    
    
    console.log("Validated Response:", response);
    console.log("choices", response.choices[0]);

    res.json({ data: response.choices[0].message.function_call.arguments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;