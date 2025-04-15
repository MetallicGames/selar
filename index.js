const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = 'sat_asc71q79e072a1586699zz44b74'; // Your API key

// Middleware to verify API key
app.use(express.json());
app.use((req, res, next) => {
    // Check for the API key in the request header or query parameter
    const key = req.get('x-api-key') || req.query.api_key;
    if (!key || key !== API_KEY) {
        console.log('❌ Unauthorized access attempt');
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});

let rewardedUsers = {}; // Stores players who have been rewarded temporarily

// Root endpoint for a quick check
app.get('/', (req, res) => {
    res.send('Selar payment backend is running ✅');
});

// Endpoint to handle successful payments
app.get('/payment-success', (req, res) => {
    const { player_id, product_id } = req.query;

    if (!player_id || !product_id) {
        console.log('❌ Missing player_id or product_id in redirect');
        return res.status(400).send('Invalid payment redirect');
    }

    const key = `${player_id}_${product_id}`;
    rewardedUsers[key] = true;
    console.log(`✅ Reward recorded: ${key}`);

    // Optionally, redirect to a thank-you page or game screen
    res.send("Payment successful! You can now return to the game.");
});

// Endpoint to handle failed payments (optional)
app.get('/payment-failed', (req, res) => {
    const { player_id, product_id } = req.query;

    if (!player_id || !product_id) {
        console.log('❌ Missing player_id or product_id in failed payment');
        return res.status(400).send('Invalid payment information');
    }

    // Log or handle the failed payment accordingly
    console.log(`❌ Payment failed for: ${player_id}_${product_id}`);

    res.send("Payment failed. Please try again.");
});

// Endpoint for Unity client to check reward status
app.get('/check-reward', (req, res) => {
    const { playerId, productId } = req.query;
    const key = `${playerId}_${productId}`;

    if (rewardedUsers[key]) {
        delete rewardedUsers[key];
        console.log(`✅ Reward granted: ${key}`);
        res.send("rewarded");
    } else {
        console.log(`❌ No payment found for: ${key}`);
        res.send("not_paid");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
