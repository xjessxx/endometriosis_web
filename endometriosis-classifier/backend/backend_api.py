from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import subprocess
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'thyroid_data.db')
ANALYTICS_SCRIPT = 'generate_analytics.py'  # Using your existing script
JSON_OUTPUT = 'thyroid_analytics.json'  # Your script outputs this file
METADATA_OUTPUT = 'thyroid_metadata.json'  # Your script also outputs this

def get_db_connection():
    """Create a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def get_next_patient_id():
    """Get the next available Patient_ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(Patient_ID) FROM patients")
    max_id = cursor.fetchone()[0]
    conn.close()
    return (max_id + 1) if max_id else 1

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Handle prediction request:
    1. Save form data to database
    2. Trigger analytics regeneration
    3. Return prediction result
    """
    try:
        # Get form data
        data = request.json
        
        # Validate required fields
        required_fields = [
            'Age', 'TSH_Level', 'T3_Level', 'T4_Level', 'Nodule_Size',
            'Gender', 'Country', 'Ethnicity', 'Family_History',
            'Radiation_Exposure', 'Iodine_Deficiency', 'Smoking',
            'Obesity', 'Diabetes'
        ]
        
        for field in required_fields:
            if field not in data or data[field] == '':
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Generate next Patient_ID
        patient_id = get_next_patient_id()
        
        # Prepare data for database insertion
        # Note: Thyroid_Cancer_Risk and Diagnosis will be determined by your model
        # For now, we'll set them to pending/unknown
        db_data = {
            'Patient_ID': patient_id,
            'Age': int(data['Age']),
            'Gender': data['Gender'],
            'Country': data['Country'],
            'Ethnicity': data['Ethnicity'],
            'Family_History': data['Family_History'],
            'Radiation_Exposure': data['Radiation_Exposure'],
            'Iodine_Deficiency': data['Iodine_Deficiency'],
            'Smoking': data['Smoking'],
            'Obesity': data['Obesity'],
            'Diabetes': data['Diabetes'],
            'TSH_Level': float(data['TSH_Level']),
            'T3_Level': float(data['T3_Level']),
            'T4_Level': float(data['T4_Level']),
            'Nodule_Size': float(data['Nodule_Size']),
            'Thyroid_Cancer_Risk': data.get('prediction', 'Pending'),
            'Diagnosis': data.get('diagnosis', 'Pending Analysis')
        }
        
        # Insert into database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO patients (
                Patient_ID, Age, Gender, Country, Ethnicity, Family_History,
                Radiation_Exposure, Iodine_Deficiency, Smoking, Obesity, Diabetes,
                TSH_Level, T3_Level, T4_Level, Nodule_Size,
                Thyroid_Cancer_Risk, Diagnosis
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            db_data['Patient_ID'], db_data['Age'], db_data['Gender'],
            db_data['Country'], db_data['Ethnicity'], db_data['Family_History'],
            db_data['Radiation_Exposure'], db_data['Iodine_Deficiency'],
            db_data['Smoking'], db_data['Obesity'], db_data['Diabetes'],
            db_data['TSH_Level'], db_data['T3_Level'], db_data['T4_Level'],
            db_data['Nodule_Size'], db_data['Thyroid_Cancer_Risk'],
            db_data['Diagnosis']
        ))
        
        conn.commit()
        conn.close()
        
        print(f"Saved patient {patient_id} to database")
        
        # Trigger analytics regeneration
        try:
            if os.path.exists(ANALYTICS_SCRIPT):
                print(f"Running {ANALYTICS_SCRIPT}...")
                result = subprocess.run(
                    ['python', ANALYTICS_SCRIPT],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    print(f"Analytics regenerated successfully")
                else:
                    print(f"Warning: Analytics script exited with code {result.returncode}")
                    print(f"stderr: {result.stderr}")
            else:
                print(f"Warning: {ANALYTICS_SCRIPT} not found, skipping analytics regeneration")
        except subprocess.TimeoutExpired:
            print("Warning: Analytics script timed out")
        except Exception as e:
            print(f" Warning: Error running analytics script: {str(e)}")
        
        # Return success response with patient ID
        return jsonify({
            "success": True,
            "message": "Data saved and analytics updated",
            "patient_id": patient_id,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """
    Serve the latest analytics JSON file (thyroid_analytics.json)
    """
    try:
        analytics_file = 'thyroid_analytics.json'
        metadata_file = 'thyroid_metadata.json'
        
        analytics_data = None
        metadata = None
        
        # Load analytics data
        if os.path.exists(analytics_file):
            with open(analytics_file, 'r') as f:
                analytics_data = json.load(f)
        
        # Load metadata (optional)
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
        
        if analytics_data:
            return jsonify({
                "success": True,
                "analytics": analytics_data,
                "metadata": metadata,
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "success": False,
                "error": "Analytics data not yet generated"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/patients', methods=['GET'])
def get_patients():
    """
    Get all patients or filter by query parameters
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Optional: Add filtering based on query parameters
        limit = request.args.get('limit', 100, type=int)
        
        cursor.execute(f"SELECT * FROM patients ORDER BY Patient_ID DESC LIMIT {limit}")
        patients = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            "success": True,
            "count": len(patients),
            "patients": patients
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Get basic database statistics
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total patients
        cursor.execute("SELECT COUNT(*) FROM patients")
        total_patients = cursor.fetchone()[0]
        
        # Risk distribution
        cursor.execute("""
            SELECT Thyroid_Cancer_Risk, COUNT(*) as count 
            FROM patients 
            GROUP BY Thyroid_Cancer_Risk
        """)
        risk_distribution = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Gender distribution
        cursor.execute("""
            SELECT Gender, COUNT(*) as count 
            FROM patients 
            GROUP BY Gender
        """)
        gender_distribution = {row[0]: row[1] for row in cursor.fetchall()}
        
        conn.close()
        
        return jsonify({
            "success": True,
            "stats": {
                "total_patients": total_patients,
                "risk_distribution": risk_distribution,
                "gender_distribution": gender_distribution
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print(" Starting Thyroid Cancer Prediction API")
    print("=" * 50)
    print(f"Database: {DB_PATH}")
    print(f"Analytics Script: {ANALYTICS_SCRIPT}")
    print(f"JSON Output: {JSON_OUTPUT}")
    print(f"Metadata Output: {METADATA_OUTPUT}")
    print("=" * 50)
    
    # Check if database exists
    if os.path.exists(DB_PATH):
        print("Database found")
    else:
        print("Warning: Database not found!")
    
    print("\nAPI Endpoints:")
    print("  - POST   /api/predict     - Submit prediction form")
    print("  - GET    /api/analytics   - Get analytics data")
    print("  - GET    /api/patients    - Get patient records")
    print("  - GET    /api/stats       - Get database statistics")
    print("  - GET    /api/health      - Health check")
    print("\nStarting server on http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
