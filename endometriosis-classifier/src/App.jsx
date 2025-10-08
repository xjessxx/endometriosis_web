import React, { useState, useEffect } from "react";
import { loadModel, preprocessInput, predict } from "./decisionTree"; //functionsd from helper from json

export default function App() {
  const [form, setForm] = useState({
    Age: "",
    TSH_Level: "",
    T3_Level: "",
    T4_Level: "",
    Nodule_Size: "",
    Gender: "",
    Country: "",
    Ethnicity: "",
    Family_History: "",
    Radiation_Exposure: "",
    Iodine_Deficiency: "",
    Smoking: "",
    Obesity: "",
    Diabetes: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [model, setModel] = useState(null);

  //load model
  useEffect(() => {
    loadModel().then(m => {
      setModel(m);
      setModelReady(true);
    }).catch(err => {
      console.error("Failed to load model:", err);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelReady) return;
    
    setLoading(true);
    
    try {
      // Preprocess the input
      const features = preprocessInput(form, model.preprocConfig);
      
      // Make prediction
      const prediction = predict(features, model.treeModel);
      
      // Set result
      setResult(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("An error occurred during prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-yellow-300 to-cyan-200 py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-yellow-200">☰</button>
          <h1 className="text-2xl font-bold text-sky-900">
            THYROID<span className="text-yellow-600">CANCER</span> RECCURANCE PROBABILITY
          </h1>
          <p className="text-sm text-gray-700 ml-3">web name needs work</p>
        </div>
        <div>
          <span className="text-4xl text-cyan-800">⚕️</span>
        </div>
      </header>

      {/* About Section */}
      <section className="w-10/12 mt-10 text-sky-800">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="bg-gradient-to-b from-blue-100 to-white p-6 rounded-lg shadow-md border border-blue-200 flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              Why can thyroid cancer reccur?
            </h2>
            <p className="text-sm leading-relaxed">
              The timing of thyroid cancer recurrence varies widely from person to person. 
              Some may experience a recurrence only 6 monthsTrusted Source after entering remission, 
              while others may not experience a recurrence for years or even decades. 
            </p>
            <p className="text-sm leading-relaxed">
              Thyroid cancer recurs because a small number of cancer cells survive initial treatments, 
              leading to persistent disease that can grow and become detectable later. Tumors may reaccur because of
              incomplete original removal, dormant cancer cells remaining after treatment, or aggressive forms of
              thyroid cancer being resistant to certain treatment options
            </p>
          </div>

          <div className="bg-gradient-to-b from-yellow-100 to-white p-6 rounded-lg shadow-md border border-blue-200 flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-sky-900">
              Common Symptoms of Reccurance:
            </h2>
            <ul className="list-disc list-inside text-sm leading-relaxed">
              <li>swollen or enlarged lymph nodes</li>
              <li>lumps or swelling in the throat</li>
              <li>a lingering cough or sore throat</li>
              <li>difficulties with breathing or swallowing</li>
            </ul>
          </div>
        </div>
      </section>

    {/* Input Fields (integrated form) */}
<section className="w-10/12 mt-10 bg-gradient-to-b from-yellow-50 to-white p-6 rounded-xl shadow-md">
  <h2 className="text-xl font-semibold mb-4 text-sky-800">Thyroid Cancer Screening Form</h2>
  
  <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-2xl w-full max-w-2xl mx-auto">
    {/* Numeric Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block font-medium mb-1">Age</label>
        <input
          type="number"
          name="Age"
          value={form.Age}
          onChange={handleChange}
          min="0"
          max="120"
          className="border border-gray-300 rounded-md w-full p-2"
          placeholder="e.g., 45"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">TSH Level (mIU/L)</label>
        <input
          type="number"
          name="TSH_Level"
          value={form.TSH_Level}
          onChange={handleChange}
          min="0"
          max="20"
          step="0.1"
          className="border border-gray-300 rounded-md w-full p-2"
          placeholder="e.g., 2.5"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">T3 Level (ng/dL)</label>
        <input
          type="number"
          name="T3_Level"
          value={form.T3_Level}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          className="border border-gray-300 rounded-md w-full p-2"
          placeholder="e.g., 1.2"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">T4 Level (μg/dL)</label>
        <input
          type="number"
          name="T4_Level"
          value={form.T4_Level}
          onChange={handleChange}
          min="0"
          max="20"
          step="0.1"
          className="border border-gray-300 rounded-md w-full p-2"
          placeholder="e.g., 8.5"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Nodule Size (cm)</label>
        <input
          type="number"
          name="Nodule_Size"
          value={form.Nodule_Size}
          onChange={handleChange}
          min="0"
          max="10"
          step="0.1"
          className="border border-gray-300 rounded-md w-full p-2"
          placeholder="e.g., 2.5"
          required
        />
      </div>
    </div>

    {/* Dropdown Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium mb-1">Gender</label>
        <select
          name="Gender"
          value={form.Gender}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Country</label>
        <select
          name="Country"
          value={form.Country}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="Brazil">Brazil</option>
          <option value="China">China</option>
          <option value="Germany">Germany</option>
          <option value="India">India</option>
          <option value="Japan">Japan</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Russia">Russia</option>
          <option value="South Korea">South Korea</option>
          <option value="UK">UK</option>
          <option value="USA">USA</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Ethnicity</label>
        <select
          name="Ethnicity"
          value={form.Ethnicity}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="African">African</option>
          <option value="Asian">Asian</option>
          <option value="Caucasian">Caucasian</option>
          <option value="Hispanic">Hispanic</option>
          <option value="Middle Eastern">Middle Eastern</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Family History</label>
        <select
          name="Family_History"
          value={form.Family_History}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Radiation Exposure</label>
        <select
          name="Radiation_Exposure"
          value={form.Radiation_Exposure}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Iodine Deficiency</label>
        <select
          name="Iodine_Deficiency"
          value={form.Iodine_Deficiency}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Smoking</label>
        <select
          name="Smoking"
          value={form.Smoking}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Obesity</label>
        <select
          name="Obesity"
          value={form.Obesity}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Diabetes</label>
        <select
          name="Diabetes"
          value={form.Diabetes}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full p-2"
          required
        >
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
    </div>
    

    <button
      type="submit"
      disabled={loading || !modelReady}
      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed w-full mt-6"
    >
      {loading ? "Analyzing..." : "Predict"}
    </button>
  </form>


        {result && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-lg text-center mx-auto">
            <h2 className="text-xl font-semibold mb-2">Prediction Result</h2>
            <p className="text-gray-700">Classification: {result.classification}</p>
            <p className="text-gray-700">Probability: {result.probability}%</p>
            <p className="text-sm text-gray-500 mt-4">
              ⚠️ This is for educational purposes only. Consult a healthcare provider for diagnosis.
            </p>
          </div>
          
        )}
      </section>

      {/* Output Placeholder */}
      <section className="w-10/12 mt-10 bg-gradient-to-b from-cyan-100 to-blue-50 p-6 rounded-xl shadow-md mb-20 text-center">
        <p className="text-lg font-medium text-gray-700">
          Output — maybe we refer them to a website to find doctors in their area.
        </p>
      </section>
    </div>
  );
}

/*
// === example of tree logic === still need to connect 
function classifyEndometriosis({ age, chronicPain, bmi, menstrual, hormone, infertility }) {
  age = parseFloat(age);
  chronicPain = parseFloat(chronicPain);
  bmi = parseFloat(bmi);
  menstrual = parseInt(menstrual);
  hormone = parseInt(hormone);
  infertility = parseInt(infertility);

  if (hormone <= 0.5) {
    if (age <= 39.5) {
      if (chronicPain > 4.76) {
        if (bmi <= 23.38 && age <= 19.5 && chronicPain > 4.92) {
          return { classification: "NEGATIVE", probability: 10 };
        }
      }
    }
  }
  return { classification: "EPOSITIVE", probability: 80 };
}*/
