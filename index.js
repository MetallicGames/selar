const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let rewardedUsers = {}; // Store rewarded players temporarily

// ✅ Optional root route for sanity check
app.get('/', (req, res) => {
    res.send('Selar payment backend is running ✅');
});

// Selar redirect link handler (called after payment)
app.get('/payment-success', (req, res) => {
    const { player_id, product_id } = req.query;

    if (!player_id || !product_id) {
        console.log('❌ Missing player_id or product_id in redirect');
        return res.status(400).send('Invalid payment redirect');
    }

    const key = `${player_id}_${product_id}`;
    rewardedUsers[key] = true;
    console.log(`✅ Reward recorded: ${key}`);

    // You can redirect to a thank you page if you want
    res.send("Payment successful! You can now return to the game.");
});

// Unity reward check
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
