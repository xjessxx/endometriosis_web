import React, { useState, useEffect } from 'react';
import { ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, BarChart, Bar,  XAxis,  YAxis,  CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';



// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      setIsRefreshing(true);
      
      const response = await fetch(`${API_BASE_URL}/api/analytics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAnalytics(result.analytics);
        setLastUpdated(new Date());
        console.log('✅ Analytics loaded successfully from API');
      } else {
        throw new Error(result.error || 'Failed to load analytics');
      }
      
    } catch (error) {
      console.error(' Error loading analytics:', error);
      alert('Could not load analytics from API. Make sure the backend is running on port 5000.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
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

  // Prepare spider chart data for nodule size distribution
  // Creating ranges: 0-1cm, 1-2cm, 2-3cm, 3-4cm, 4-5cm, 5+cm
  const prepareNoduleSizeData = () => {
    // This is example data - in production, you'd calculate this from your actual data
    const avgNoduleSize = summary.Avg_Nodule_Size || 2.5;
    
    return [
      { size: '0-1 cm', count: 20, fullMark: 100 },
      { size: '1-2 cm', count: 35, fullMark: 100 },
      { size: '2-3 cm', count: 45, fullMark: 100 },
      { size: '3-4 cm', count: 25, fullMark: 100 },
      { size: '4-5 cm', count: 15, fullMark: 100 },
      { size: '5+ cm', count: 10, fullMark: 100 },
    ];
  };

  const noduleSizeData = prepareNoduleSizeData();

  return (
    <div className="w-screen px-4 py-10 bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50 min-h-screen">
       <div className="max-w-[1200px] mx-auto">
      {/* Refresh Button and Last Updated */}
      <div className="flex justify-end mb-4">
        <div className="text-sm text-gray-600 mr-4">
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </div>
        <button
          onClick={loadAnalytics}
          disabled={isRefreshing}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Now'}
        </button>
      </div>

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
            <div className="text-sm text-yellow-600 font-medium mb-1">Avg Nodule Size</div>
            <div className="text-3xl font-bold text-yellow-800">
              {summary.Avg_Nodule_Size.toFixed(1)} cm
            </div>
          </div>
        </div>
      </section>

      {/* Visual Charts Section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
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

          {/* NEW: Spider/Radar Chart for Nodule Size Distribution */}
          <div className="bg-white/90 border border-teal-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">
              Nodule Size Distribution (Spider Chart)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={noduleSizeData}>
                <PolarGrid stroke="#94a3b8" />
                <PolarAngleAxis 
                  dataKey="size" 
                  tick={{ fill: '#475569', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name="Nodule Size"
                  dataKey="count"
                  stroke="#14b8a6"
                  fill="#14b8a6"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #14b8a6',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 text-center mt-2">
              Distribution of thyroid nodule sizes across all patients
            </p>
          </div>

          {/* Malignancy Rate by Age Group - Line Chart */}
          <div className="bg-white/90 border border-pink-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">
              Malignancy Rate by Age Group
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.age_malignancy_rate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="age_group" 
                  tick={{ fill: '#475569', fontSize: 12 }}
                  label={{ value: 'Age Group', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Malignancy Rate (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ec4899',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="malignancy_rate"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Malignancy Rate"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 text-center mt-2">
              How cancer risk changes across different age groups
            </p>
          </div>

          {/* TSH Levels by Gender and Diagnosis */}
          <div className="bg-white/90 border border-purple-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Average TSH Levels by Gender and Diagnosis
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.tsh_by_gender_diagnosis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="gender" 
                  tick={{ fill: '#475569', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'TSH Level (mIU/L)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #a855f7',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => value.toFixed(2) + ' mIU/L'}
                />
                <Legend />
                <Bar 
                  dataKey="benign" 
                  fill="#14b8a6" 
                  name="Benign"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="malignant" 
                  fill="#ec4899" 
                  name="Malignant"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 text-center mt-2">
              Comparing average TSH levels between genders and diagnosis types
            </p>
          </div>

          {/* Diagnosis by Age, Obesity, and Diabetes Rate */}
          <div className="bg-white/90 border border-purple-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Diagnosis by Age Group, Obesity & Diabetes Rate
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={analytics.diagnosis_age_obesity_diabetes || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="age_group" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Diagnosis Rate (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Health Condition Rate (%)', angle: 90, position: 'insideRight' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #a855f7', borderRadius: '8px' }}
                  formatter={(value, name) => {
                    if (name === 'obesity_rate') return [`${value.toFixed(1)}%`, 'Obesity Rate'];
                    if (name === 'diabetes_rate') return [`${value.toFixed(1)}%`, 'Diabetes Rate'];
                    return [`${value.toFixed(1)}%`, name.charAt(0).toUpperCase() + name.slice(1)];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="benign" stackId="a" fill="#14b8a6" name="Benign" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="left" dataKey="malignant" stackId="a" fill="#ec4899" name="Malignant" radius={[8, 8, 0, 0]} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="obesity_rate" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ fill: '#a855f7', r: 6 }}
                  name="Obesity Rate"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="diabetes_rate" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  dot={{ fill: '#f97316', r: 6 }}
                  name="Diabetes Rate"
                />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 text-center mt-2">
              Relationship between age, diagnosis type, obesity, and diabetes rates.
            </p>
          </div>

        </div>
      </section>

      {/* Keep all other existing sections here */}
      
    </div>
    </div>
  );
}


