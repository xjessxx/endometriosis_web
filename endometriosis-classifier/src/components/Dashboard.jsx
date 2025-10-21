import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch the JSON file from the public directory
        const response = await fetch('/thyroid_analytics.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalytics(data);
        console.log('✅ Analytics loaded successfully');
        
      } catch (error) {
        console.error('❌ Error loading analytics:', error);
        alert('Could not load analytics file. Please make sure thyroid_analytics.json is in the /public folder of your project.');
      }
    };
    
    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50">
        <div className="text-2xl text-purple-700">Loading analytics...</div>
      </div>
    );
  }

  const { summary, geo_analysis, gender_distribution, diagnosis_analytics } = analytics;

  // Calculate percentages for visual bars
  const femalePercent = gender_distribution.find(g => g.Gender === 'Female')?.Percentage || 0;
  const malePercent = gender_distribution.find(g => g.Gender === 'Male')?.Percentage || 0;
  const benignPercent = diagnosis_analytics.find(d => d.Diagnosis === 'Benign')?.Percentage || 0;
  const malignantPercent = diagnosis_analytics.find(d => d.Diagnosis === 'Malignant')?.Percentage || 0;

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-10 bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50 min-h-screen">
      
      {/* Header Stats */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">
          Thyroid Cancer Dataset Analytics
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="text-sm text-purple-600 font-medium mb-1">Total Patients</div>
            <div className="text-3xl font-bold text-purple-800">
              {summary.Total_Patients.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-pink-200 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="text-sm text-pink-600 font-medium mb-1">Malignancy Rate</div>
            <div className="text-3xl font-bold text-pink-800">
              {summary.Malignancy_Rate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {summary.Malignant_Count.toLocaleString()} cases
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-teal-200 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="text-sm text-teal-600 font-medium mb-1">Average Age</div>
            <div className="text-3xl font-bold text-teal-800">
              {summary.Avg_Age.toFixed(1)} yrs
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Range: {summary.Min_Age}-{summary.Max_Age}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-yellow-200 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="text-sm text-yellow-600 font-medium mb-1">Countries Covered</div>
            <div className="text-3xl font-bold text-yellow-800">
              {geo_analysis.length}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Charts Section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gender Distribution */}
          <div className="bg-white/90 border border-pink-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">
              Gender Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Female</span>
                  <span className="text-pink-700 font-bold">{femalePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-pink-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${femalePercent}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {gender_distribution.find(g => g.Gender === 'Female')?.Patient_Count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Male</span>
                  <span className="text-purple-700 font-bold">{malePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${malePercent}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {gender_distribution.find(g => g.Gender === 'Male')?.Patient_Count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Distribution */}
          <div className="bg-white/90 border border-purple-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Diagnosis Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Benign</span>
                  <span className="text-teal-700 font-bold">{benignPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-teal-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${benignPercent}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {diagnosis_analytics.find(d => d.Diagnosis === 'Benign')?.Count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Malignant</span>
                  <span className="text-purple-700 font-bold">{malignantPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${malignantPercent}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {diagnosis_analytics.find(d => d.Diagnosis === 'Malignant')?.Count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Countries */}
          <div className="bg-white/90 border border-teal-200 rounded-2xl p-6 shadow-md lg:col-span-2">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Top Countries by Patient Count
            </h3>
            <div className="space-y-3">
              {geo_analysis.slice(0, 5).map((country, index) => {
                const maxPatients = geo_analysis[0].Total_Patients;
                const widthPercent = (country.Total_Patients / maxPatients) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">{country.Country}</span>
                      <div className="text-right">
                        <span className="text-teal-700 font-bold mr-3">
                          {country.Total_Patients.toLocaleString()}
                        </span>
                        <span className="text-pink-600 text-sm">
                          {country.Malignancy_Rate.toFixed(1)}% malignant
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-4 rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Risk Factors Grid */}
      <section className="bg-white/90 border border-purple-200 rounded-2xl p-8 shadow-md mb-10">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Risk Factors Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-200 shadow hover:shadow-lg transition">
            <h4 className="text-pink-700 font-bold text-lg mb-2">Family History</h4>
            <div className="text-4xl font-bold text-pink-800 mb-1">
              {summary.Pct_Family_History.toFixed(1)}%
            </div>
            <p className="text-gray-600 text-sm mb-3">of patients have family history</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${summary.Pct_Family_History}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-200 shadow hover:shadow-lg transition">
            <h4 className="text-purple-700 font-bold text-lg mb-2">Radiation Exposure</h4>
            <div className="text-4xl font-bold text-purple-800 mb-1">
              {summary.Pct_Radiation.toFixed(1)}%
            </div>
            <p className="text-gray-600 text-sm mb-3">exposed to radiation</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${summary.Pct_Radiation}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-200 shadow hover:shadow-lg transition">
            <h4 className="text-teal-700 font-bold text-lg mb-2">Smoking</h4>
            <div className="text-4xl font-bold text-teal-800 mb-1">
              {summary.Pct_Smoking.toFixed(1)}%
            </div>
            <p className="text-gray-600 text-sm mb-3">current or former smokers</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${summary.Pct_Smoking}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-200 shadow hover:shadow-lg transition">
            <h4 className="text-yellow-700 font-bold text-lg mb-2">Obesity</h4>
            <div className="text-4xl font-bold text-yellow-800 mb-1">
              {summary.Pct_Obesity.toFixed(1)}%
            </div>
            <p className="text-gray-600 text-sm mb-3">classified as obese</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${summary.Pct_Obesity}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200 shadow hover:shadow-lg transition">
            <h4 className="text-blue-700 font-bold text-lg mb-2">Diabetes</h4>
            <div className="text-4xl font-bold text-blue-800 mb-1">
              {summary.Pct_Diabetes.toFixed(1)}%
            </div>
            <p className="text-gray-600 text-sm mb-3">have diabetes</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${summary.Pct_Diabetes}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-200 shadow hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold text-lg mb-2">Avg Nodule Size</h4>
            <div className="text-4xl font-bold text-green-800 mb-1">
              {summary.Avg_Nodule_Size.toFixed(1)} cm
            </div>
            <p className="text-gray-600 text-sm mb-3">average nodule size</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(summary.Avg_Nodule_Size / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
/* 
export default function Dashboard() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 py-10 bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50 min-h-screen">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          
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

     
      <section className="bg-white/90 border border-pink-200 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Dashboard Overview
        </h2>
        <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          Welcome to the Visualization dashboard. Here we visualize prediction trends,
          patient demographics, and recurrence probabilities.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          //hormone level distributions Visualization 
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

          //Family history visualization 
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

          // Family history visualization 
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

          // hormone level distributions Visualization 
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

*/
