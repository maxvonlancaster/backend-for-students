import Comment from "../entities/comment.js";

export const createFeedback = async (req, res) => {
    try {
        const { category, text, name } = req.body;
        const newComment = new Comment({ category, text, name });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: "Error creating comment", error });
    }
};

export const getFeedbacks = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedbacks", error });
    }
};

export const getFeedbacksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const comments = await Comment
            .find({ category: category });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments by category", error });
    }
};