const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

//Getting all 
router.get('/', async (req, res) => {
  try {
    const Users = await User.find()
    res.json(Users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Getting One
router.get('/:id', middleware, (req, res) => {
  res.send(res.user)
})

//Creating One
router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Updating One
router.patch('/:id', middleware, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.password != null) {
    res.user.password = await bcrypt.hash(req.body.password,10)
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Deleting One
router.delete('/:id', middleware, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: "User Deleted"})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function middleware(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: "No user found"})
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router