const express = require("express");
const { authenticate } = require("../helper/authenticate");
const router = express.Router();

// PUT /reviews/:id (Authenticated)
router.put("/:id", authenticate, async (req, res) => {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).send("Review not found");
    if (review.UserId !== req.user.id) return res.status(403).send("Forbidden");

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();
    res.send(review);
});

// DELETE /reviews/:id (Authenticated)
router.delete("/:id", authenticate, async (req, res) => {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).send("Review not found");
    if (review.UserId !== req.user.id) return res.status(403).send("Forbidden");

    await review.destroy();
    res.send({ message: "Review deleted" });
});

module.exports = { router };
