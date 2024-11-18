// controllers/employeeController.js
const Employee = require("../models/Employee");

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, role, email, phone, accessLevel } = req.body;
    
    const employee = new Employee({
      name,
      role,
      email,
      phone,
      accessLevel,
    });
    
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update employee details
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
