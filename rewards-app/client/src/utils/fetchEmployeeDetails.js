import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.BACKEND_URL;


export const fetchEmployeeDetails = async (query) => {
  try {
    const res = await fetch(`${API_URL}/employees`);
    const data = await res.json();

    return data.find(
      emp =>
        emp.EmployeeName.toLowerCase() === query.toLowerCase() ||
        emp.Email?.toLowerCase() === query.toLowerCase()
    );
  } catch (err) {
    console.error("Employee detail fetch error:", err);
    return null;
  }
};
