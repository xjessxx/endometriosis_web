import pandas as pd
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns
import json
import io

sns.set(color_codes=True)
plt.style.use('seaborn-v0_8-darkgrid')

conn = sqlite3.connect('thyroid_data.db') # connect to db

# some analytics?? still not sure what he meant bc I only ever did pure visuals in the other class

# general
query = """
SELECT 
    COUNT(*) as Total_Patients,
    
    -- Diagnosis breakdown
    SUM(CASE WHEN Diagnosis = 'Malignant' THEN 1 ELSE 0 END) as Malignant_Count,
    SUM(CASE WHEN Diagnosis = 'Benign' THEN 1 ELSE 0 END) as Benign_Count,
    ROUND(100.0 * SUM(CASE WHEN Diagnosis = 'Malignant' THEN 1 ELSE 0 END) / COUNT(*), 2) as Malignancy_Rate,
    
    -- Demographics
    ROUND(AVG(Age), 1) as Avg_Age,
    MIN(Age) as Min_Age,
    MAX(Age) as Max_Age,
    
    -- Lab values
    ROUND(AVG(TSH_Level), 2) as Avg_TSH,
    ROUND(AVG(T3_Level), 2) as Avg_T3,
    ROUND(AVG(T4_Level), 2) as Avg_T4,
    ROUND(AVG(Nodule_Size), 2) as Avg_Nodule_Size,
    
    -- Risk factors prevalence
    ROUND(100.0 * SUM(CASE WHEN Family_History = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 1) as Pct_Family_History,
    ROUND(100.0 * SUM(CASE WHEN Radiation_Exposure = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 1) as Pct_Radiation,
    ROUND(100.0 * SUM(CASE WHEN Smoking = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 1) as Pct_Smoking,
    ROUND(100.0 * SUM(CASE WHEN Obesity = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 1) as Pct_Obesity,
    ROUND(100.0 * SUM(CASE WHEN Diabetes = 'Yes' THEN 1 ELSE 0 END) / COUNT(*), 1) as Pct_Diabetes
FROM patients
"""

summary = pd.read_sql_query(query, conn)
print("=== GENERAL ANALYTICS SUMMARY ===\n")
print(summary.T)  

#geo distribution
query = """
SELECT 
    Country,
    COUNT(*) as Total_Patients,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM patients), 1) as Pct_of_Total,
    SUM(CASE WHEN Diagnosis = 'Malignant' THEN 1 ELSE 0 END) as Malignant_Cases,
    ROUND(100.0 * SUM(CASE WHEN Diagnosis = 'Malignant' THEN 1 ELSE 0 END) / COUNT(*), 1) as Malignancy_Rate
FROM patients
GROUP BY Country
ORDER BY Total_Patients DESC
"""

country_analytics = pd.read_sql_query(query, conn)
print("\n=== GEOGRAPHIC DISTRIBUTION ===")
print(country_analytics)

# ADDED: Gender distribution query
query = """
SELECT 
    Gender,
    COUNT(*) as Patient_Count,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM patients), 2) as Percentage
FROM patients
GROUP BY Gender
ORDER BY Patient_Count DESC
"""

gender_data = pd.read_sql_query(query, conn)
print("\n=== GENDER DISTRIBUTION ===")
print(gender_data)

# diagnosis
query = """
SELECT Diagnosis, COUNT(*) as Count, 
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM patients), 1) as Percentage
FROM patients GROUP BY Diagnosis
"""
diag = pd.read_sql_query(query, conn)
print("\n=== DIAGNOSIS ===")
for _, row in diag.iterrows():
    print(f"  {row['Diagnosis']}: {row['Count']:,} ({row['Percentage']}%)")

# metadata
query = "SELECT * FROM patients"
meta = pd.read_sql_query(query, conn)

# Get the info
print("=== DATASET METADATA (data.info()) ===\n")
meta.info()

# export to json 

# Capture info() output
buffer = io.StringIO()
meta.info(buf=buffer)
info_output = buffer.getvalue()

# Get column information
columns_metadata = []
for col in meta.columns:
    col_info = {
        "name": col,
        "dtype": str(meta[col].dtype),
        "non_null_count": int(meta[col].count()),
        "null_count": int(meta[col].isnull().sum()),
        "unique_values": int(meta[col].nunique())
    }
    
    # Add min/max/mean for numeric columns
    if meta[col].dtype in ['int64', 'float64']:
        col_info["min"] = float(meta[col].min())
        col_info["max"] = float(meta[col].max())
        col_info["mean"] = float(meta[col].mean())
    
    columns_metadata.append(col_info)

# Create metadata object
metadata = {
    "dataset_name": "Thyroid Cancer Risk Data",
    "total_records": len(meta),
    "total_columns": len(meta.columns),
    "memory_usage_mb": round(meta.memory_usage(deep=True).sum() / (1024 * 1024), 2),
    "columns": columns_metadata,
    "info_output": info_output,
    "generated_at": pd.Timestamp.now().isoformat()
}

