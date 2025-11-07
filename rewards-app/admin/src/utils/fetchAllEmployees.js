

const BASE_URL = "http://192.168.5.83:10800";

/**
 * ✅ Fetch ALL employees with full details (ID, name, dept, email)
 * Same as HTML `loadEmployees()` logic
 */
export const fetchAllEmployees = async () => {
  const res = await fetch(`${BASE_URL}/employees`);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return await res.json();
};
