import Order from "../models/Order.js";
import Product from "../models/Product.js";

const addOrder = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, error: 'Requested quantity exceeds stock' });
    }

    // Deduct stock
    product.stock -= parseInt(quantity);
    await product.save();

    // Save order
    const newOrder = new Order({
      customer: userId,
      product: productId,
      quantity,
      totalPrice: total,
    });

    await newOrder.save();

    return res.status(200).json({ success: true, message: 'Order added successfully' });

  } catch (error) {
    console.error('Error adding order:', error);
    return res.status(500).json({ success: false, message: 'Server error while adding order' });
  }
};
const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({customer: userId})
      .populate({
        path: 'product',
        select: 'name price categoryId',
        populate: {
          path: 'categoryId',
          select: 'categoryName',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateOrder = async (req, res) => {
    try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId
    } = req.body;

   const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({success: false, message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, {name, description, price, stock, categoryId, supplierId}, {new: true});

    res.status(200).json({ success: true, message: 'Product Updated successfully'});
    
  } catch (error) {
    console.error('Error Updating Product:', error);
    res.status(500).json({ success: false, message: 'Server error in updating Product' });
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (existingProduct.isDeleted) {
      return res.status(400).json({ success: false, message: 'Product already deleted' });
    }

    // Soft delete the product by setting isDeleted to true
    await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    res.status(200).json({ success: true, message: 'Product deleted successfully (soft delete)' });
  } catch (error) {
    console.error('Error deleting Product:', error);
    res.status(500).json({ success: false, message: 'Server error in deleting Product' });
  }
};

export {getOrders, addOrder, updateOrder, deleteOrder};