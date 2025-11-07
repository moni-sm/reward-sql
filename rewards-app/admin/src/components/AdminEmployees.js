import React, { useEffect, useRef, useState } from 'react';
import './AdminEmployees.css';
import { fetchAllEmployees } from '../utils/fetchAllEmployees';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    email: '',
    phone: '',
    department: '',
    designation: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const formRef = useRef(null);

  const API_URL = 'http://192.168.5.83:10800/employees';

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchAllEmployees();

    const formatted = data.map(emp => ({
      id: emp.E_ID,
      empId: emp.E_ID,
      name: emp.E_Name,
      email: emp.Email_ID || '',
      phone: emp.Phone || '',
      department: emp.E_Dpt,
      designation: emp.E_Dsg
    }));

    setEmployees(formatted);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      let clean = value.replace(/^(\+91|91)/, '').replace(/\D/g, '');
      clean = clean.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: clean }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      empId: '',
      email: '',
      phone: '',
      department: '',
      designation: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Submitting form", formData);

    const trimmedEmpId = String(formData.empId).trim();
    const normalizedEditingId = String(editingId || '').trim();

    const isDuplicate = employees.some(emp =>
      String(emp.empId).trim() === trimmedEmpId &&
      String(emp.id).trim() !== normalizedEditingId
    );

    if (isDuplicate) {
      alert('⚠️ This Employee ID already exists.');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await loadEmployees();
        resetForm();
        setMessage(editingId ? '✅ Employee updated!' : '✅ Employee added!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('❌ Failed to save employee');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleRowClick = (emp) => {
    if (window.confirm(`Edit details for ${emp.name}?`)) {
      setFormData({
        name: emp.name,
        empId: emp.empId,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        designation: emp.designation,
      });
      setEditingId(emp.id);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) loadEmployees();
      else alert('❌ Delete failed');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="admin-emp-wrapper">
      <h1>👥 Manage Employees</h1>

      <form ref={formRef} className="emp-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Employee Name"
          required
        />

        <input
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          placeholder="Employee ID"
          required
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          type="tel"
          pattern="[0-9]{10}"
          maxLength={10}
          required
        />

        <input
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          required
        />

        <input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
          required
        />

        <button type="submit">{editingId ? 'Update' : 'Add'} Employee</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {message && <div className="success-message">{message}</div>}

      <table className="emp-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="7">No employees found</td></tr>
          ) : (
            employees.map(emp => (
              <tr
                key={emp.id}
                className={editingId === emp.id ? 'editing-row' : ''}
                onClick={() => handleRowClick(emp)}
                style={{ cursor: 'pointer' }}
              >
                <td>{emp.name}</td>
                <td>{emp.empId}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEmployees;
