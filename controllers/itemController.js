import Item from "../entities/item.js";

export const createItem = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const { userId } = req.user;
        const newItem = new Item({ name, description, price, userId });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: "Error creating item", error });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('userId', 'username email');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

export const getItemsQuery = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, sorting } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (minPrice) {
            query.price = { ...query.price, $gte: Number(minPrice) };
        }
        if (maxPrice) {
            query.price = { ...query.price, $lte: Number(maxPrice) };
        }
        
        const items = await Item.find(query).populate('userId', 'username email');

        if (sorting) {
            items = items.sort((a, b) => {
                if (sorting === "price_asc") return a.price - b.price;
                if (sorting === "price_desc") return b.price - a.price;
                if (sorting === "name_asc") return a.name.localeCompare(b.name);
                if (sorting === "name_desc") return b.name.localeCompare(a.name);
                return 0;
            });
        }
        res.status(200).json(items);

    }
    catch(error){
        res.status(500).json({ message: "Error fetching items with query", error });
    }
}

export const getItemsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await Item.find({ userId }).populate('userId', 'username email');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items for user", error });
    }
};

export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id).populate('userId', 'username email');
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }  
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        const updatedItem = await Item
            .findByIdAndUpdate(id, req.body, { new: true })
            .populate('userId', 'username email');
            
        res.status(200).json(updatedItem);
        
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};

