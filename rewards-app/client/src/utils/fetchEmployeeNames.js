


export const fetchEmployeeNames = async () => {
  try {
    const res = await fetch("http://192.168.5.83:10800/employees");
    const data = await res.json();

    // Filter out empty records & extract names
    return data
      .filter(emp => emp.EmployeeName && emp.EmployeeName.trim() !== "")
      .map(emp => emp.EmployeeName);
      
  } catch (err) {
    console.error("Error fetching employee names:", err);
    return [];
  }
};
