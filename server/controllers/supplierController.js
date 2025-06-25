
import Supplier from '../models/Supplier.js';


const addSupplier = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address
     } = req.body;

    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ success: false, message: 'Supplier already exists' });
    }
    const newSupplier = new Supplier({
      name,
      email,
      mobile,
      address
    });
    await newSupplier.save();
    res.status(200).json({ success: true, message: 'Supplier added successfully'});
  } catch (error) {
    console.error('Error adding Supplier:', error);
    res.status(500).json({ success: false, message: 'Server error On Adding Supplier' });
  }
}

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Server error in Getting Suppliers' });
  }
}

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobile,
      address
    } = req.body;

    const existingSupplier = await Supplier.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({success: false, message: "Supplier not found" });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, {name, email, mobile, address}, {new: true});

    res.status(200).json({ success: true, message: 'Supplier Updated successfully'});
    
  } catch (error) {
    console.error('Error Updating Supplier:', error);
    res.status(500).json({ success: false, message: 'Server error in updating Supplier' });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSupplier = await Supplier.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    await Supplier.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting Supplier:', error);
    res.status(500).json({ success: false, message: 'Server error in deleting Supplier' });
  }
}
export {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
};