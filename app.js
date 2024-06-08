const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

let receipts = {};
let receiptPoints = {};

app.post('/receipts/process', (req, res) => {
    const receipt = req.body;
    const id = uuidv4(); // can change
    receipts[id] = receipt;
    const points = calculatePoints(receipt);
    receiptPoints[id] = points;

    console.log('Response:', points);
    res.json({ id });
});

app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;
    const points = receiptPoints[id];
    if (points === undefined) {
        return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json({ points });
});

function calculatePoints(receipt) {
    let points = 0;

    let count = 0;
    
    // One point for every alphanumeric character in the retailer name.
    if (typeof receipt.retailer === 'string') {
        for (let i = 0; i < receipt.retailer.length; i++) {
            if (/[a-zA-Z0-9]/.test(receipt.retailer[i])) {
                count++;
            }
        }
        points += count;
    } else {
        return res.status(400).json({ error: 'Receipt retailer is missing or not in the correct format' });
    }

    // 50 points if the total is a round dollar amount with no cents.
    if (parseInt(receipt.total) === receipt.total) {
        points += 50;
    }

    // 25 points if the total is a multiple of 0.25.
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // 5 points for every two items on the receipt.
    if (!receipt.items || !Array.isArray(receipt.items)) {
        return res.status(400).json({ error: 'Receipt items are missing or not in the correct format' });
    }
    points += Math.floor(receipt.items.length / 2) * 5;

    // Points based on item description length
    receipt.items.forEach(item => {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate() % 2 === 1) {
        points += 6;
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    const [hours, minutes] = receipt.purchaseTime.split(':').map(Number);
    if (hours === 14 || (hours === 15 && minutes === 0)) {
        points += 10;
    }

    return points;
}

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});