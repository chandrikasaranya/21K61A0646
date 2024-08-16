
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

let windowPrevState = [];
let windowCurrState = [];
const WINDOW_SIZE = 10;

// Function to fetch numbers from third-party API
async function fetchNumbers(type) {
    try {
        const response = await axios.get(`https://20.244.56.144/numbers/${type}}`);
        return response.data.numbers;
    } catch (error) {
        console.error("Error fetching numbers from third-party API:", error);
        return [];
    }
}

// Helper function to calculate average
function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
}

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const validIds = ['p', 'f', 'e', 'r'];

    if (!validIds.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    // Fetch new numbers from third-party API
    const newNumbers = await fetchNumbers(numberid);

    // Filter duplicates
    const uniqueNewNumbers = newNumbers.filter((num) => !windowCurrState.includes(num));

    // Ignore responses taking longer than 500ms or encountering errors
    if (uniqueNewNumbers.length === 0) {
        return res.status(500).json({ error: 'Error fetching numbers or no new numbers received' });
    }

    // Update states
    windowPrevState = [...windowCurrState];
    windowCurrState = [...windowCurrState, ...uniqueNewNumbers];

    // Ensure window size limit is respected
    if (windowCurrState.length > WINDOW_SIZE) {
        windowCurrState = windowCurrState.slice(windowCurrState.length - WINDOW_SIZE);
    }

    // Calculate average
    const avg = calculateAverage(windowCurrState);

    // Return response in required format
    res.json({
        windowPrevState,
        windowCurrState,
        numbers: uniqueNewNumbers,
        avg
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
