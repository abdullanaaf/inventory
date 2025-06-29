import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId
     } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId
    });
    await newProduct.save();
    res.status(200).json({ success: true, message: 'Product added successfully'});
  } catch (error) {
    console.error('Error adding Product:', error);
    res.status(500).json({ success: false, message: 'Server error On Adding Product' });
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({isDeleted: false})
      .populate('categoryId')
      .populate('supplierId');
    const suppliers = await Supplier.find();
    const categories = await Category.find();
    res.status(200).json({ success: true, products, suppliers, categories });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Server error in Getting Products' });
  }
}

const updateProduct = async (req, res) => {
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

const deleteProduct = async (req, res) => {
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

export {getProducts, addProduct, updateProduct, deleteProduct};