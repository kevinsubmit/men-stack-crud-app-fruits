import mongoose from 'mongoose'

const fruitSchema = mongoose.Schema({
  name: String,
  isReadyToEat: Boolean
})

const Fruit = mongoose.model('Fruit', fruitSchema)

export default Fruit