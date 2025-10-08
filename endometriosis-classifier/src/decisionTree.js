//helper file for connecting FE
let treeModel = null;
let preprocConfig = null;

export async function loadModel() {
  if (!treeModel || !preprocConfig) {
    const [modelRes, preprocRes] = await Promise.all([
      fetch('/thyroid_dt_model_v1.json'),  
      fetch('/thyroid_preproc_v1.json')
    ]);
    
    treeModel = await modelRes.json();
    preprocConfig = await preprocRes.json();
  }
  
  return { treeModel, preprocConfig };
}

//numeric data
export function preprocessInput(formData, preprocConfig) {
  const features = [];

  for (const col of preprocConfig.numeric) {
    const value = parseFloat(formData[col]) || preprocConfig.numeric_imputation[col];
    features.push(value);
  }

  //categorical data
  for (const col of preprocConfig.categorical) {
    const userValue = formData[col];
    const vocab = preprocConfig.categorical_vocabulary[col];
    
    for (const category of vocab) {
      features.push(userValue == category ? 1.0 : 0.0);
    }
  }
  
  return features;
}

export function predict(features, treeModel) {
  const tree = treeModel.tree.nodes;
  let nodeIdx = 0;

  // Traverse the tree
  while (!tree[nodeIdx].is_leaf) {
    const node = tree[nodeIdx];
    const featureValue = features[node.feature_index];
    
    if (featureValue <= node.threshold) {
      nodeIdx = node.left;
    } else {
      nodeIdx = node.right;
    }
  }

  // Get probability from leaf node
  const leafValues = tree[nodeIdx].value;
  const total = leafValues[0] + leafValues[1];
  const probMalignant = leafValues[1] / total;
  

  const classification = probMalignant >= treeModel.threshold ? "MALIGNANT" : "BENIGN";
  
  return {
    classification,
    probability: Math.round(probMalignant * 100),
    confidence: probMalignant >= 0.7 ? "High Risk" : probMalignant >= 0.4 ? "Moderate Risk" : "Low Risk"
  };
}