const { createBid, getBidsForProject } = require('../models/Bid');

const createBidHandler = async (req, res) => {
    try {
        const { projectId, amount } = req.body;
        const bid = await createBid(projectId, req.user.id, amount);
        res.json(bid);
    } catch (error) {
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
};

const getBidsForProjectHandler = async (req, res) => {
    try {
        const bids = await getBidsForProject(req.params.projectId);
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bids', error: error.message });
    }
};

module.exports = { createBidHandler, getBidsForProjectHandler };
