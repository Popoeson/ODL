// server.js
// ==========================
// Main backend in a single file
// ==========================

// ===== 1. IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // For environment variables

// ===== 2. APP SETUP =====
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// ===== 3. CONNECT TO MONGODB =====
//mongoose.connect(process.env.MONGO_URI, {
   //  useNewUrlParser: true,
//    useUnifiedTopology: true
// })
    
// ===== 3. CONNECT TO MONGODB =====
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== 4. DEPARTMENT SCHEMA =====
const departmentSchema = new mongoose.Schema({
    faculty: String,
    department: String,
    description: String,
    hod: String,
    email: String,
    phone: String,
    duration: String,
    courses: [
        {
            name: String,
            year: String,
            semester: String,
            unit: Number
        }
    ],
    admissionRequirements: {
        olevelSubjects: [String],
        jambScore: Number,
        jambCombination: [String],
        extraOlevel: String
    },
    accreditation: String
});

// MODELS

const Department = mongoose.model('Department', departmentSchema);

// ===== 5. ROUTES =====

// --- Create a department ---
app.post('/api/departments', async (req, res) => {
    try {
        const newDept = new Department(req.body);
        await newDept.save();
        res.status(201).json({ message: '✅ Department created successfully', data: newDept });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Get all departments ---
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Get a single department by ID ---
app.get('/api/departments/:id', async (req, res) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) return res.status(404).json({ message: '❌ Department not found' });
        res.json(dept);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Update a department ---
app.put('/api/departments/:id', async (req, res) => {
    try {
        const updatedDept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDept) return res.status(404).json({ message: '❌ Department not found' });
        res.json({ message: '✅ Department updated successfully', data: updatedDept });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Delete a department ---
app.delete('/api/departments/:id', async (req, res) => {
    try {
        const deletedDept = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDept) return res.status(404).json({ message: '❌ Department not found' });
        res.json({ message: '✅ Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== 6. START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
