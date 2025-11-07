// ✅ SAME IMPORTS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../style/NominationForm.css";

const BASE_URL = "http://192.168.5.83:10800";

const initialFormState = {
  EmployeeName: "",
  EmployeeID: "",
  Department: "",
  Designation: "",
  MonthOfNomination: "",
  AwardType: "",
  AwardCategory: "",
  Reason: "",
  Impact: "",
  NominatorName: "",
  NominatorDesignation: "",
  NominatorEmail: "",
  UploadDoc: null,
};

const categoryOptions = {
  Monthly: ["GreatJob", "Ace of Sales", "Customer Advocate", "Out of the Box Thinker"],
  Quarterly: ["Rising Star"],
  "Half-Yearly": ["Perfect Mentor", "Guiding Star", "Rockstar"],
};

const NominationForm = () => {
  const [form, setForm] = useState(initialFormState);
  const [employeeList, setEmployeeList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  // ✅ Fetch employee list from backend (same as HTML)
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch(`${BASE_URL}/employees`);
      const data = await res.json();
      setEmployeeList(data);
    };
    fetchEmployees();
  }, []);

  // ✅ Set default month (React's original behavior)
  useEffect(() => {
    const today = new Date();
    const m = today.toISOString().slice(0, 7);
    setForm((prev) => ({ ...prev, MonthOfNomination: m }));
  }, []);

  // ✅ Select employee (same logic as HTML dropdown)
  const handleEmployeeSelect = (selected) => {
    const emp = employeeList.find(e => e.E_Name === selected.value);
    if (!emp) return;

    setForm(prev => ({
      ...prev,
      EmployeeName: emp.E_Name,
      EmployeeID: emp.E_ID,
      Department: emp.E_Dpt,
      Designation: emp.E_Dsg,
    }));
  };

  // ✅ Email input for nominator (same as HTML selection logic)
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setForm(prev => ({ ...prev, NominatorEmail: email }));
    setOtpSent(false);
    setOtp("");

    const emp = employeeList.find(e => e.Email_ID === email);
    if (emp) {
      setForm(prev => ({
        ...prev,
        NominatorName: emp.E_Name,
        NominatorDesignation: emp.E_Dsg,
      }));
    }
  };

  // ✅ Handle input fields / file
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // ✅ Form validation
  const validateForm = () => {
    const required = [
      "EmployeeName","EmployeeID","Department","Designation",
      "AwardType","AwardCategory","Reason","Impact",
      "NominatorName","NominatorDesignation","NominatorEmail"
    ];

    let errors = {};
    required.forEach(key => {
      if (!form[key]) errors[key] = `${key} is required`;
    });
    if (!otp) errors.OTP = "Enter OTP";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Send OTP (match HTML — send {email})
  const handleSendOtp = async () => {
    if (!form.NominatorEmail) return alert("Enter email");

    setSendingOtp(true);
    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.NominatorEmail }),
    });

    const data = await res.json();
    setOtpSent(true);
    setOtpMessage(data.message);
    setSendingOtp(false);
  };

  // ✅ Submit to SQL backend (same as HTML form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key]);
    });
    formData.append("OTP", otp);

    const res = await fetch(`${BASE_URL}/submit-nomination`, {
      method: "POST",
      body: formData
    });
    const result = await res.json();

    if (result.message?.includes("success")) {
      setShowSuccessPopup(true);
      setTimeout(() => window.location.reload(), 2000);
    } else alert(result.message);
  };

  return (
    <div className="container">
      <h2>🏆 Rewards & Recognition Nomination 🏆</h2>

      <form onSubmit={handleSubmit}>

        {/* ✅ Employee Name (React multi-search but uses backend data) */}
        <label>Employee Name</label>
        <Select
          options={employeeList.map((e) => ({ label: e.E_Name, value: e.E_Name }))}
          onChange={(o) => handleEmployeeSelect(o)}
        />

        <label>Employee ID</label>
        <input value={form.EmployeeID} readOnly />

        <label>Department</label>
        <input value={form.Department} readOnly />

        <label>Designation</label>
        <input value={form.Designation} readOnly />

        <label>Award Type</label>
        <select name="AwardType" value={form.AwardType} onChange={handleChange}>
          <option value="">Select</option>
          {Object.keys(categoryOptions).map((t) => <option key={t}>{t}</option>)}
        </select>

        <label>Award Category</label>
        <select name="AwardCategory" value={form.AwardCategory} onChange={handleChange}>
          <option value="">Select</option>
          {categoryOptions[form.AwardType]?.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label>Reason</label>
        <textarea name="Reason" value={form.Reason} onChange={handleChange} />

        <label>Impact</label>
        <textarea name="Impact" value={form.Impact} onChange={handleChange} />

        <label>Nominator Email</label>
        <input type="email" value={form.NominatorEmail} onChange={handleEmailChange} />

        <label>Nominator Name</label>
        <input value={form.NominatorName} readOnly />

        <label>Nominator Designation</label>
        <input value={form.NominatorDesignation} readOnly />

        {/* ✅ OTP Section — preserves your UI */}
        {form.NominatorEmail && (
          <div>
            {!otpSent ? (
              <button type="button" onClick={handleSendOtp}>
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            )}
            <p>{otpMessage}</p>
          </div>
        )}

        <label>Upload Document</label>
        <input type="file" name="UploadDoc" onChange={handleChange} />

        <button type="submit">{loadingSubmit ? "Submitting..." : "Submit"}</button>
      </form>

      {showSuccessPopup && <h3>✅ Submitted Successfully!</h3>}
    </div>
  );
};

export default NominationForm;