# Save to JSON
with open('thyroid_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

# export analytics to json so we can use in FE - also the images are saved 
# (i removed the print lines so they wouldnt keep getting saved) 
# put them in public folder

# 1. Summary Statistics
summary_dict = summary.to_dict('records')[0]

# 2. Geographic Analysis
geo_data_dict = country_analytics.to_dict('records')

# 3. Gender Distribution
gender_dict = gender_data.to_dict('records')

# 4. Country Analytics
country_dict = country_analytics.to_dict('records')

# 5. Diagnosis Analytics
diagnosis_dict = diag.to_dict('records')

# 6. Nodule Size Distribution
bins = [0, 1, 2, 3, 4, 5, float('inf')]
labels = ['0-1 cm', '1-2 cm', '2-3 cm', '3-4 cm', '4-5 cm', '5+ cm']

meta['Nodule_Range'] = pd.cut(meta['Nodule_Size'], bins=bins, labels=labels)
nodule_distribution = meta['Nodule_Range'].value_counts().sort_index()

# Convert to list of dicts for frontend
nodule_size_dict = [
    {"size": label, "count": int(nodule_distribution.get(label, 0))}
    for label in labels
]

# 7. TSH Levels by Gender and Diagnosis
tsh_by_gender_diagnosis = meta.groupby(['Gender', 'Diagnosis'])['TSH_Level'].mean().reset_index()
tsh_by_gender_diagnosis.columns = ['Gender', 'Diagnosis', 'Avg_TSH']

# Reshape for frontend
tsh_chart_data = []
for gender in ['Male', 'Female']:
    gender_data = tsh_by_gender_diagnosis[tsh_by_gender_diagnosis['Gender'] == gender]
    
    benign_tsh = gender_data[gender_data['Diagnosis'] == 'Benign']['Avg_TSH'].values
    malignant_tsh = gender_data[gender_data['Diagnosis'] == 'Malignant']['Avg_TSH'].values
    
    tsh_chart_data.append({
        "gender": gender,
        "benign": float(benign_tsh[0]) if len(benign_tsh) > 0 else 0,
        "malignant": float(malignant_tsh[0]) if len(malignant_tsh) > 0 else 0
    })

# 8. Malignancy Rate by Age Group
age_bins = [0, 30, 40, 50, 60, 70, 100]
age_labels = ['<30', '30-39', '40-49', '50-59', '60-69', '70+']

meta['Age_Group'] = pd.cut(meta['Age'], bins=age_bins, labels=age_labels)
age_group_analysis = meta.groupby('Age_Group')['Diagnosis'].apply(
    lambda x: (x == 'Malignant').sum() / len(x) * 100
).reset_index()
age_group_analysis.columns = ['age_group', 'malignancy_rate']

# Convert to list of dicts for frontend
age_malignancy_data = [
    {"age_group": row['age_group'], "malignancy_rate": float(row['malignancy_rate'])}
    for _, row in age_group_analysis.iterrows()
]

# 9. Diagnosis by Age Group, Obesity, and Diabetes
age_bins = [0, 30, 40, 50, 60, 70, 100]
age_labels = ['<30', '30-39', '40-49', '50-59', '60-69', '70+']

# Normalize column names for consistency
meta.columns = [c.strip().title() for c in meta.columns]

# Create Age Group bins
meta['Age_Group'] = pd.cut(meta['Age'], bins=age_bins, labels=age_labels, right=True)

# Ensure Yes/No are handled safely
meta['Obesity'] = meta['Obesity'].fillna('No').str.strip().str.title()
meta['Diabetes'] = meta['Diabetes'].fillna('No').str.strip().str.title()

# Convert to binary flags
meta['Obesity_Flag'] = meta['Obesity'].map({'Yes': 1, 'No': 0}).fillna(0)
meta['Diabetes_Flag'] = meta['Diabetes'].map({'Yes': 1, 'No': 0}).fillna(0)

# Group and aggregate by Age_Group
diagnosis_age_obesity_diabetes_df = (
    meta.groupby('Age_Group')
    .apply(lambda g: pd.Series({
        "benign": (g['Diagnosis'] == 'Benign').mean() * 100 if len(g) > 0 else 0,
        "malignant": (g['Diagnosis'] == 'Malignant').mean() * 100 if len(g) > 0 else 0,
        "obesity_rate": g['Obesity_Flag'].mean() * 100 if len(g) > 0 else 0,
        "diabetes_rate": g['Diabetes_Flag'].mean() * 100 if len(g) > 0 else 0
    }))
    .reset_index()
)

# Convert to JSON-ready list of dicts
diagnosis_age_obesity_diabetes = [
    {
        "age_group": str(row['Age_Group']),
        "benign": round(float(row['benign']), 1),
        "malignant": round(float(row['malignant']), 1),
        "obesity_rate": round(float(row['obesity_rate']), 1),
        "diabetes_rate": round(float(row['diabetes_rate']), 1)
    }
    for _, row in diagnosis_age_obesity_diabetes_df.iterrows()
]





# Create master analytics object
dashboard_analytics = {
    "summary": summary_dict,
    "geo_analysis": geo_data_dict,
    "gender_distribution": gender_dict,
    "country_analysis": country_dict,
    "diagnosis_analytics": diagnosis_dict,
    "nodule_size_distribution": nodule_size_dict,
    "tsh_by_gender_diagnosis": tsh_chart_data,
    "age_malignancy_rate": age_malignancy_data,
    "diagnosis_age_obesity_diabetes": diagnosis_age_obesity_diabetes,  # added 
    "generated_at": pd.Timestamp.now().isoformat()
}

# Save to JSON
with open('thyroid_analytics.json', 'w') as f:
    json.dump(dashboard_analytics, f, indent=2)

print("\nAnalytics exported to thyroid_analytics.json")
print(" Metadata exported to thyroid_metadata.json")

# Close the connection
conn.close()
