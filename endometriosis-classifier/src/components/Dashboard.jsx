import React from "react";

export default function Dashboard() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-10 bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50 min-h-screen">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          {/* Left Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg p-6 rounded-2xl flex-1 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-purple-800 mb-3">
              Why Can Thyroid Cancer Recur?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              The timing of thyroid cancer recurrence varies widely from person to person. 
              Some may experience a recurrence only 6 monthsTrusted Source after entering remission, 
              while others may not experience a recurrence for years or even decades.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Thyroid cancer recurs because a small number of cancer cells survive initial treatments, 
              leading to persistent disease that can grow and become detectable later. Tumors may reaccur because of
              incomplete original removal, dormant cancer cells remaining after treatment, or aggressive forms of
              thyroid cancer being resistant to certain treatment options.
            </p>
          </div>

          {/* Right Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-teal-200 shadow-lg p-6 rounded-2xl flex-1 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-teal-700 mb-3">
              Common Symptoms of Recurrence
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li>Swollen or enlarged lymph nodes</li>
              <li>Lumps or swelling in the throat</li>
              <li>Lingering cough or sore throat</li>
              <li>Difficulty breathing or swallowing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics Overview */}
      <section className="bg-white/90 border border-pink-200 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
          Analytics Overview
        </h2>
        <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          Welcome to the Analytics dashboard. Here we display ------....
        </p>
        <h3 className="text-2xl font-semibold text-center text-purple-700 mt-10 mb-6">
             Quick Dataset Insights
          </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-teal-200 shadow hover:shadow-lg transition">
              <h4 className="text-teal-700 font-bold text-lg mb-1">Average Age</h4>
              <p className="text-gray-700">Patients have an average age of <span className="font-semibold">52 years</span> (range 15–89).</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-pink-200 shadow hover:shadow-lg transition">
              <h4 className="text-pink-700 font-bold text-lg mb-1">Average Hormone Levels</h4>
              <p className="text-gray-700">
                TSH ≈ <span className="font-semibold">5.0</span>, T3 ≈ <span className="font-semibold">2.0</span>, 
                T4 ≈ <span className="font-semibold">8.2</span>
              </p>
            </div>
        
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-purple-200 shadow hover:shadow-lg transition">
              <h4 className="text-purple-700 font-bold text-lg mb-1">Malignancy Rate</h4>
              <p className="text-gray-700">
                About <span className="font-semibold">23%</span> of cases are malignant.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-yellow-200 shadow hover:shadow-lg transition">
              <h4 className="text-yellow-700 font-bold text-lg mb-1">Family History</h4>
              <p className="text-gray-700">
                Roughly <span className="font-semibold">25%</span> of patients report a family history of thyroid issues.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-green-200 shadow hover:shadow-lg transition">
              <h4 className="text-green-700 font-bold text-lg mb-1">Obesity & Diabetes</h4>
              <p className="text-gray-700">
                <span className="font-semibold">30%</span> show obesity and <span className="font-semibold">20%</span> have diabetes — both notable recurrence risk factors.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blue-200 shadow hover:shadow-lg transition">
              <h4 className="text-blue-700 font-bold text-lg mb-1">Data Coverage</h4>
              <p className="text-gray-700">
                The dataset includes <span className="font-semibold">212,691 patients</span> across 10 countries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="bg-white/90 border border-pink-200 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Dashboard Overview
        </h2>
        <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          Welcome to the Visualization dashboard. Here we visualize prediction trends,
          patient demographics, and recurrence probabilities.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* hormone level distributions Visualization */}
          <div className="bg-gradient-to-tr from-teal-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-teal-700 mb-2">
              Hormone Level Distributions
            </h3>
            <img
              src="/hormone_distribution.png"
              alt="Hormone Level Distributions by Diagnosis"
              className="rounded-lg shadow-md max-h-[320px] object-contain"
            />
            <p className="text-gray-600 text-sm mt-3 text-center italic">
            These hormone levels alone aren’t enough to distinguish benign from malignant cases.
            </p>
          </div>

          {/* Family history visualization */}
          <div className="bg-gradient-to-tr from-pink-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-pink-700 mb-2">
              Risk of Malignancy by Family History
            </h3>
            <img
              src="/family_history_bar.png"
              alt="Hormone Level Distributions by Diagnosis"
              className="rounded-lg shadow-md max-h-[320px] object-contain"
            />
          </div>

          {/* Family history visualization */}
          <div className="bg-gradient-to-tr from-pink-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-pink-700 mb-2">
              Gender Distribution in Recurring Thyroid Cases 
            </h3>
            <img
              src="/gender_distribution.png"
              alt="Hormone Level Distributions by Diagnosis"
              className="rounded-lg shadow-md max-h-[320px] object-contain"
            />
          </div>

          {/* hormone level distributions Visualization */}
          <div className="bg-gradient-to-tr from-teal-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-teal-700 mb-2">
              Diagnosis by Age Group 
            </h3>
            <img
              src="/malignancy_age.png"
              className="rounded-lg shadow-md max-h-[320px] object-contain"
            />
          </div>

        </div>
      </section>
    </div>
  );
}