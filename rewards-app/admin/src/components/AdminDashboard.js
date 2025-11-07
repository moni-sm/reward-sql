import React, { useEffect, useState, useCallback } from 'react';
import './AdminDashboard.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import NomineePopup from './NomineePopup';



const AdminDashboard = () => {
  const [nominations, setNominations] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);

  // ✅ Backend Base URL
  const baseURL = "http://192.168.5.83:10800";
  const baseFilePath = "http://192.168.5.83:10800/";

  // ✅ Fetch & MAP DB fields to UI fields
  const fetchNominations = useCallback(() => {
    fetch(`${baseURL}/nominations`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(n => ({
          id: n.ID,
          empId: n.EmployeeID,
          empName: n.EmployeeName,
          empDept: n.Department,
          empDesig: n.Designation,
          nomMonth: n.MonthOfNomination,
          awardType: n.AwardType,
          awardCategory: n.AwardCategory,
          reason1: n.Reason,
          reason2: n.Impact,
          nomName: n.NominatorName,
          nomDesig: n.NominatorDesignation,
          nomEmail: n.NominatorEmail,
          supportingFile: n.DocumentPath,
          createdAt: n.CreatedAt
        }));
        setNominations(formatted);
      })
      .catch(err => console.error('Error loading nominations:', err));
  }, [baseURL]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  // ✅ Export Excel
  const downloadExcel = () => {
    const filteredData = nominations.map(item => ({
      'Employee Name': item.empName,
      'Employee ID': item.empId,
      'Department': item.empDept,
      'Designation': item.empDesig,
      'Award Type': item.awardType,
      'Award Category': item.awardCategory,
      'Reason': item.reason1,
      'Impact': item.reason2,
      'Nominator': item.nomName,
      'Created At': item.createdAt?.substring(0, 10)
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Nominations`);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Nominations.xlsx`);
  };

  const clearAllNominations = async () => {
    if (!window.confirm("⚠️ Clear ALL nominations?")) return;
    const res = await fetch(`${baseURL}/nominations/clear-all`, { method: 'DELETE' });
    if (res.ok) {
      fetchNominations();
      alert("✅ All nominations cleared");
    }
  };

  const deleteNomination = async (id) => {
    if (!window.confirm("Delete this nomination?")) return;
    const res = await fetch(`${baseURL}/nominations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchNominations();
      alert("✅ Nomination Deleted");
      setSelectedNominee(null);
    }
  };

  const handleNameClick = (name) => {
    const userNominations = nominations.filter(n => n.empName === name);
    setSelectedNominee({
      name,
      nominations: userNominations
    });
  };

  return (
    <div className="dashboard-wrapper">

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'active' : ''}`}>
        <button
          className="sidebar-toggle"
          onClick={() => {
            if (window.innerWidth <= 768) setMobileSidebarOpen(!mobileSidebarOpen);
            else setCollapsed(!collapsed);
          }}
        >
          ☰
        </button>

        <div className="sidebar-section">
          <h2>Admin Menu</h2>

          <button className="download-btn" onClick={downloadExcel}>📥 Download Excel</button>
          <button className="clear-all-btn" onClick={clearAllNominations}>🧨 Clear All Nominations</button>

          <button className="manage-employees-btn" onClick={() => window.location.href = '/admin/employees'}>
            🛠️ Manage Employees
          </button>
        </div>
      </aside>

      {/* ✅ Main */}
      <main className="admin-container">
        <h1 className="admin-heading">🎉 Admin Dashboard</h1>

        <h2 className="table-title">📋 All Nominations</h2>

        <div className="table-wrapper">
          <table className="nominations-table">
            <thead>
              <tr>
                <th>SL No</th>
                <th>Employee</th>
                <th>Dept</th>
                <th>Designation</th>
                <th>Award Type</th>
                <th>Category</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {nominations.length === 0 ? (
                <tr><td colSpan="7" className="no-data">No Nominations Found</td></tr>
              ) : (
                nominations.map((n, index) => (
                  <tr key={n.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="name-link" onClick={() => handleNameClick(n.empName)}>
                        {n.empName}
                      </span>
                    </td>

                    <td>{n.empDept}</td>
                    <td>{n.empDesig}</td>
                    <td>{n.awardType}</td>
                    <td>{n.awardCategory}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteNomination(n.id)}>🗑</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedNominee && (
          <NomineePopup
            nominee={selectedNominee}
            onClose={() => setSelectedNominee(null)}
            onDelete={deleteNomination}
            baseFilePath={baseFilePath}
          />
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
