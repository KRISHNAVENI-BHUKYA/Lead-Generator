import React, { useState } from "react";
import "./LeadForm.css";

function LeadForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email } = formData;

    if (!name || !email) return setError("Name and email are required.");
    if (!validateEmail(email)) return setError("Invalid email format.");

    try {
      const res = await fetch("http://localhost:5000/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(result.message);
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name*" value={formData.name} onChange={handleChange} />
      <input name="email" placeholder="Email*" value={formData.email} onChange={handleChange} />
      <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
      <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} />
      <button type="submit">Submit</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
}

export default LeadForm;
