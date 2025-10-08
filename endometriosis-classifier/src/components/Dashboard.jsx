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

      {/* Dashboard Overview */}
      <section className="bg-white/90 border border-pink-200 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Dashboard Overview
        </h2>
        <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          Welcome to the analytics dashboard. Here we visualize prediction trends,
          patient demographics, and recurrence probabilities.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-tr from-teal-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-teal-700 mb-2">
              Recurrence Trends
            </h3>
            <p className="text-gray-600 text-sm">
              Placeholder for future chart visualization
            </p>
          </div>

          <div className="bg-gradient-to-tr from-pink-100 to-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-medium text-pink-700 mb-2">
              Demographics
            </h3>
            <p className="text-gray-600 text-sm">
              Placeholder for demographic visualization
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}