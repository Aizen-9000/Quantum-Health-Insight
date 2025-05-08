const symptomsList = [ "nausea", "vomiting", "fever", "cough", "headache", "fatigue", "dizziness", "abdominal pain", "chest pain", "shortness of breath", "frequent urination", "burning sensation", "loss of appetite" ];

const symptomSelect = new Choices('#symptoms', { removeItemButton: true, choices: symptomsList.map(symptom => ({ value: symptom, label: symptom })) });

const predictBtn = document.getElementById("predictBtn"); predictBtn.addEventListener("click", predictHealthRisk);

function predictHealthRisk() { const age = parseInt(document.getElementById("age").value); const gender = document.getElementById("gender").value; const height = parseFloat(document.getElementById("height").value); const weight = parseFloat(document.getElementById("weight").value); const systolic = parseInt(document.getElementById("systolic").value); const diastolic = parseInt(document.getElementById("diastolic").value); const cholesterol = parseInt(document.getElementById("cholesterol").value); const sugar = parseInt(document.getElementById("sugar").value); const habits = document.getElementById("habits").value; const history = document.getElementById("history").value;

const selectedSymptoms = symptomSelect.getValue(true);

// Collect severities 
const symptomSeverities = {}; selectedSymptoms.forEach(symptom => { const severityInput = document.querySelector(`input[name="severity-${symptom}"]`); if (severityInput) { symptomSeverities[symptom] = parseInt(severityInput.value); } });

const riskScore = calculateRiskScore(age, gender, height, weight, systolic, diastolic, cholesterol, sugar, habits, history);

let summary = `Your calculated health risk score is ${riskScore}.`; if (riskScore > 80) { summary += " High risk. Please consult a doctor immediately."; } else if (riskScore > 50) { summary += " Moderate risk. Monitor health regularly."; } else { summary += " Low risk. Maintain healthy habits."; } document.getElementById("summaryText").innerText = summary;

const possibleDiseases = getDiseasesFromSymptoms(selectedSymptoms, symptomSeverities, gender, age);

const diseaseSection = document.getElementById("diseaseSuggestions"); if (possibleDiseases.length > 0) { diseaseSection.innerHTML = `<strong>Possible Diseases:</strong> <br> ${possibleDiseases.join(", ")}`; } else { diseaseSection.innerHTML = "<strong>Possible Diseases:</strong> Not enough data to suggest."; }

const recommendedTests = suggestMedicalTests(possibleDiseases, symptomSeverities); const testSection = document.getElementById("testSuggestions"); if (recommendedTests.length > 0) { testSection.innerHTML = `<strong>Recommended Medical Tests:</strong> <br> ${recommendedTests.join(", ")}`; } else { testSection.innerHTML = "<strong>Recommended Medical Tests:</strong> No suggestions at the moment."; }

showRiskChart(riskScore); }

function calculateRiskScore(age, gender, height, weight, systolic, diastolic, cholesterol, sugar, habits, history) { let bmi = weight / (height * height); let risk = bmi + systolic + diastolic + cholesterol / 5 + sugar / 10; if (habits === "yes") risk += 15; if (history === "yes") risk += 10; if (age > 45) risk += 10; return Math.min(100, Math.round(risk)); }

function getDiseasesFromSymptoms(symptoms, severities, gender, age) { const diseases = [];

if (symptoms.includes("nausea") && symptoms.includes("vomiting")) { if (severities["nausea"] >= 5 && severities["vomiting"] >= 6) { if (gender === "female" && age >= 14 && age <= 50) { diseases.push("Pregnancy"); } diseases.push("Food Poisoning", "Gastritis", "Gastroenteritis"); } } if (symptoms.includes("frequent urination") && symptoms.includes("burning sensation")) { diseases.push("Urinary Tract Infection (UTI)"); } if (symptoms.includes("dizziness") && symptoms.includes("fatigue")) { diseases.push("Diabetes"); } if (gender === "male" && symptoms.includes("frequent urination")) { diseases.push("Prostate Issues"); } return [...new Set(diseases)]; }

function suggestMedicalTests(diseases, severities) { const testMap = { "Pregnancy": "Urine Pregnancy Test", "Food Poisoning": "Stool Test", "Gastritis": "Endoscopy", "Gastroenteritis": "Stool Test", "Diabetes": "Fasting Blood Sugar Test", "Urinary Tract Infection (UTI)": "Urine Culture", "Prostate Issues": "PSA Test" }; const recommended = []; diseases.forEach(disease => { if (testMap[disease]) recommended.push(testMap[disease]); }); return recommended; }

function showRiskChart(score) { const ctx = document.getElementById("riskChart").getContext("2d"); new Chart(ctx, { type: 'bar', data: { labels: ['Your Risk Score'], datasets: [{ label: 'Health Risk', data: [score], backgroundColor: score > 80 ? 'red' : score > 50 ? 'orange' : 'green' }] }, options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } } }); }

window.updateSliderColor = function(slider) {
    const value = parseInt(slider.value);
    const color = value < 4 ? '#4CAF50' : value < 7 ? '#FFC107' : '#F44336'; // green, yellow, red
    slider.style.background = color;
    slider.nextElementSibling.textContent = value;
  };

  // Add dynamic severity inputs based on selected symptoms 
document.getElementById("symptoms").addEventListener("change", () => {
    const selected = symptomSelect.getValue(true);
    const container = document.getElementById("severityContainer");
    container.innerHTML = "";
    selected.forEach(symptom => {
      const label = document.createElement("label");
      label.innerHTML = `
        ${symptom} Severity:
        <input type="range" name="severity-${symptom}" min="0" max="10" value="5" class="severity-slider" oninput="updateSliderColor(this)">
        <span class="slider-value">5</span>
      `;
      container.appendChild(label);
    });
  });