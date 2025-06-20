import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  categoryName: {type: String, required: true},
  categoryDescription: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}, 
  updatedAt: {type: Date, default: Date.now}
});

const Category = mongoose.model('Category', categorySchema);

export default Category;