import pandas as pd
import os

file_path = "List of infectious diseases.xlsx"

if not os.path.exists(file_path):
    print(f"Error: File '{file_path}' not found.")
    exit(1)

try:
    df = pd.read_excel(file_path)
    print("Shape:", df.shape)
    print("\nColumns:")
    for col in df.columns:
        print(f" - {col}")
    
    print("\nFirst row sample:")
    print(df.iloc[0].to_dict())
except Exception as e:
    print(f"Error reading Excel: {e}")
