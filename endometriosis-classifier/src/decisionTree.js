//helper file for connecting FE
let treeModel = null;
let preprocConfig = null;

export async function loadModel() {
  if (!treeModel || !preprocConfig) {
    const [modelRes, preprocRes] = await Promise.all([
      fetch('/endo_dt_model_v1.json'),
      fetch('/endo_preproc_v1.json')
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
  const probPositive = leafValues[1] / total;
  
  //const classification = probPositive > treeModel.threshold ? "POSITIVE" : "NEGATIVE";  //- our threshold from the notebook is 0 sooo
  //smth might be worng with the tree
  const classification = probPositive > 0.5 ? "POSITIVE" : "NEGATIVE";
  
  return {
    classification,
    probability: Math.round(probPositive * 100),
    confidence: probPositive >= 0.7 ? "High Risk" : probPositive >= 0.4 ? "Moderate Risk" : "Low Risk"
  };
}