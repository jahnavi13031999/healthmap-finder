export interface HealthCondition {
  value: string;
  label: string;
}

export const HEALTH_CONDITIONS: HealthCondition[] = [
  { value: "heart_attack", label: "Heart Attack" },
  { value: "stroke", label: "Stroke" },
  { value: "pneumonia", label: "Pneumonia" },
  { value: "copd", label: "COPD" },
  { value: "heart_failure", label: "Heart Failure" },
  { value: "hip_knee", label: "Hip/Knee Replacement" },
  { value: "cabg", label: "CABG Surgery" },
  { value: "pressure_ulcer", label: "Pressure Ulcer" },
  { value: "complications", label: "Surgical Complications" },
  { value: "pneumothorax", label: "Iatrogenic Pneumothorax" },
  { value: "fall_fracture", label: "Fall-Associated Fracture" },
  { value: "hemorrhage", label: "Postoperative Hemorrhage" },
  { value: "kidney_injury", label: "Acute Kidney Injury" },
  { value: "respiratory", label: "Respiratory Failure" },
  { value: "blood_clot", label: "Blood Clot" },
  { value: "sepsis", label: "Sepsis" },
  { value: "wound", label: "Wound Complications" },
  { value: "puncture", label: "Accidental Puncture" },
  { value: "safety", label: "Patient Safety Issues" }
];