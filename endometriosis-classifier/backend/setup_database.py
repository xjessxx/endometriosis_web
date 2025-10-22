import pandas as pd
import sqlite3
import os

# Check if CSV exists
if not os.path.exists("thyroid_cancer_risk_data.csv"):
    print("Error: thyroid_cancer_risk_data.csv not found!")
    exit()

# Load CSV
df = pd.read_csv("thyroid_cancer_risk_data.csv")
print(f"Loaded {len(df)} records")

# Create SQLite database
conn = sqlite3.connect('thyroid_data.db')

# Load data into patients table
df.to_sql('patients', conn, if_exists='replace', index=False)
print("Data loaded into patients table")

