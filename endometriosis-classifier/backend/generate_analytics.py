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

# Create master analytics object
dashboard_analytics = {
    "summary": summary_dict,
    "geo_analysis": geo_data_dict,
    "gender_distribution": gender_dict,
    "country_analysis": country_dict,
    "diagnosis_analytics": diagnosis_dict,
    "nodule_size_distribution": nodule_size_dict,
    "generated_at": pd.Timestamp.now().isoformat()
}

# Save to JSON
with open('thyroid_analytics.json', 'w') as f:
    json.dump(dashboard_analytics, f, indent=2)

print("\nAnalytics exported to thyroid_analytics.json")
print(" Metadata exported to thyroid_metadata.json")

# Close the connection
conn.close()
