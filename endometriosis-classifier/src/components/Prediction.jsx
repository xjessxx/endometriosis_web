import React, { useState, useEffect } from "react";
import { loadModel, preprocessInput, predict } from "../decisionTree";

export default function Prediction() {
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



  useEffect(() => {
    loadModel().then(m => {
      setModel(m);
      setModelReady(true);
    }).catch(err => console.error("Model load failed:", err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelReady) return;
    setLoading(true);

    try {
      // Preprocess the input
      const features = preprocessInput(form, model.preprocConfig);

      // Make prediction
      const prediction = predict(features, model.treeModel);

      // set result
      setResult(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full">
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-10 bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50 min-h-screen">
    <section className="max-w-4xl mx-auto mt-10 bg-white/80 backdrop-blur-md border border-pink-200 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold text-center text-purple-800 mb-8">
        Thyroid Cancer Screening Form
      </h2>
        
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
      <section className="max-w-4xl mx-auto mt-10 bg-gradient-to-r from-teal-50 to-pink-50 border border-purple-100 p-6 rounded-2xl shadow-sm mb-20 text-center">
        <p className="text-lg font-medium text-gray-700">
          Output — maybe we refer them to a website to find doctors in their area.
        </p>
      </section>
    </div>
    </div>
  ); 
}
    //   {result && (
    //     <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-lg text-center mx-auto">
    //       <h2 className="text-xl font-semibold mb-2 text-purple-700">Prediction Result</h2>
    //       <p className="text-gray-700">Classification: {result.classification}</p>
    //       <p className="text-gray-700">Probability: {result.probability}%</p>
    //       <p className="text-sm text-gray-500 mt-4">
    //         ⚠️ Educational use only — consult a licensed healthcare provider.
    //       </p>
    //     </div>
    //   )}
    // </div>
