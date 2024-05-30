const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numbers = [];

const fetchNumbers = async (type, token) => {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            timeout: 500 // 500 ms timeout
        });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
};

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = ['prime', 'fibo', 'even', 'rand'];
    if (!validTypes.includes(type)) {
        return res.status(400).send('Invalid number type');
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDYyNTc4LCJpYXQiOjE3MTcwNjIyNzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjU2NWU0ZWFkLWRiMzgtNGY0ZS05ZDhjLTZhZWEzNzYyMjliNiIsInN1YiI6Imd1cHRhcHJhdGhhbTY2MUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJwcmF0aGFtY29tcCIsImNsaWVudElEIjoiNTY1ZTRlYWQtZGIzOC00ZjRlLTlkOGMtNmFlYTM3NjIyOWI2IiwiY2xpZW50U2VjcmV0Ijoid1Nnc0dobHBReEZMUkhBYyIsIm93bmVyTmFtZSI6IlByYXRoYW0gR3VwdGEiLCJvd25lckVtYWlsIjoiZ3VwdGFwcmF0aGFtNjYxQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxU0NTRTEwMTA4NDQifQ.P6x-Pvvc4RJhuuWKuoy-v_eSCUST-kW8Oupcg5M6yFw'; // Replace with your actual token
    const newNumbers = await fetchNumbers(type, token);
    const uniqueNewNumbers = [...new Set(newNumbers)];

    const prevState = [...numbers];
    numbers = [...numbers, ...uniqueNewNumbers].slice(-WINDOW_SIZE);
    const average = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;

    res.json({
        windowPrevState: prevState,
        windowCurrState: numbers,
        numbers: uniqueNewNumbers,
        avg: average.toFixed(2),
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
