import User from '../models/User.js';
import bcrypt from 'bcrypt';

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });
    await newUser.save();
    res.status(200).json({ success: true, message: 'User added successfully'});
  } catch (error) {
    console.error('Error adding User:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching Users:', error);
    res.status(500).json({ success: false, message: 'Server error in Getting Users' });
  }
}

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({ success: false, message: 'Server error in Getting User' });
  }
};
 
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
   const { name, email, password, address, role } = req.body;


    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({success: false, message: "User not found" });
    }

   const updatedUser = await User.findByIdAndUpdate(id, {name, email, password, address, role }, {new: true});

    res.status(200).json({ success: true, message: 'User Updated successfully'});
    
  } catch (error) {
    console.error('Error Updating User:', error);
    res.status(500).json({ success: false, message: 'Server error in updating User' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, address, password } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const updatedData = {
      name,
      email,
      address
    };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
    res.status(200).json({ success: true, message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Server error in updating User profile' });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' }); 
}
  catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server error in deleting Category' });
  }
};

export { addUser, getUsers, getUser, updateUserProfile, updateUser, deleteUser }; 