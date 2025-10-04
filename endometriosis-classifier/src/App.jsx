import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    age: "",
    chronicPain: "",
    bmi: "",
    menstrual: "",
    hormone: "",
    infertility: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const risk = classifyEndometriosis(form);
    setResult(risk);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-yellow-300 to-cyan-200 py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-yellow-200">☰</button>
          <h1 className="text-2xl font-bold text-sky-900">
            ENDO<span className="text-yellow-600">METRIOSIS</span> CLASSIFIER
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
              What is endometriosis?
            </h2>
            <p className="text-sm leading-relaxed">
              Endometriosis is a painful condition in which uterine lining tissue
              grows outside of the uterus. It thickens, breaks down, and bleeds
              with each cycle, but these materials cannot exit the body as they
              are stuck in the pelvic area. The scar tissue formed from this causes
              internal irritation and may cause pelvic organs to stick together,
              leading to fertility issues.
            </p>
          </div>

          <div className="bg-gradient-to-b from-yellow-100 to-white p-6 rounded-lg shadow-md border border-blue-200 flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-sky-900">
              Common Symptoms:
            </h2>
            <ul className="list-disc list-inside text-sm leading-relaxed">
              <li>Painful Periods</li>
              <li>Pain with Sex</li>
              <li>Pain with Bowel Movements or Urination</li>
              <li>Excessive Bleeding</li>
              <li>Infertility</li>
              <li>Fatigue</li>
              <li>Bloating</li>
              <li>Nausea</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-blue-600 text-sm">
          Endometriosis affects roughly 10% (190 million) of reproductive-age
          women and girls globally. It can take from 4 to 11 years on average to
          receive a diagnosis. This site will guide you through questions to see
          if you may present with conditions related to the disease.
        </p>
      </section>

      {/* Input Fields (integrated form) */}
      <section className="w-10/12 mt-10 bg-gradient-to-b from-yellow-50 to-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-sky-800">Screening Form</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-2xl w-full max-w-md mx-auto">
          {[
            { name: "age", label: "Age", type: "number" },
            { name: "chronicPain", label: "Chronic Pain Level (1-10)", type: "number" },
            { name: "bmi", label: "BMI", type: "number" },
            { name: "menstrual", label: "Menstrual Irregularity (0/1)", type: "number" },
            { name: "hormone", label: "Hormone Abnormality (0/1)", type: "number" },
            { name: "infertility", label: "Infertility (0/1)", type: "number" },
          ].map((f) => (
            <div key={f.name} className="mb-4">
              <label className="block font-medium mb-1">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full p-2"
                required
              />
            </div>
          ))}

          <button className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500">
            Predict
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
}
