
import os
import django
import requests
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Employee

print(f"Checking Database...")
count = Employee.objects.count()
print(f"Employee count in DB: {count}")

if count > 0:
    print("First 3 employees:")
    for emp in Employee.objects.all()[:3]:
        print(f" - {emp.name} ({emp.email})")

print("\nChecking API...")
try:
    response = requests.get('http://127.0.0.1:8000/api/employees/')
    if response.status_code == 200:
        data = response.json()
        print(f"API returned {len(data)} employees")
        if len(data) > 0:
            print("First employee from API:", data[0])
    else:
        print(f"API failed with status {response.status_code}")
except Exception as e:
    print(f"API connection failed: {e}")
