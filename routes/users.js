const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        // filtering users by age up front; most straightforward way to do this
        const user = await User.findOne({ 
            _id: id, 
            age: { $gt: 21 }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found or under age restriction.' });
        }

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;

