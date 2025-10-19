# ML API for Fraud Detection

## How to run locally

1. Install Python 3.8+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Train and export your model as `model.joblib` (see below for a dummy example)
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
5. The API will be available at http://localhost:8000/predict

## Model file
- Place your trained model as `model.joblib` in this folder.
- If no model is present, the API will return random predictions for testing.

## Example request
```json
{
  "transactions": [
    {"transaction_amount": 1200, "account_age_days": 10},
    {"transaction_amount": 5000, "account_age_days": 365}
  ]
}
```

## Example curl
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"transactions":[{"transaction_amount":1200,"account_age_days":10}]}'
```

## Dummy model training (optional)
```python
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np
X = np.random.rand(100, 2) * 10000
Y = (X[:,0] > 5000).astype(int)
model = RandomForestClassifier().fit(X, Y)
joblib.dump(model, "model.joblib")
```
