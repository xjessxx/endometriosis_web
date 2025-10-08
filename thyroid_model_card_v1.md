# Thyroid Cancer Diagnosis Model Card

**Model version:** v1  
**Training date:** 2025-10-08  
**Target:** Malignant vs Benign diagnosis

### Best Params
{'dt__max_depth': 5, 'dt__min_samples_leaf': 10}

### Metrics (Test Set)
{
  "roc_auc": 0.7031869940937785,
  "pr_auc": 0.48763205443403657,
  "precision": 0.2719476645651142,
  "recall": 0.8104859076674411,
  "f1": 0.4072485469911931,
  "specificity": 0.3419424019607843,
  "confusion_matrix": {
    "tn": 11161,
    "fp": 21479,
    "fn": 1876,
    "tp": 8023
  }
}

### Notes
Educational demo only — not medical advice.
