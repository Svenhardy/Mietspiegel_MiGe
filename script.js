

// Basismiete-Tabelle (Wohnfläche in m² -> €/m²)
const baseRentTable = {
    20: 7.68, 21: 7.63, 22: 7.59, 23: 7.54, 24: 7.50, 25: 7.45,
    26: 7.41, 27: 7.37, 28: 7.33, 29: 7.29, 30: 7.25, 31: 7.22,
    32: 7.18, 33: 7.15, 34: 7.11, 35: 7.08, 36: 7.05, 37: 7.01,
    38: 6.98, 39: 6.95, 40: 6.93, 41: 6.90, 42: 6.87, 43: 6.84,
    44: 6.82, 45: 6.79, 46: 6.77, 47: 6.75, 48: 6.72, 49: 6.70,
    50: 6.68, 51: 6.66, 52: 6.64, 53: 6.62, 54: 6.60, 55: 6.59,
    56: 6.57, 57: 6.55, 58: 6.54, 59: 6.52, 60: 6.51, 61: 6.49,
    62: 6.48, 63: 6.47, 64: 6.45, 65: 6.44, 66: 6.43, 67: 6.42,
    68: 6.41, 69: 6.40, 70: 6.39, 71: 6.38, 72: 6.38, 73: 6.37,
    74: 6.36, 75: 6.35, 76: 6.35, 77: 6.34, 78: 6.33, 79: 6.33,
    80: 6.32, 81: 6.32, 82: 6.32, 83: 6.31, 84: 6.31, 85: 6.30,
    86: 6.30, 87: 6.30, 88: 6.30, 89: 6.29, 90: 6.29, 91: 6.29,
    92: 6.29, 93: 6.29, 94: 6.28, 95: 6.28, 96: 6.28, 97: 6.28,
    98: 6.28, 99: 6.28, 100: 6.28, 101: 6.28, 102: 6.28, 103: 6.28,
    104: 6.28, 105: 6.28, 106: 6.28, 107: 6.28, 108: 6.28, 109: 6.28,
    110: 6.28, 111: 6.28, 112: 6.28, 113: 6.28, 114: 6.28, 115: 6.28,
    116: 6.28, 117: 6.28, 118: 6.28, 119: 6.28, 120: 6.28, 121: 6.28,
    122: 6.28, 123: 6.27, 124: 6.27, 125: 6.27, 126: 6.27, 127: 6.27,
    128: 6.26, 129: 6.26, 130: 6.26, 131: 6.26, 132: 6.25, 133: 6.25,
    134: 6.25, 135: 6.24, 136: 6.24, 137: 6.23, 138: 6.23, 139: 6.22,
    140: 6.22, 141: 6.21, 142: 6.20, 143: 6.20, 144: 6.19, 145: 6.18,
    146: 6.17, 147: 6.16, 148: 6.15, 149: 6.14, 150: 6.13
};

// Baujahr-Zuschläge
const constructionYearAdjustments = {
    "bis-1918": 0.63,
    "1919-1945": 0.53,
    "1946-1959": 0.31,
    "1960-1990": 0.00,
    "1991-2009": 0.96,
    "2010-2015": 1.69,
    "2016-2020": 2.64,
    "2021-2022": 3.82
};

// Ausstattungs-Zuschläge
const equipmentAdjustments = {
    "maisonette": 0.31,
    "towelRadiator": 0.13,
    "floorHeating": 0.71,
    "showerAndBath": 0.17,
    "fittedKitchen": 0.51,
    "highQualityFloor": 0.13,
    "storageRoom": 0.13,
    "elevator": 0.38,
    "garden": 0.31,
    "noBalcony": -0.18
};

// Modernisierungs-Zuschläge
const modernizationAdjustments = {
    0: 0.00,
    1: 0.07,
    2: 0.14,
    3: 0.21,
    4: 0.28
};

// Energetische Maßnahmen-Zuschläge
const energyMeasuresAdjustments = {
    0: 0.00,
    1: 0.14,
    2: 0.28,
    3: 0.42,
    4: 0.56,
    5: 0.70
};

// Spannenwerte
const spanLower = -0.83;
const spanUpper = 0.76;

// Maximale und minimale Zuschläge für Unsicherheitsberechnung
const maxAdjustments = {
    constructionYear: Math.max(...Object.values(constructionYearAdjustments)),
    maisonette: equipmentAdjustments.maisonette,
    towelRadiator: equipmentAdjustments.towelRadiator,
    floorHeating: equipmentAdjustments.floorHeating,
    showerAndBath: equipmentAdjustments.showerAndBath,
    fittedKitchen: equipmentAdjustments.fittedKitchen,
    highQualityFloor: equipmentAdjustments.highQualityFloor,
    storageRoom: equipmentAdjustments.storageRoom,
    elevator: equipmentAdjustments.elevator,
    garden: equipmentAdjustments.garden,
    noBalcony: Math.abs(equipmentAdjustments.noBalcony),
    modernizations: Math.max(...Object.values(modernizationAdjustments)),
    energyMeasures: Math.max(...Object.values(energyMeasuresAdjustments))
};

// Globale Variablen für Unsicherheitsstatus
let uncertaintyStatus = {
    constructionYear: false,
    maisonette: false,
    towelRadiator: false,
    floorHeating: false,
    showerAndBath: false,
    fittedKitchen: false,
    highQualityFloor: false,
    storageRoom: false,
    elevator: false,
    garden: false,
    noBalcony: false,
    modernizations: false,
    energyMeasures: false
};

// Autovervollständigung für Straßennamen
const streetInput = document.getElementById('streetInput');
const autocompleteList = document.getElementById('autocomplete-list');
let selectedStreet = null;

// Tab-Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Tab-Wechsel-Funktionalität
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Entferne aktive Klasse von allen Tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Füge aktive Klasse zum ausgewählten Tab hinzu
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Event-Listener für Unsicherheits-Checkboxen
    document.querySelectorAll('.uncertainty-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.closest('.uncertainty-toggle').dataset.category;
            uncertaintyStatus[category] = this.checked;
        });
    });
    
    // Initialisiere Slider
    modernizationsSlider = initializeSlider('modernizationsTrack', 'modernizationsThumb', 'modernizationsDisplay', modernizationAdjustments, 4);
    energyMeasuresSlider = initializeSlider('energyMeasuresTrack', 'energyMeasuresThumb', 'energyMeasuresDisplay', energyMeasuresAdjustments, 5);
    
    // Initiale Anzeigen aktualisieren
    updateBaseRentDisplay();
    updateConstructionYearDisplay();
    updateLocationDisplay();
});

// Straßenname automatisch extrahieren
streetInput.addEventListener('input', function() {
    const streetNameField = document.getElementById('streetName');
    const input = this.value;
    
    // Extrahiere nur Buchstaben, Leerzeichen und Punkte (keine Zahlen)
    const streetNameOnly = input.replace(/[0-9\-–—]/g, '').trim();
    streetNameField.value = streetNameOnly;
    
    // Autovervollständigung
    updateAutocomplete(input);
});

function updateAutocomplete(input) {
    autocompleteList.innerHTML = '';
    
    if (input.length < 2) {
        return;
    }
    
    // Filtere die Straßen basierend auf der Eingabe
    const filteredStreets = streets.filter(street => 
        street.name.toLowerCase().includes(input.toLowerCase())
    );
    
    // Begrenze die Anzahl der angezeigten Ergebnisse
    const displayStreets = filteredStreets.slice(0, 10);
    
    displayStreets.forEach(street => {
        const item = document.createElement('div');
        item.textContent = street.name;
        item.addEventListener('click', function() {
            streetInput.value = street.name;
            const streetNameOnly = street.name.replace(/[0-9\-–—]/g, '').trim();
            document.getElementById('streetName').value = streetNameOnly;
            selectedStreet = street;
            autocompleteList.innerHTML = '';
            updateLocationDisplay();
        });
        autocompleteList.appendChild(item);
    });
}

// Schließe die Autovervollständigung, wenn außerhalb geklickt wird
document.addEventListener('click', function(e) {
    if (e.target !== streetInput) {
        autocompleteList.innerHTML = '';
    }
});

// Slider-Funktionalität
function initializeSlider(sliderId, thumbId, displayId, adjustments, maxValue) {
    const track = document.getElementById(sliderId);
    const thumb = document.getElementById(thumbId);
    const display = document.getElementById(displayId);
    const ticks = track.parentElement.querySelectorAll('.slider-tick');
    
    let isDragging = false;
    let currentValue = 0;
    
    function updateSlider(value) {
        currentValue = value;
        const percentage = (value / maxValue) * 100;
        thumb.style.left = percentage + '%';
        
        // Aktiviere den entsprechenden Tick
        ticks.forEach(tick => {
            if (parseInt(tick.dataset.value) === value) {
                tick.classList.add('active');
            } else {
                tick.classList.remove('active');
            }
        });
        
        // Update die Anzeige
        const adjustment = adjustments[value];
        display.textContent = adjustment > 0 ? '+' + adjustment.toFixed(2) + ' €' : adjustment.toFixed(2) + ' €';
        display.className = adjustment > 0 ? 'value-display value-positive' : 'value-display value-neutral';
        
        return value;
    }
    
    // Klick auf Track
    track.addEventListener('click', function(e) {
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const value = Math.round(percentage * maxValue);
        updateSlider(value);
    });
    
    // Klick auf Ticks
    ticks.forEach(tick => {
        tick.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            updateSlider(value);
        });
    });
    
    // Drag-Funktionalität für Thumb
    thumb.addEventListener('mousedown', function(e) {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    function onMouseMove(e) {
        if (!isDragging) return;
        
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const value = Math.round(percentage * maxValue);
        updateSlider(value);
    }
    
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    // Touch-Events für Mobile
    thumb.addEventListener('touchstart', function(e) {
        isDragging = true;
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    });
    
    function onTouchMove(e) {
        if (!isDragging) return;
        
        const rect = track.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, touchX / rect.width));
        const value = Math.round(percentage * maxValue);
        updateSlider(value);
    }
    
    function onTouchEnd() {
        isDragging = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }
    
    // Getter für aktuellen Wert
    function getCurrentValue() {
        return currentValue;
    }
    
    // Initialisiere mit Wert 0
    updateSlider(0);
    
    return { updateSlider, getCurrentValue };
}

// Event-Listener für Eingabefelder
document.getElementById('area').addEventListener('input', updateBaseRentDisplay);
document.getElementById('constructionYear').addEventListener('change', updateConstructionYearDisplay);

// Event-Listener für Ausstattungs-Checkboxen
const equipmentCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
equipmentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const displayId = this.id + 'Display';
        const displayElement = document.getElementById(displayId);
        const adjustment = equipmentAdjustments[this.id];
        
        if (this.checked) {
            const adjustmentSign = adjustment > 0 ? '+' : '';
            displayElement.textContent = adjustmentSign + adjustment.toFixed(2) + ' €';
            displayElement.className = adjustment > 0 ? 'value-display value-positive' : 
                                      (adjustment < 0 ? 'value-display value-negative' : 'value-display value-neutral');
        } else {
            displayElement.textContent = '-';
            displayElement.className = 'value-display value-neutral';
        }
    });
});

document.getElementById('calculateBtn').addEventListener('click', calculateRent);
document.getElementById('showIntermediateFromResults').addEventListener('click', showIntermediateResults);
document.getElementById('shareBtn').addEventListener('click', shareData);

// Funktionen zur Aktualisierung der Anzeigen
function updateBaseRentDisplay() {
    const area = parseInt(document.getElementById('area').value);
    const displayElement = document.getElementById('baseRentDisplay');
    
    if (area && area >= 20 && area <= 150) {
        const baseRent = baseRentTable[area];
        displayElement.textContent = baseRent.toFixed(2) + ' €/m²';
        displayElement.className = 'value-display value-neutral';
    } else {
        displayElement.textContent = '-';
        displayElement.className = 'value-display value-neutral';
    }
}

function updateConstructionYearDisplay() {
    const constructionYear = document.getElementById('constructionYear').value;
    const displayElement = document.getElementById('constructionYearDisplay');
    
    if (constructionYear) {
        const adjustment = constructionYearAdjustments[constructionYear];
        const adjustmentSign = adjustment > 0 ? '+' : '';
        displayElement.textContent = adjustmentSign + adjustment.toFixed(2) + ' €';
        displayElement.className = adjustment > 0 ? 'value-display value-positive' : 
                                  (adjustment < 0 ? 'value-display value-negative' : 'value-display value-neutral');
    } else {
        displayElement.textContent = '-';
        displayElement.className = 'value-display value-neutral';
    }
}

function updateLocationDisplay() {
    const displayElement = document.getElementById('locationDisplay');
    
    if (selectedStreet) {
        const adjustment = selectedStreet.adjustment;
        const adjustmentSign = adjustment > 0 ? '+' : '';
        displayElement.textContent = adjustmentSign + adjustment.toFixed(2) + ' €';
        displayElement.className = adjustment > 0 ? 'value-display value-positive' : 
                                  (adjustment < 0 ? 'value-display value-negative' : 'value-display value-neutral');
    } else {
        displayElement.textContent = '-';
        displayElement.className = 'value-display value-neutral';
    }
}

// Hauptberechnungsfunktion
function calculateRent() {
    // Eingaben auslesen
    const area = parseInt(document.getElementById('area').value);
    const constructionYear = document.getElementById('constructionYear').value;
    const currentRent = parseFloat(document.getElementById('currentRent').value) || 0;
    
    // Validierung
    if (!area || area < 20 || area > 150) {
        alert('Bitte geben Sie eine gültige Wohnfläche zwischen 20 und 150 m² ein.');
        return;
    }
    
    if (!constructionYear) {
        alert('Bitte wählen Sie das Baujahr aus.');
        return;
    }
    
    // Basismiete berechnen (immer gleich)
    const baseRent = baseRentTable[area];
    
    // Berechnungen für alle drei Szenarien
    const standardResult = calculateScenario('standard', area, constructionYear, currentRent);
    const optimisticResult = calculateScenario('optimistic', area, constructionYear, currentRent);
    const pessimisticResult = calculateScenario('pessimistic', area, constructionYear, currentRent);
    
    // Ergebnisse anzeigen
    displayResults(standardResult, optimisticResult, pessimisticResult, currentRent);
    
    // Zwischenergebnisse speichern und anzeigen
    saveIntermediateResults(standardResult, optimisticResult, pessimisticResult, currentRent);
    
    // Spanne-Balken aktualisieren
    updateRangeBar(standardResult.lowerSpan, standardResult.upperSpan, currentRent);
    
    // Spannen-Labels aktualisieren
    document.getElementById('lowerSpanLabel').textContent = standardResult.lowerSpan.toFixed(0) + ' €';
    document.getElementById('upperSpanLabel').textContent = standardResult.upperSpan.toFixed(0) + ' €';
    document.getElementById('lowerSpanEndLabel').textContent = standardResult.lowerSpan.toFixed(0) + ' €';
    document.getElementById('upperSpanEndLabel').textContent = standardResult.upperSpan.toFixed(0) + ' €';
    
    // Zum Ergebnis-Tab wechseln
    switchToTab('results');
}

function calculateScenario(scenario, area, constructionYear, currentRent) {
    let adjustments = 0;
    
    // Baujahr-Zuschlag
    if (scenario === 'optimistic' && uncertaintyStatus.constructionYear) {
        adjustments += 0; // Minimaler Zuschlag
    } else if (scenario === 'pessimistic' && uncertaintyStatus.constructionYear) {
        adjustments += maxAdjustments.constructionYear; // Maximaler Zuschlag
    } else {
        adjustments += constructionYearAdjustments[constructionYear] || 0;
    }
    
    // Wohnlage-Zuschlag (immer gleich, da keine Unsicherheit)
    let locationAdjustment = 0;
    if (selectedStreet) {
        locationAdjustment = selectedStreet.adjustment;
    }
    adjustments += locationAdjustment;
    
    // Ausstattungs-Zuschläge
    for (const [key, value] of Object.entries(equipmentAdjustments)) {
        const isChecked = document.getElementById(key).checked;
        const isUncertain = uncertaintyStatus[key];
        
        if (scenario === 'optimistic' && isUncertain) {
            // Im optimistischen Szenario: nur positive Zuschläge bei Unsicherheit ignorieren
            if (value > 0) {
                // Positive Zuschläge ignorieren
            } else if (value < 0) {
                // Negative Zuschläge beibehalten (günstiger für Mieter)
                adjustments += value;
            }
        } else if (scenario === 'pessimistic' && isUncertain) {
            // Im pessimistischen Szenario: maximale positive Zuschläge annehmen
            if (value > 0) {
                adjustments += maxAdjustments[key];
            } else if (value < 0) {
                // Negative Zuschläge ignorieren (ungünstiger für Mieter)
            }
        } else {
            // Standard-Szenario oder keine Unsicherheit: tatsächlichen Wert verwenden
            if (isChecked) {
                adjustments += value;
            }
        }
    }
    
    // Modernisierungs-Zuschlag
    const modernizationsValue = modernizationsSlider.getCurrentValue();
    if (scenario === 'optimistic' && uncertaintyStatus.modernizations) {
        adjustments += 0; // Minimaler Zuschlag
    } else if (scenario === 'pessimistic' && uncertaintyStatus.modernizations) {
        adjustments += maxAdjustments.modernizations; // Maximaler Zuschlag
    } else {
        adjustments += modernizationAdjustments[modernizationsValue] || 0;
    }
    
    // Energetische Maßnahmen-Zuschlag
    const energyMeasuresValue = energyMeasuresSlider.getCurrentValue();
    if (scenario === 'optimistic' && uncertaintyStatus.energyMeasures) {
        adjustments += 0; // Minimaler Zuschlag
    } else if (scenario === 'pessimistic' && uncertaintyStatus.energyMeasures) {
        adjustments += maxAdjustments.energyMeasures; // Maximaler Zuschlag
    } else {
        adjustments += energyMeasuresAdjustments[energyMeasuresValue] || 0;
    }
    
    // Durchschnittliche Vergleichsmiete pro m²
    const avgRentPerSqm = baseRentTable[area] + adjustments;
    
    // Spannenwerte pro m²
    const lowerLimitPerSqm = avgRentPerSqm + spanLower;
    const upperLimitPerSqm = avgRentPerSqm + spanUpper;
    
    // Monatliche Vergleichsmiete
    const monthlyRent = avgRentPerSqm * area;
    const lowerSpan = lowerLimitPerSqm * area;
    const upperSpan = upperLimitPerSqm * area;
    
    return {
        baseRent: baseRentTable[area],
        adjustments,
        avgRentPerSqm,
        lowerLimitPerSqm,
        upperLimitPerSqm,
        monthlyRent,
        lowerSpan,
        upperSpan
    };
}

function displayResults(standard, optimistic, pessimistic, currentRent) {
    // Aktuelle Miete und Differenzen
    document.getElementById('currentRentResult').textContent = currentRent.toFixed(2) + ' €';
    
    const standardDifference = currentRent - standard.monthlyRent;
    const optimisticDifference = currentRent - optimistic.monthlyRent;
    const pessimisticDifference = currentRent - pessimistic.monthlyRent;
    
    document.getElementById('differenceResult').textContent = standardDifference.toFixed(2) + ' €';
    document.getElementById('differenceOptimisticResult').textContent = optimisticDifference.toFixed(2) + ' €';
    document.getElementById('differencePessimisticResult').textContent = pessimisticDifference.toFixed(2) + ' €';
    
    // Differenz-Text
    const differenceText = document.getElementById('differenceText');
    if (standardDifference > 0) {
        differenceText.textContent = `Ihre Miete liegt ${standardDifference.toFixed(2)} € über der durchschnittlichen Vergleichsmiete`;
        differenceText.className = 'difference negative';
    } else if (standardDifference < 0) {
        differenceText.textContent = `Ihre Miete liegt ${Math.abs(standardDifference).toFixed(2)} € unter der durchschnittlichen Vergleichsmiete`;
        differenceText.className = 'difference positive';
    } else {
        differenceText.textContent = 'Ihre Miete entspricht der durchschnittlichen Vergleichsmiete';
        differenceText.className = 'difference';
    }
}

function saveIntermediateResults(standard, optimistic, pessimistic, currentRent) {
    const results = {
        standard,
        optimistic,
        pessimistic,
        currentRent,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('intermediateResults', JSON.stringify(results));
    displayIntermediateResults(results);
}

function displayIntermediateResults(results) {
    const { standard, optimistic, pessimistic, currentRent } = results;
    const intermediateContent = document.getElementById('intermediate-content');
    
    intermediateContent.innerHTML = `
        <div class="result-columns">
            <div class="result-column">
                <div class="column-header">
                    <span>Angabe</span>
                    <span class="info-icon">?
                        <span class="tooltip">Ergebnis für die konkreten Eingaben</span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Basismiete (€/m²):</span>
                    <span class="result-value">${standard.baseRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Summe Zu-/Abschläge (€/m²):</span>
                    <span class="result-value">${standard.adjustments.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Durchschnittliche Vergleichsmiete (€/m²):</span>
                    <span class="result-value">${standard.avgRentPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Grenze (€/m²):</span>
                    <span class="result-value">${standard.lowerLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Grenze (€/m²):</span>
                    <span class="result-value">${standard.upperLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monatliche Vergleichsmiete (€):</span>
                    <span class="result-value">${standard.monthlyRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Spanne (€):</span>
                    <span class="result-value">${standard.lowerSpan.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Spanne (€):</span>
                    <span class="result-value">${standard.upperSpan.toFixed(2)} €</span>
                </div>
            </div>
            
            <div class="result-column">
                <div class="column-header">
                    <span>Optimistisch</span>
                    <span class="info-icon">?
                        <span class="tooltip">Ergebnis unter Einbeziehung der Unsicherheit zu Gunsten des Mieters</span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Basismiete (€/m²):</span>
                    <span class="result-value optimistic-bg">${optimistic.baseRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Summe Zu-/Abschläge (€/m²):</span>
                    <span class="result-value optimistic-bg">${optimistic.adjustments.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Durchschnittliche Vergleichsmiete (€/m²):</span>
                    <span class="result-value optimistic-bg">${optimistic.avgRentPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Grenze (€/m²):</span>
                    <span class="result-value optimistic-bg">${optimistic.lowerLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Grenze (€/m²):</span>
                    <span class="result-value optimistic-bg">${optimistic.upperLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monatliche Vergleichsmiete (€):</span>
                    <span class="result-value optimistic-bg">${optimistic.monthlyRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Spanne (€):</span>
                    <span class="result-value optimistic-bg">${optimistic.lowerSpan.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Spanne (€):</span>
                    <span class="result-value optimistic-bg">${optimistic.upperSpan.toFixed(2)} €</span>
                </div>
            </div>
            
            <div class="result-column">
                <div class="column-header">
                    <span>Pessimistisch</span>
                    <span class="info-icon">?
                        <span class="tooltip">Ergebnis unter Einbeziehung der Unsicherheit zu Ungunsten des Mieters</span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Basismiete (€/m²):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.baseRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Summe Zu-/Abschläge (€/m²):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.adjustments.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Durchschnittliche Vergleichsmiete (€/m²):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.avgRentPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Grenze (€/m²):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.lowerLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Grenze (€/m²):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.upperLimitPerSqm.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Monatliche Vergleichsmiete (€):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.monthlyRent.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Untere Spanne (€):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.lowerSpan.toFixed(2)} €</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Obere Spanne (€):</span>
                    <span class="result-value pessimistic-bg">${pessimistic.upperSpan.toFixed(2)} €</span>
                </div>
            </div>
        </div>
    `;
}

function showIntermediateResults() {
    switchToTab('intermediate');
}

function switchToTab(tabId) {
    // Entferne aktive Klasse von allen Tabs
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Füge aktive Klasse zum ausgewählten Tab hinzu
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function updateRangeBar(lowerSpan, upperSpan, currentRent) {
    const rangeBar = document.getElementById('rangeIndicator');
    const currentRentMarker = document.getElementById('currentRentMarker');
    const rangeBarWidth = document.querySelector('.range-bar').offsetWidth;
    
    // Bereich für die Spanne definieren (mit etwas Puffer)
    const minValue = Math.min(lowerSpan, currentRent) * 0.9;
    const maxValue = Math.max(upperSpan, currentRent) * 1.1;
    const valueRange = maxValue - minValue;
    
    // Position der Spanne berechnen
    const lowerPosition = ((lowerSpan - minValue) / valueRange) * 100;
    const upperPosition = ((upperSpan - minValue) / valueRange) * 100;
    const currentPosition = ((currentRent - minValue) / valueRange) * 100;
    
    // Balken und Marker positionieren
    rangeBar.style.left = lowerPosition + '%';
    rangeBar.style.width = (upperPosition - lowerPosition) + '%';
    
    currentRentMarker.style.left = currentPosition + '%';
    
    // Marker-Sichtbarkeit anpassen
    if (currentRent > 0) {
        currentRentMarker.style.display = 'block';
    } else {
        currentRentMarker.style.display = 'none';
    }
}

async function shareData() {
    // Validierung: Prüfen ob eine Berechnung durchgeführt wurde
    const results = localStorage.getItem('intermediateResults');
    if (!results) {
        alert('Bitte führen Sie zuerst eine Berechnung durch, bevor Sie Daten teilen.');
        return;
    }
    
    const parsedResults = JSON.parse(results);
    
    // Eingabewerte sammeln
    const landlordName = document.getElementById('landlordName').value;
    const managementName = document.getElementById('managementName').value;
    const streetName = document.getElementById('streetName').value;
    const houseNumber = document.getElementById('houseNumber').value;
    
    // Validierung: Mindestens Straße muss ausgefüllt sein
    if (!streetName) {
        alert('Bitte geben Sie mindestens den Straßennamen an.');
        return;
    }
    
// Daten für Google Sheet vorbereiten
    const currentRent = parseFloat(document.getElementById('currentRent').value);
    
    const data = {
        streetName: streetName,
        houseNumber: houseNumber,
        landlordName: landlordName,
        managementName: managementName,
        area: document.getElementById('area').value,
        constructionYear: document.getElementById('constructionYear').value,
        currentRent: currentRent.toFixed(2),
        compareRent: parsedResults.standard.monthlyRent.toFixed(2),
        difference: (currentRent - parsedResults.standard.monthlyRent).toFixed(2),
        differenceOptimistic: (currentRent - parsedResults.optimistic.monthlyRent).toFixed(2),
        differencePessimistic: (currentRent - parsedResults.pessimistic.monthlyRent).toFixed(2),
        statement1: document.getElementById('statement1').checked,
        statement2: document.getElementById('statement2').checked,
        statement3: document.getElementById('statement3').checked
    };
    
    // ⚠️ HIER DEINE GOOGLE APPS SCRIPT URL EINFÜGEN:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHb_562Jl70TI1GReSZ720ezkmPEZAQVRj9gWDf-QEzUTWOGiCiv7qESW4Qw_rc-yTpg/exec';
    
    // Button während des Sendens deaktivieren
    const shareButton = document.getElementById('shareBtn');
    const originalText = shareButton.textContent;
    shareButton.disabled = true;
    shareButton.textContent = 'Wird gesendet...';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Wichtig für Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Bei no-cors können wir die Response nicht lesen, aber wenn kein Error geworfen wird, war es erfolgreich
        alert('Daten wurden erfolgreich übermittelt. Vielen Dank für Ihre Teilnahme!');
        
        // Felder zurücksetzen
        document.getElementById('landlordName').value = '';
        document.getElementById('managementName').value = '';
        document.getElementById('houseNumber').value = '';
        document.getElementById('statement1').checked = false;
        document.getElementById('statement2').checked = false;
        document.getElementById('statement3').checked = false;
        
    } catch (error) {
        console.error('Fehler beim Senden:', error);
        alert('Fehler beim Senden der Daten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.');
    } finally {
        // Button wieder aktivieren
        shareButton.disabled = false;
        shareButton.textContent = originalText;
    }
}

// Initialisierung
let modernizationsSlider, energyMeasuresSlider;

// Beim Laden der Seite gespeicherte Zwischenergebnisse anzeigen
document.addEventListener('DOMContentLoaded', function() {
    const savedResults = localStorage.getItem('intermediateResults');
    if (savedResults) {
        const results = JSON.parse(savedResults);
        displayIntermediateResults(results);
    }
});

// Platzhalter für die Straßenliste - hier können Sie Ihre Straßendaten einfügen
    const streets = [
            { name: "St.-Jürgen-Str.", adjustment: 0.81 },
            { name: "A.-Tischbein-Str.", adjustment: -0.91 },
            { name: "Aalstecherstr.", adjustment: 0.50 },
            { name: "Ackerweg", adjustment: -0.56 },
            { name: "Adam-J.-Krusenstern-Str. 1-25", adjustment: -0.89 },
            { name: "Adam-J.-Krusenstern-Str. 2-24", adjustment: -0.89 },
            { name: "Adam-J.-Krusenstern-Str. 26-30", adjustment: -0.68 },
            { name: "Adam-J.-Krusenstern-Str. 27-29", adjustment: -0.68 },
            { name: "Adam-J.-Krusenstern-Str. 31", adjustment: -0.89 },
            { name: "Adam-J.-Krusenstern-Str. 32", adjustment: -0.89 },
            { name: "Adelbrosweg", adjustment: 0.00 },
            { name: "Adolf-Becker-Str.", adjustment: 0.84 },
            { name: "Adolf-Wilbrandt-Str.", adjustment: 0.81 },
            { name: "Ahlbecker Str.", adjustment: -0.56 },
            { name: "Ahornweg", adjustment: 0.00 },
            { name: "Ährenkamp", adjustment: -0.65 },
            { name: "Akazienweg", adjustment: 0.00 },
            { name: "Albatrosweg", adjustment: 0.00 },
            { name: "Albert-Einstein-Str.", adjustment: 0.00 },
            { name: "Albert-Schulz-Str.", adjustment: 0.00 },
            { name: "Albert-Schweitzer-Str. 2-42", adjustment: -0.94 },
            { name: "Albert-Schweitzer-Str. 3-41", adjustment: -0.94 },
            { name: "Albert-Schweitzer-Str. 43-49", adjustment: -0.73 },
            { name: "Albert-Schweitzer-Str. 44-48", adjustment: -0.73 },
            { name: "Albin-Köbis-Str.", adjustment: 0.00 },
            { name: "Albrecht-Kossel-Platz", adjustment: 0.00 },
            { name: "Aleksis-Kivi-Str.", adjustment: -0.66 },
            { name: "Alexander-Fahrenheim-Weg", adjustment: 0.00 },
            { name: "Alexandrinenstr. 1-35", adjustment: 1.93 },
            { name: "Alexandrinenstr. 2-34", adjustment: 1.93 },
            { name: "Alexandrinenstr. 36-48", adjustment: 1.44 },
            { name: "Alexandrinenstr. 37-47", adjustment: 1.44 },
            { name: "Alexandrinenstr. 49-129", adjustment: 1.93 },
            { name: "Alexandrinenstr. 50-130", adjustment: 1.93 },
            { name: "Alfred-Schulze-Str.", adjustment: 0.00 },
            { name: "Alpenweg", adjustment: 0.00 },
            { name: "Alt Bartelsdorfer Str.", adjustment: 0.00 },
            { name: "Altbettelmönchstr.", adjustment: 0.50 },
            { name: "Alte Bahnhofstr. 1-la", adjustment: 1.44 },
            { name: "Alte Bahnhofstr. 1b", adjustment: 1.93 },
            { name: "Alte Bahnhofstr. 2a-8a", adjustment: 1.44 },
            { name: "Alte Bahnhofstr. 3-19a", adjustment: 1.44 },
            { name: "Alte Bahnhofstr. 10-10b", adjustment: 1.93 },
            { name: "Alte Bahnhofstr. 12-20b", adjustment: 1.44 },
            { name: "Alte Bahnhofstr. 20c", adjustment: 1.23 },
            { name: "Alte Dorfstr.", adjustment: 0.00 },
            { name: "Alte Warnemünder Chaussee 1-1c", adjustment: -0.91 },
            { name: "Alte Warnemünder Chaussee 1e", adjustment: -0.89 },
            { name: "Alte Warnemünder Chaussee 2-42", adjustment: -0.91 },
            { name: "Alte Warnemünder Chaussee 7-41", adjustment: -0.91 },
            { name: "Alte Wisch", adjustment: 0.00 },
            { name: "Alter Hafen Nord 1", adjustment: -0.68 },
            { name: "Alter Hafen Nord 210-216", adjustment: -0.19 },
            { name: "Alter Hafen Nord 215-325", adjustment: -0.19 },
            { name: "Alter Hafen Nord 300", adjustment: -0.68 },
            { name: "Alter Hafen Nord 324", adjustment: -0.19 },
            { name: "Alter Hafen Süd 1-5", adjustment: -0.19 },
            { name: "Alter Hafen Süd 2-6", adjustment: -0.19 },
            { name: "Alter Hafen Süd 10", adjustment: 0.70 },
            { name: "Alter Hafen Süd 334", adjustment: -0.19 },
            { name: "Alter Markt 1-15", adjustment: 0.81 },
            { name: "Alter Markt 8-14", adjustment: 0.81 },
            { name: "Alter Markt 16", adjustment: 1.02 },
            { name: "Alter Markt 17-19", adjustment: 1.02 },
            { name: "Alter Markt 22-34", adjustment: 0.81 },
            { name: "Alter Markt 23-35", adjustment: 0.81 },
            { name: "Altkarlshof", adjustment: 0.21 },
            { name: "Altschmiedestr.", adjustment: 0.81 },
            { name: "Am Bagehl 1-3a", adjustment: 1.02 },
            { name: "Am Bagehl 2", adjustment: 1.02 },
            { name: "Am Bagehl 4", adjustment: 1.51 },
            { name: "Am Bahnhof 1-7", adjustment: 1.93 },
            { name: "Am Bahnhof 2-2a", adjustment: 1.93 },
            { name: "Am Bahnhof 2c", adjustment: 0.70 },
            { name: "Am Bahnhof 4-12", adjustment: 1.93 },
            { name: "Am Bahnhof 9", adjustment: 1.44 },
            { name: "Am Bahnhof 13-15", adjustment: 1.93 },
            { name: "Am Bahnhof Bramow", adjustment: 1.91 },
            { name: "Am Belowberg", adjustment: 0.00 },
            { name: "Am Bienenhang", adjustment: 0.00 },
            { name: "Am Bilesathsberg", adjustment: 0.81 },
            { name: "Am Breitling 1-5", adjustment: 0.21 },
            { name: "Am Breitling 2-4", adjustment: 0.21 },
            { name: "Am Breitling 6-12", adjustment: 0.70 },
            { name: "Am Breitling 7-13", adjustment: 0.70 },
            { name: "Am Breitling 14-16", adjustment: 0.21 },
            { name: "Am Breitling 15", adjustment: 0.21 },
            { name: "Am Brink", adjustment: 0.84 },
            { name: "Am Bäckerhorn", adjustment: 0.00 },
            { name: "Am Dorfteich", adjustment: -0.65 },
            { name: "Am Düngemittelkai 1", adjustment: 0.21 },
            { name: "Am Düngemittelkai 2", adjustment: 0.70 },
            { name: "Am Düngemittelkai 5", adjustment: 0.70 },
            { name: "Am Eisenwerk", adjustment: -0.94 },
            { name: "Am Fasanenholz", adjustment: -0.65 },
            { name: "Am Feldrain", adjustment: 1.23 },
            { name: "Am Findling", adjustment: -0.68 },
            { name: "Am Fischereihafen 1", adjustment: 1.91 },
            { name: "Am Fischereihafen 1a", adjustment: -0.68 },
            { name: "Am Fischereihafen 2", adjustment: -0.19 },
            { name: "Am Fischereihafen 3", adjustment: -0.89 },
            { name: "Am Fischereihafen 113-115", adjustment: -0.68 },
            { name: "Am Fischereihafen 221", adjustment: -0.94 },
            { name: "Am Fliederbeerenbusch", adjustment: 0.21 },
            { name: "Am Getreidehafen 1", adjustment: 0.70 },
            { name: "Am Getreidehafen 2-4", adjustment: 0.70 },
            { name: "Am Getreidehafen 3", adjustment: 0.70 },
            { name: "Am Getreidehafen 5-7", adjustment: 0.21 },
            { name: "Am Getreidehafen 6", adjustment: 0.21 },
            { name: "Am Getreidehafen 8", adjustment: 0.00 },
            { name: "Am Getreidehafen 9", adjustment: 0.00 },
            { name: "Am Getreidehafen 10", adjustment: 0.21 },
            { name: "Am Getreidehafen 11", adjustment: 0.70 },
            { name: "Am Getreidehafen 12", adjustment: 0.70 },
            { name: "Am Golfplatz", adjustment: 1.23 },
            { name: "Am Grenzschlachthof 1", adjustment: 2.61 },
            { name: "Am Grenzschlachthof 3", adjustment: 2.12 },
            { name: "Am Grenzschlachthof 4", adjustment: 2.61 },
            { name: "Am Gutshaus", adjustment: 0.00 },
            { name: "Am Güterbahnhof", adjustment: 0.81 },
            { name: "Am Haargraben 1", adjustment: 1.02 },
            { name: "Am Haargraben 1a-3", adjustment: 1.51 },
            { name: "Am Haargraben 2", adjustment: 1.51 },
            { name: "Am Hansakai 1", adjustment: 0.70 },
            { name: "Am Hansakai 2", adjustment: 0.70 },
            { name: "Am Hansakai 6-10", adjustment: 0.21 },
            { name: "Am Hansakai 12", adjustment: 0.00 },
            { name: "Am Hansakai 14", adjustment: 0.21 },
            { name: "Am Hansakai 15", adjustment: 0.00 },
            { name: "Am Hansakai 17", adjustment: 0.21 },
            { name: "Am Hansakai 18-20", adjustment: 0.70 },
            { name: "Am Hansakai 19", adjustment: 0.70 },
            { name: "Am Hechtgraben", adjustment: 0.00 },
            { name: "Am Heidenholt", adjustment: 0.00 },
            { name: "Am Heiderand", adjustment: 0.00 },
            { name: "Am Hermteich", adjustment: -0.65 },
            { name: "Am Jägeracker", adjustment: 0.00 },
            { name: "Am Kabutzenhof 1-9", adjustment: 0.84 },
            { name: "Am Kabutzenhof 2-10", adjustment: 0.84 },
            { name: "Am Kabutzenhof 11-19", adjustment: 1.05 },
            { name: "Am Kabutzenhof 12-20", adjustment: 1.05 },
            { name: "Am Kabutzenhof 20a", adjustment: 1.54 },
            { name: "Am Kabutzenhof 21", adjustment: 1.54 },
            { name: "Am Kabutzenhof 22-24", adjustment: 1.05 },
            { name: "Am Kabutzenhof 23-25", adjustment: 1.05 },
            { name: "Am Kabutzenhof 26-46", adjustment: 0.84 },
            { name: "Am Kabutzenhof 27-45", adjustment: 0.84 },
            { name: "Am Kayenmühlengraben 2", adjustment: 1.91 },
            { name: "Am Kayenmühlengraben 6", adjustment: 2.12 },
            { name: "Am Kohlelager 1", adjustment: 0.21 },
            { name: "Am Kohlelager 2", adjustment: 0.00 },
            { name: "Am Kreuzgraben 1-1b", adjustment: 0.70 },
            { name: "Am Kreuzgraben 2", adjustment: 0.70 },
            { name: "Am Kreuzgraben 2a", adjustment: 0.21 },
            { name: "Am Kreuzgraben 3a", adjustment: 0.21 },
            { name: "Am Kreuzgraben 4", adjustment: 0.00 },
            { name: "Am Kreuzgraben 5", adjustment: 0.00 },
            { name: "Am Kringelgraben", adjustment: -0.65 },
            { name: "Am Kuhhof", adjustment: 0.00 },
            { name: "Am Kühlturm", adjustment: 0.00 },
            { name: "Am Leuchtturm", adjustment: 1.93 },
            { name: "Am Liepengraben", adjustment: 0.00 },
            { name: "Am Lohmühlengraben", adjustment: 1.02 },
            { name: "Am Markt", adjustment: 1.23 },
            { name: "Am Mühlenteich 2-4", adjustment: -0.45 },
            { name: "Am Mühlenteich 3-5", adjustment: -0.45 },
            { name: "Am Mühlenteich 6-16", adjustment: 0.04 },
            { name: "Am Mühlenteich 7-17", adjustment: 0.04 },
            { name: "Am Mühlenteich 18-24", adjustment: -0.45 },
            { name: "Am Mühlenteich 19-23", adjustment: -0.45 },
            { name: "Am Mühlenteich 25-45", adjustment: -0.66 },
            { name: "Am Mühlenteich 26-46", adjustment: -0.66 },
            { name: "Am Passagierkai", adjustment: 1.93 },
            { name: "Am Reifergraben", adjustment: 0.81 },
            { name: "Am Richtfunkturm", adjustment: 0.00 },
            { name: "Am Rodelberg", adjustment: -0.65 },
            { name: "Am Röper", adjustment: 0.84 },
            { name: "Am Schleusenberg", adjustment: 1.23 },
            { name: "Am Schmarler Bach", adjustment: -0.89 },
            { name: "Am Schwibbogen", adjustment: 1.02 },
            { name: "Am Schütgutkai 5-13", adjustment: 0.70 },
            { name: "Am Schütgutkai 6", adjustment: 0.70 },
            { name: "Am Schütgutkai 8-10", adjustment: 0.21 },
            { name: "Am Schütgutkai 12", adjustment: 0.70 },
            { name: "Am Schütgutkai 14", adjustment: 0.21 },
            { name: "Am Seehafen", adjustment: 0.00 },
            { name: "Am Skandinavienkai 1-5", adjustment: 0.00 },
            { name: "Am Skandinavienkai 2-6", adjustment: 0.00 },
            { name: "Am Skandinavienkai 7", adjustment: 0.70 },
            { name: "Am Skandinavienkai 8-12a", adjustment: 0.70 },
            { name: "Am Skandinavienkai 11", adjustment: 0.00 },
            { name: "Am Skandinavienkai 13", adjustment: 0.70 },
            { name: "Am Skandinavienkai 15-19", adjustment: 0.00 },
            { name: "Am Skandinavienkai 16-18", adjustment: 0.00 },
            { name: "Am Soll", adjustment: 1.23 },
            { name: "Am Stadtblick", adjustment: 0.00 },
            { name: "Am Steinkollekraftwerk", adjustment: 0.00 },
            { name: "Am Stolterar Ring", adjustment: 1.23 },
            { name: "Am Storchennest", adjustment: -0.65 },
            { name: "Am Strande 1a", adjustment: 0.71 },
            { name: "Am Strande 2g-4", adjustment: 1.51 },
            { name: "Am Strande 3-19", adjustment: 1.51 },
            { name: "Am Strande 6", adjustment: 1.02 },
            { name: "Am Strande 6a", adjustment: 1.51 },
            { name: "Am Strande 18", adjustment: 1.02 },
            { name: "Am Strom", adjustment: 1.93 },
            { name: "Am Teich", adjustment: 0.00 },
            { name: "Am Vögenteich 13-23", adjustment: 0.84 },
            { name: "Am Vögenteich 14-18", adjustment: 0.84 },
            { name: "Am Vögenteich 24-32", adjustment: 0.81 },
            { name: "Am Vögenteich 25-31", adjustment: 0.81 },
            { name: "Am Waldessaum", adjustment: 0.00 },
            { name: "Am Warnowkai", adjustment: 0.70 },
            { name: "Am Weißen Kreuz 1-3", adjustment: 0.00 },
            { name: "Am Weißen Kreuz 2-4", adjustment: 0.00 },
            { name: "Am Weißen Kreuz 5-7", adjustment: 0.21 },
            { name: "Am Weißen Kreuz 6", adjustment: 0.21 },
            { name: "Am Wendebecken 1a-11b", adjustment: 1.44 },
            { name: "Am Wendebecken 2a", adjustment: 1.44 },
            { name: "Am Wendebecken 2b", adjustment: 1.23 },
            { name: "Am Wendebecken 4a-6b", adjustment: 1.44 },
            { name: "Am Wendebecken 8", adjustment: 1.93 },
            { name: "Am Wendebecken 8a-10b", adjustment: 1.44 },
            { name: "Am Wendländer Schilde 4-6", adjustment: 0.81 },
            { name: "Am Wendländer Schilde 5", adjustment: 0.81 },
            { name: "Am Wendländer Schilde 7-9", adjustment: 1.02 },
            { name: "Am Wendländer Schilde 8-10", adjustment: 1.02 },
            { name: "Am Wendländer Schilde 11-13", adjustment: 0.81 },
            { name: "Am Wendländer Schilde 12-14", adjustment: 0.81 },
            { name: "Am Westfriedhof", adjustment: 0.00 },
            { name: "Am Wiesenhang", adjustment: 0.00 },
            { name: "Am Yachthafen 1-7", adjustment: 0.70 },
            { name: "Am Yachthafen 2-8", adjustment: 0.70 },
            { name: "Am Yachthafen 7a", adjustment: 0.21 },
            { name: "Am Ziegenmarkt", adjustment: 0.50 },
            { name: "Amberg 1", adjustment: 1.02 },
            { name: "Amberg 3", adjustment: 0.81 },
            { name: "Amberg 4a", adjustment: 0.81 },
            { name: "Amberg 5-13", adjustment: 1.02 },
            { name: "Amberg 6-14", adjustment: 1.02 },
            { name: "Amselweg", adjustment: 0.00 },
            { name: "Amtsstr. 1-3", adjustment: 0.21 },
            { name: "Amtsstr. 2-4", adjustment: 0.21 },
            { name: "Amtsstr. 5-9", adjustment: 0.70 },
            { name: "Amtsstr. 6-10", adjustment: 0.70 },
            { name: "Amtsstr. 10a-12", adjustment: 0.21 },
            { name: "Amtsstr. 11", adjustment: 0.21 },
            { name: "An den Buhnen", adjustment: 1.23 },
            { name: "An den Griebensöllen", adjustment: -0.66 },
            { name: "An den Moonwiesen", adjustment: 0.00 },
            { name: "An den Oldendorfer Tannen", adjustment: 0.00 },
            { name: "An der Elisabethwiese", adjustment: 0.84 },
            { name: "An der Feuerwache 1", adjustment: 0.21 },
            { name: "An der Feuerwache 2-6", adjustment: 0.00 },
            { name: "An der Feuerwache 5-7", adjustment: 0.00 },
            { name: "An der Försterei", adjustment: 0.00 },
            { name: "An der Hasenbäk", adjustment: 0.84 },
            { name: "An der Hauerschneise", adjustment: 0.00 },
            { name: "An der Hege", adjustment: 0.81 },
            { name: "An der Herrenwiese", adjustment: 0.00 },
            { name: "An der Jägerbäk 1-5", adjustment: 0.00 },
            { name: "An der Jägerbäk 2-4", adjustment: 0.00 },
            { name: "An der Jägerbäk 4b-10a", adjustment: -0.66 },
            { name: "An der Jägerbäk 7-11", adjustment: -0.66 },
            { name: "An der Katenwisch 1-3", adjustment: 0.70 },
            { name: "An der Katenwisch 2", adjustment: 0.70 },
            { name: "An der Katenwisch 4", adjustment: 0.00 },
            { name: "An der Kesselschmiede 1-3", adjustment: 2.61 },
            { name: "An der Kesselschmiede 2-6", adjustment: 2.61 },
            { name: "An der Kesselschmiede 5-5a", adjustment: 2.12 },
            { name: "An der Kesselschmiede 5b-7", adjustment: 2.61 },
            { name: "An der Kiessgrube", adjustment: 0.00 },
            { name: "An der Koppel", adjustment: 1.23 },
            { name: "An der Molkerei", adjustment: 0.00 },
            { name: "An der Obstplantage", adjustment: -0.66 },
            { name: "An der See 1", adjustment: 0.00 },
            { name: "An der See 2-8", adjustment: 0.21 },
            { name: "An der See 3-9", adjustment: 0.21 },
            { name: "An der See 10-12", adjustment: 0.70 },
            { name: "An der See 11-15", adjustment: 0.70 },
            { name: "An der See 12a", adjustment: 0.21 },
            { name: "An der See 14", adjustment: 0.70 },
            { name: "An der Stadtautobahn 38-48", adjustment: -0.56 },
            { name: "An der Stadtautobahn 39-47", adjustment: -0.56 },
            { name: "An der Stadtautobahn 50", adjustment: -0.73 },
            { name: "An der Stadtautobahn 60-64", adjustment: 1.23 },
            { name: "An der Stadtautobahn 61-63", adjustment: 1.23 },
            { name: "An der Stadtautobahn 66", adjustment: -0.73 },
            { name: "An der Stadtautobahn 69", adjustment: -0.56 },
            { name: "An der Stadtautobahn 70", adjustment: -0.56 },
            { name: "An der Viergelindenbrücke", adjustment: 0.81 },
            { name: "An der Warnow", adjustment: 1.51 },
            { name: "An der Werft", adjustment: 1.23 },
            { name: "An der alten Baumschule", adjustment: 0.00 },
            { name: "Anastasiastr. 2-18", adjustment: 1.23 },
            { name: "Anastasiastr. 3-17", adjustment: 1.23 },
            { name: "Anastasiastr. 19", adjustment: 1.44 },
            { name: "Anastasiastr. 20", adjustment: 1.44 },
            { name: "Anastasiastr. 21-41", adjustment: 1.23 },
            { name: "Anastasiastr. 22-42", adjustment: 1.23 },
            { name: "Ankerring", adjustment: 0.00 },
            { name: "Anklamer Str.", adjustment: 0.32 },
            { name: "Anna-Seghers-Ring", adjustment: -0.66 },
            { name: "Anne-Frank-Weg", adjustment: -0.66 },
            { name: "Annette-Kolb-Ring", adjustment: -0.66 },
            { name: "Anno-Toback-Weg", adjustment: 0.00 },
            { name: "Baggermeisterring", adjustment: -0.91 },
            { name: "Anton-Makarenko-Str.", adjustment: -0.66 },
            { name: "Anton-Saefkow-Str.", adjustment: 0.00 },
            { name: "Antwerpener Str.", adjustment: -0.73 },
            { name: "Apfelweg", adjustment: 0.00 },
            { name: "Arndtstr.", adjustment: 0.81 },
            { name: "Arno-Esch-Str.", adjustment: 0.00 },
            { name: "Arno-Holz-Str.", adjustment: 0.84 },
            { name: "Arnold-Bernhard-Str.", adjustment: 0.84 },
            { name: "Arpelweg", adjustment: 0.00 },
            { name: "Artur-Becker-Str.", adjustment: 0.00 },
            { name: "Asternhof", adjustment: 0.00 },
            { name: "Asternweg", adjustment: 0.00 },
            { name: "Auf der Huder 1-3", adjustment: 0.71 },
            { name: "Auf der Huder 2-4", adjustment: 0.71 },
            { name: "Auf der Huder 5", adjustment: 0.50 },
            { name: "Auf der Huder 6", adjustment: 0.50 },
            { name: "Auf der Tenne", adjustment: -0.65 },
            { name: "August-Bebel-Str. 1-51b", adjustment: 0.81 },
            { name: "August-Bebel-Str. 2-52b", adjustment: 0.81 },
            { name: "August-Bebel-Str. 55-93", adjustment: 0.50 },
            { name: "August-Bebel-Str. 88-92", adjustment: 0.50 },
            { name: "August-Cords-Str. 1-1a", adjustment: 0.00 },
            { name: "August-Cords-Str. 1b-3", adjustment: 0.21 },
            { name: "August-Cords-Str. 2-4", adjustment: 0.21 },
            { name: "August-Cords-Str. 5-7", adjustment: 0.70 },
            { name: "August-Cords-Str. 6", adjustment: 0.70 },
            { name: "August-Cords-Str. 9-11", adjustment: 0.21 },
            { name: "August-Cords-Str. 10", adjustment: 0.21 },
            { name: "August-Cords-Str. 12", adjustment: 0.00 },
            { name: "August-Cords-Str. 13", adjustment: 0.00 },
            { name: "Augustenstr.", adjustment: 0.81 },
            { name: "Babststr.", adjustment: 0.32 },
            { name: "Backbordstr. 1", adjustment: 0.70 },
            { name: "Backbordstr. 2", adjustment: 0.70 },
            { name: "Backbordstr. 3", adjustment: 0.21 },
            { name: "Backbordstr. 5-9", adjustment: 0.00 },
            { name: "Backbordstr. 6-8", adjustment: 0.00 },
            { name: "Backbordstr. 10a-12", adjustment: 0.21 },
            { name: "Backbordstr. 11-13", adjustment: 0.21 },
            { name: "Backbordstr. 15-17", adjustment: 0.70 },
            { name: "Badstüberstr. 1", adjustment: 0.50 },
            { name: "Badstüberstr. 2", adjustment: 0.50 },
            { name: "Badstüberstr. 4-6", adjustment: 0.71 },
            { name: "Badstüberstr. 5", adjustment: 0.71 },
            { name: "Badstüberstr. 7", adjustment: 0.50 },
            { name: "Badstüberstr. 8", adjustment: 0.50 },
            { name: "Bahnhofstr.", adjustment: 0.81 },
            { name: "Baleckestr.", adjustment: 0.81 },
            { name: "Ballastweg", adjustment: 0.70 },
            { name: "Barnstorf-Ausbau", adjustment: 0.00 },
            { name: "Barnstorfer Hof", adjustment: 0.00 },
            { name: "Barnstorfer Ring", adjustment: 0.00 },
            { name: "Barnstorfer Str.", adjustment: 0.00 },
            { name: "Barnstorfer Weg", adjustment: 0.84 },
            { name: "Baumschulenweg", adjustment: -0.94 },
            { name: "Bauschanweg", adjustment: 0.00 },
            { name: "Beethovenstr. (Reutersh.) 1-17", adjustment: 0.00 },
            { name: "Beethovenstr. (Reutersh.) 2-18", adjustment: 0.00 },
            { name: "Beethovenstr. (Reutersh.) 19-25", adjustment: 0.21 },
            { name: "Beethovenstr. (Reutersh.) 20-24", adjustment: 0.21 },
            { name: "Beethovenstr. (Reutersh.) 26-38", adjustment: 0.00 },
            { name: "Beethovenstr. (Reutersh.) 27-37", adjustment: 0.00 },
            { name: "Beethovenstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Beginenberg", adjustment: 0.81 },
            { name: "Bei den Polizeigärten", adjustment: 0.84 },
            { name: "Bei der Gärtnerei", adjustment: -0.56 },
            { name: "Bei der Knochenmühle 1", adjustment: 0.70 },
            { name: "Bei der Knochenmühle 2", adjustment: 0.70 },
            { name: "Bei der Knochenmühle 10", adjustment: 0.00 },
            { name: "Bei der Knochenmühle 28", adjustment: 0.70 },
            { name: "Bei der Marienkirche", adjustment: 1.02 },
            { name: "Bei der Nikolaikirche", adjustment: 1.51 },
            { name: "Bei der Petrikirche 1-7", adjustment: 1.02 },
            { name: "Bei der Petrikirche 4-10", adjustment: 1.02 },
            { name: "Bei der Petrikirche 9", adjustment: 0.81 },
            { name: "Bei der Tweel", adjustment: 1.02 },
            { name: "Beim Eislager 1-3", adjustment: 1.02 },
            { name: "Beim Eislager 2-4", adjustment: 1.02 },
            { name: "Beim Eislager 5-7", adjustment: 1.51 },
            { name: "Beim Eislager 6-8", adjustment: 1.51 },
            { name: "Beim Eislager 9-11", adjustment: 1.02 },
            { name: "Beim Eislager 10", adjustment: 1.02 },
            { name: "Beim Holzlager 1-3", adjustment: 1.02 },
            { name: "Beim Holzlager 2", adjustment: 1.02 },
            { name: "Beim Holzlager 4-6", adjustment: 1.51 },
            { name: "Beim Holzlager 5-7", adjustment: 1.51 },
            { name: "Beim Holzlager 8", adjustment: 1.02 },
            { name: "Beim Hornschen Hof", adjustment: 0.71 },
            { name: "Beim Kalkofen 1", adjustment: 0.70 },
            { name: "Beim Kalkofen 9", adjustment: 0.00 },
            { name: "Beim Kalkofen 10-10b", adjustment: 0.70 },
            { name: "Beim Kalkofen 15", adjustment: 0.70 },
            { name: "Beim Kuhtor", adjustment: 0.81 },
            { name: "Beim Lokschuppen 1-7a", adjustment: 0.81 },
            { name: "Beim Lokschuppen 2-10", adjustment: 1.02 },
            { name: "Beim Lokschuppen 11-17", adjustment: 1.02 },
            { name: "Beim Lokschuppen 12-16", adjustment: 1.02 },
            { name: "Beim Lokschuppen 18-26a", adjustment: 0.81 },
            { name: "Beim Lokschuppen 19-25a", adjustment: 0.81 },
            { name: "Beim Pingelshof", adjustment: 0.00 },
            { name: "Beim Pulverturm", adjustment: 0.00 },
            { name: "Beim St.-Katharinenstift 1-9", adjustment: 0.81 },
            { name: "Beim St.-Katharinenstift 2-6", adjustment: 0.81 },
            { name: "Beim St.-Katharinenstift 8", adjustment: 1.02 },
            { name: "Beim Waisenhaus 1", adjustment: 0.81 },
            { name: "Beim Waisenhaus 2", adjustment: 1.02 },
            { name: "Beim Waisenhaus 12-14", adjustment: 1.02 },
            { name: "Beim Waisenhaus 13", adjustment: 1.02 },
            { name: "Beim Wendentor", adjustment: 1.51 },
            { name: "Bergstr.", adjustment: 0.84 },
            { name: "Bernhard-Bästlein-Str.", adjustment: 0.00 },
            { name: "Bernsteinweg", adjustment: 1.23 },
            { name: "Berringerstr.", adjustment: -1.15 },
            { name: "Bertha-von-Suttner-Ring", adjustment: -0.94 },
            { name: "Bertolt-Brecht-Str.", adjustment: -0.66 },
            { name: "Bertrand-Russell-Allee", adjustment: -0.94 },
            { name: "Besanweg", adjustment: 0.00 },
            { name: "Bettina-von-Arnim-Platz", adjustment: -0.66 },
            { name: "Bienenweide", adjustment: -0.65 },
            { name: "Biestow-Ausbau", adjustment: -0.65 },
            { name: "Biestower Damm 1-55b", adjustment: -0.65 },
            { name: "Biestower Damm 2-54", adjustment: -0.65 },
            { name: "Biestower Damm 54a", adjustment: 0.00 },
            { name: "Binzer Str.", adjustment: -0.56 },
            { name: "Birkenweg", adjustment: 0.00 },
            { name: "Birkhorst", adjustment: 0.00 },
            { name: "Birmenweg", adjustment: 0.00 },
            { name: "Bleicherstr. 1-9", adjustment: 1.02 },
            { name: "Bleicherstr. 4-10", adjustment: 1.02 },
            { name: "Bleicherstr. 17-29a", adjustment: 0.81 },
            { name: "Bleicherstr. 18", adjustment: 1.02 },
            { name: "Bleicherstr. 22", adjustment: 1.02 },
            { name: "Bleicherstr. 28-30a", adjustment: 0.81 },
            { name: "Bleicherstr. 31-35d", adjustment: 1.02 },
            { name: "Bleicherstr. 32-34a", adjustment: 1.02 },
            { name: "Blockmacherring", adjustment: -0.91 },
            { name: "Blockweg 1-1c", adjustment: 0.00 },
            { name: "Blockweg 2-2c", adjustment: 0.00 },
            { name: "Blockweg 3-3a", adjustment: 0.21 },
            { name: "Blockweg 4-4a", adjustment: 0.21 },
            { name: "Blockweg 5-5a", adjustment: 0.70 },
            { name: "Blockweg 6-8", adjustment: 0.00 },
            { name: "Blockweg 7", adjustment: 0.21 },
            { name: "Blockweg 12a-16", adjustment: 0.21 },
            { name: "Blockweg 15-19b", adjustment: 0.21 },
            { name: "Blockweg 20-22", adjustment: 0.70 },
            { name: "Blockweg 21", adjustment: 0.70 },
            { name: "Blumenweg", adjustment: 0.00 },
            { name: "Blücherstr. 1-31", adjustment: 0.81 },
            { name: "Blücherstr. 18-88", adjustment: 1.02 },
            { name: "Blücherstr. 33-33b", adjustment: 1.02 },
            { name: "Blücherstr. 33c-89", adjustment: 0.81 },
            { name: "Blitzower Str.", adjustment: -0.73 },
            { name: "Boizenburger Str.", adjustment: -0.73 },
            { name: "Bojenweg", adjustment: 1.23 },
            { name: "Boleslaw-Prus-Str.", adjustment: -0.66 },
            { name: "Bonhoefferstr.", adjustment: 0.00 },
            { name: "Bootsbauenweg", adjustment: -0.91 },
            { name: "Borenweg", adjustment: 0.84 },
            { name: "Borwinstr.", adjustment: 0.84 },
            { name: "Braesigplatz", adjustment: 0.00 },
            { name: "Bræssigweg", adjustment: 0.00 },
            { name: "Brahestr.", adjustment: 0.00 },
            { name: "Brahmstr.", adjustment: 0.00 },
            { name: "Brandesstr.", adjustment: 0.81 },
            { name: "Brauergasse", adjustment: 0.81 },
            { name: "Braunschweiger Str.", adjustment: 0.32 },
            { name: "Bregenzer Str.", adjustment: 0.00 },
            { name: "Breite Str.", adjustment: 0.50 },
            { name: "Bremer Str.", adjustment: 0.32 },
            { name: "Brigitte-Reimann-Ring", adjustment: -0.66 },
            { name: "Brinckmansdorfer Weg", adjustment: 0.00 },
            { name: "Bruchweg", adjustment: -0.94 },
            { name: "Bruno-Taut-Str.", adjustment: -1.15 },
            { name: "Brückenweg", adjustment: -1.15 },
            { name: "Buchbinderstr.", adjustment: 0.50 },
            { name: "Buchenweg", adjustment: 0.00 },
            { name: "Budapester Str.", adjustment: 0.84 },
            { name: "Budentannemweg", adjustment: 0.00 },
            { name: "Burgwall 5-11", adjustment: 0.50 },
            { name: "Burgwall 6-10", adjustment: 0.50 },
            { name: "Burgwall 12-22", adjustment: 1.02 },
            { name: "Burgwall 13-21", adjustment: 1.02 },
            { name: "Burgwall 23-27", adjustment: 1.51 },
            { name: "Burgwall 24-26", adjustment: 1.51 },
            { name: "Burgwall 28-36", adjustment: 1.02 },
            { name: "Burgwall 31-37", adjustment: 1.02 },
            { name: "Burgwall 38-42", adjustment: 0.50 },
            { name: "Burgwall 39-43", adjustment: 0.50 },
            { name: "Burrkäversweg", adjustment: 0.00 },
            { name: "Büdherei", adjustment: -0.65 },
            { name: "Büdneweg", adjustment: 1.23 },
            { name: "Carl-Hinstorff-Weg", adjustment: 0.00 },
            { name: "Carl-Hopp-Str. 1-27", adjustment: 1.91 },
            { name: "Carl-Hopp-Str. 2-4b", adjustment: 1.91 },
            { name: "Carl-Hopp-Str. 4c", adjustment: 2.12 },
            { name: "Carl-Hopp-Str. 4d-4f", adjustment: 1.91 },
            { name: "Carl-Hopp-Str. 4g-4k", adjustment: 2.12 },
            { name: "Carl-Hopp-Str. 4p-26", adjustment: 1.91 },
            { name: "Carl-Malchin-Weg", adjustment: 0.00 },
            { name: "Carl-von-Linné-Str.", adjustment: -0.66 },
            { name: "Carl-von-Ossietzky-Str.", adjustment: -0.94 },
            { name: "Caspar-D.-Friedrich-Weg", adjustment: 0.00 },
            { name: "Charles-Bencard-Ring", adjustment: 0.00 },
            { name: "Charles-Darwin-Ring", adjustment: 0.00 },
            { name: "Clara-Zetkin-Str.", adjustment: 0.00 },
            { name: "Claudiusweg", adjustment: 0.00 },
            { name: "Clementsstr.", adjustment: 0.81 },
            { name: "Conrad-Blenkle-Str.", adjustment: 0.00 },
            { name: "Crivitzer Weg", adjustment: 0.00 },
            { name: "Dahliemweg", adjustment: 0.00 },
            { name: "Dalwitzhof", adjustment: 0.00 },
            { name: "Dalwitzhofer Weg", adjustment: 0.00 },
            { name: "Damerower Weg 1-3", adjustment: 0.00 },
            { name: "Damerower Weg 2", adjustment: 0.00 },
            { name: "Damerower Weg 8-10", adjustment: 0.00 },
            { name: "Damerower Weg 9-11b", adjustment: 0.00 },
            { name: "Damerower Weg 13-25a", adjustment: 0.00 },
            { name: "Damerower Weg 14-26", adjustment: 0.00 },
            { name: "Danziger Str.", adjustment: 0.32 },
            { name: "Darguner Str.", adjustment: -0.73 },
            { name: "De Drift", adjustment: 0.00 },
            { name: "De Striethoff", adjustment: 0.00 },
            { name: "Dehmelstr.", adjustment: 0.81 },
            { name: "Deichweg", adjustment: 0.00 },
            { name: "Demminer Str.", adjustment: -0.73 },
            { name: "Dethardingstr.", adjustment: 0.81 },
            { name: "Deutsche-Med-Platz", adjustment: 0.00 },
            { name: "Diebsstr.", adjustment: 0.50 },
            { name: "Dierkower Allee", adjustment: 0.00 },
            { name: "Dierkower Damm", adjustment: 0.00 },
            { name: "Dierkower Höhe", adjustment: 0.00 },
            { name: "Doberaner Landstr.", adjustment: 0.00 },
            { name: "Doberaner Str. 1-67", adjustment: 0.81 },
            { name: "Doberaner Str. 2-68", adjustment: 0.81 },
            { name: "Doberaner Str. 96-98", adjustment: 0.50 },
            { name: "Doberaner Str. 97-99", adjustment: 0.50 },
            { name: "Doberaner Str. 100-160", adjustment: 0.00 },
            { name: "Doberaner Str. 101-159", adjustment: 0.00 },
            { name: "Dora-Koch-Stetter-Weg", adjustment: 0.00 },
            { name: "Dorfstr.", adjustment: 0.00 },
            { name: "Dornblüthstr.", adjustment: 0.32 },
            { name: "Dorothea-Erxleben-Str.", adjustment: 0.00 },
            { name: "Dostojewskistr.", adjustment: -0.66 },
            { name: "Dr.-Lorenz-Weg 1-7", adjustment: 0.00 },
            { name: "Dr.-Lorenz-Weg 2", adjustment: 0.00 },
            { name: "Dr.-Lorenz-Weg 6-6a", adjustment: 0.00 },
            { name: "Dr.-Lorenz-Weg 8", adjustment: 0.00 },
            { name: "Drosselweg", adjustment: 0.00 },
            { name: "Drostenstr.", adjustment: 0.81 },
            { name: "Druwappelplatz", adjustment: 0.00 },
            { name: "Dubenweg", adjustment: 0.00 },
            { name: "Dumbuschweg", adjustment: 0.00 },
            { name: "Dwasweg", adjustment: 0.00 },
            { name: "Dänische Str.", adjustment: 1.23 },
            { name: "Dömitzer Weg", adjustment: -0.73 },
            { name: "Dünenweg 1-19a", adjustment: 0.21 },
            { name: "Dünenweg 2-18", adjustment: 0.21 },
            { name: "Dünenweg 23a-25c", adjustment: 0.70 },
            { name: "Dünenweg 24-26c", adjustment: 0.70 },
            { name: "Dünenweg 25d-27a", adjustment: 0.21 },
            { name: "Dünenweg 28", adjustment: 0.21 },
            { name: "Dünkirchener Str.", adjustment: -0.73 },
            { name: "Dürerplatz", adjustment: 0.32 },
            { name: "Dürtenweg", adjustment: 0.00 },
            { name: "Edelweißweg", adjustment: 0.00 },
            { name: "Edith-Lindenberg-Str.", adjustment: 0.00 },
            { name: "Eduard-Vilde-Str.", adjustment: -0.66 },
            { name: "Eggersstr.", adjustment: 0.32 },
            { name: "Egon-Tschirch-Weg", adjustment: 0.00 },
            { name: "Ehm-Well-Str.", adjustment: -0.66 },
            { name: "Eibenweg", adjustment: 0.00 },
            { name: "Eichendorffstr.", adjustment: 0.32 },
            { name: "Eichhörnchenweg", adjustment: 0.00 },
            { name: "Eikaterweg", adjustment: 0.00 },
            { name: "Eikbomweg", adjustment: 0.00 },
            { name: "Eikholt", adjustment: -0.65 },
            { name: "Elisabethstr.", adjustment: 0.84 },
            { name: "Ellernhorst", adjustment: 0.81 },
            { name: "Elmenhorster Weg", adjustment: -0.73 },
            { name: "Engelstr.", adjustment: 0.32 },
            { name: "Erich-Kästner-Weg", adjustment: -0.66 },
            { name: "Erich-Mühsam-Str.", adjustment: 0.00 },
            { name: "Erich-Schlesinger-Str.", adjustment: 0.00 },
            { name: "Erich-Venzmer-Weg", adjustment: 0.00 },
            { name: "Erich-Weinert-Siedlung", adjustment: 0.00 },
            { name: "Erich-Weinert-Str.", adjustment: 0.00 },
            { name: "Erlensumpfstr.", adjustment: 0.00 },
            { name: "Erlenweg", adjustment: 0.00 },
            { name: "Ernst-Alban-Str.", adjustment: 0.00 },
            { name: "Ernst-Barlach-Str. 1-3", adjustment: 0.81 },
            { name: "Ernst-Barlach-Str. 2-6", adjustment: 0.81 },
            { name: "Ernst-Barlach-Str. 7-9", adjustment: 1.02 },
            { name: "Ernst-Barlach-Str. 8", adjustment: 1.02 },
            { name: "Ernst-Barlach-Str. 11", adjustment: 0.81 },
            { name: "Ernst-Barlach-Str. 12", adjustment: 0.81 },
            { name: "Ernst-Brockelmann-Str.", adjustment: 0.21 },
            { name: "Ernst-Haeckel-Str.", adjustment: 0.00 },
            { name: "Ernst-Heydemann-Str.", adjustment: 0.32 },
            { name: "Ernst-Thälmann-Str.", adjustment: 0.00 },
            { name: "Eselföterstr.", adjustment: 0.50 },
            { name: "Eschenstr.", adjustment: 1.05 },
            { name: "Etkar-André-Str.", adjustment: 0.00 },
            { name: "Eutiner Str.", adjustment: -0.73 },
            { name: "Evertsche Gärtnerei 1", adjustment: 0.21 },
            { name: "Evertsche Gärtnerei 2-2a", adjustment: 0.21 },
            { name: "Evertsche Gärtnerei 3-5", adjustment: 0.00 },
            { name: "Evertsche Gärtnerei 4", adjustment: 0.00 },
            { name: "Evertsche Gärtnerei 6", adjustment: 0.21 },
            { name: "F.-M.-Scharffenberg-Weg", adjustment: -0.91 },
            { name: "Fahnenstr.", adjustment: 0.84 },
            { name: "Falckenbergstr.", adjustment: 0.00 },
            { name: "Faule Grube", adjustment: 0.50 },
            { name: "Faule Str. 1-3", adjustment: 0.81 },
            { name: "Faule Str. 2-4", adjustment: 0.81 },
            { name: "Faule Str. 5-23", adjustment: 1.02 },
            { name: "Faule Str. 6-22", adjustment: 1.02 },
            { name: "Feldstr.", adjustment: 0.84 },
            { name: "Felix-Stilfried-Str.", adjustment: 0.32 },
            { name: "Ferdinand-von-Mueller-Str.", adjustment: 0.00 },
            { name: "Ferdinandstr.", adjustment: 0.81 },
            { name: "Fichtenweg", adjustment: 0.00 },
            { name: "Finkenbauer", adjustment: 0.84 },
            { name: "Fischbank", adjustment: 0.81 },
            { name: "Fischerbruch", adjustment: 1.51 },
            { name: "Fischerstr. 1-3", adjustment: 0.50 },
            { name: "Fischerstr. 2", adjustment: 0.50 },
            { name: "Fischerstr. 5", adjustment: 0.71 },
            { name: "Fischerweg 1-407", adjustment: -0.89 },
            { name: "Fischerweg 4", adjustment: -0.89 },
            { name: "Fischerweg 10", adjustment: -0.68 },
            { name: "Fischerweg 12-14", adjustment: -0.89 },
            { name: "Fischerweg 18", adjustment: -0.68 },
            { name: "Fischerweg 110-112", adjustment: -0.89 },
            { name: "Fischerweg 408", adjustment: -0.68 },
            { name: "Fischerweg 409-421", adjustment: -0.68 },
            { name: "Fischerweg 416", adjustment: -0.89 },
            { name: "Fischerweg 422", adjustment: -0.68 },
            { name: "Flaßkoppweg", adjustment: 0.00 },
            { name: "Flensburger Str.", adjustment: -0.73 },
            { name: "Fliederweg", adjustment: 0.00 },
            { name: "Fockweg", adjustment: 0.00 },
            { name: "Fontaneweg", adjustment: 0.00 },
            { name: "Franz-Bunke-Weg", adjustment: 0.00 },
            { name: "Franz-Füllmann-Weg", adjustment: -0.66 },
            { name: "Franz-Jacob-Str.", adjustment: 0.00 },
            { name: "Franz-Liszt-Str.", adjustment: 0.00 },
            { name: "Franz-Schubert-Str.", adjustment: 0.00 },
            { name: "Fred-Weickert-Str.", adjustment: 0.00 },
            { name: "Freiligratnstr.", adjustment: 0.81 },
            { name: "Fridtjof-Nansen-Str.", adjustment: -0.66 },
            { name: "Friedhofsweg", adjustment: 0.84 },
            { name: "Friedrich-Barnewitz-Str.", adjustment: 1.23 },
            { name: "Friedrich-Engels-Platz", adjustment: 0.81 },
            { name: "Friedrich-Fischer-Str.", adjustment: 0.70 },
            { name: "Friedrich-Flügge-Str.", adjustment: 0.00 },
            { name: "Friedrich-Franz-Str.", adjustment: 1.44 },
            { name: "Friedrich-Hebbel-Weg", adjustment: 0.00 },
            { name: "Friedrich-Slicher-Str. 1", adjustment: 0.21 },
            { name: "Friedrich-Slicher-Str. 2-16", adjustment: 0.00 },
            { name: "Friedrich-Slicher-Str. 3-15", adjustment: 0.00 },
            { name: "Friedrich-Slicher-Str. 17-19", adjustment: 0.21 },
            { name: "Friedrich-Slicher-Str. 18", adjustment: 0.21 },
            { name: "Friedrich-Witte-Str.", adjustment: 0.00 },
            { name: "Friedrich-Wolf-Str.", adjustment: -0.66 },
            { name: "Friedrichshöhe", adjustment: 0.00 },
            { name: "Friedrichstr. 1-11", adjustment: 0.84 },
            { name: "Friedrichstr. 2-16", adjustment: 0.84 },
            { name: "Friedrichstr. 17-23a", adjustment: 1.05 },
            { name: "Friedrichstr. 18", adjustment: 1.05 },
            { name: "Friedrichstr. 22", adjustment: 1.54 },
            { name: "Friedrichstr. 24-40", adjustment: 0.84 },
            { name: "Friedrichstr. 25-41", adjustment: 0.84 },
            { name: "Friesenstr.", adjustment: 0.84 },
            { name: "Fritz-Mackensen-Weg", adjustment: 0.00 },
            { name: "Fritz-Reuter-Str. (Kröpeliner-Tor-Vorstadt)", adjustment: 0.84 },
            { name: "Fritz-Reuter-Str. (Warnemünde)", adjustment: 1.23 },
            { name: "Fritz-Triddelfitz-Weg", adjustment: 0.00 },
            { name: "Fährberg", adjustment: 0.70 },
            { name: "Fährlufe", adjustment: 0.21 },
            { name: "Fährstr.", adjustment: 0.00 },
            { name: "Gadebuscher Str.", adjustment: -0.73 },
            { name: "Gaffelschonerweg 1-1c", adjustment: 1.02 },
            { name: "Gaffelschonerweg 2", adjustment: 1.51 },
            { name: "Gaffelschonerweg 3-7b", adjustment: 1.51 },
            { name: "Gaffelschonerweg 4-4a", adjustment: 1.02 },
            { name: "Gaffelschonerweg 6-8", adjustment: 1.51 },
            { name: "Gaffelschonerweg 8a", adjustment: 1.02 },
            { name: "Gaffelschonerweg 9-9a", adjustment: 1.02 },
            { name: "Gaffelschonerweg 10", adjustment: 1.51 },
            { name: "Gaffelschonerweg 11-15", adjustment: 1.51 },
            { name: "Gaffelschonerweg 12", adjustment: 1.02 },
            { name: "Gaffelschonerweg 14", adjustment: 1.51 },
            { name: "Gaffelschonerweg 16", adjustment: 1.02 },
            { name: "Galileistr.", adjustment: 0.00 },
            { name: "Ganterweg", adjustment: 0.00 },
            { name: "Garbräterstr.", adjustment: 0.50 },
            { name: "Gartenstr.", adjustment: 1.23 },
            { name: "Gedser Str.", adjustment: -0.56 },
            { name: "Gehlsheimer Str. 1-11b", adjustment: 0.00 },
            { name: "Gehlsheimer Str. 2-12", adjustment: 0.00 },
            { name: "Gehlsheimer Str. 13-17", adjustment: 0.21 },
            { name: "Gehlsheimer Str. 14-16", adjustment: 0.21 },
            { name: "Gehlsheimer Str. 18", adjustment: 0.70 },
            { name: "Gehlsheimer Str. 19a", adjustment: 0.00 },
            { name: "Gehlsheimer Str. 19b-19c", adjustment: 0.70 },
            { name: "Gehlsheimer Str. 19d-19f", adjustment: 0.21 },
            { name: "Gehlsheimer Str. 20-22", adjustment: 0.00 },
            { name: "Gellerstr.", adjustment: 0.84 },
            { name: "Georg-Adolf-Demmler-Str.", adjustment: -1.15 },
            { name: "Georg-Büchner-Str.", adjustment: 0.81 },
            { name: "Georginenplatz 1-3", adjustment: 1.44 },
            { name: "Georginenplatz 2-12b", adjustment: 1.44 },
            { name: "Georginenplatz 5", adjustment: 1.93 },
            { name: "Georginenplatz 7-11", adjustment: 1.44 },
            { name: "Georginenstr.", adjustment: 1.93 },
            { name: "Georginemweg", adjustment: 0.00 },
            { name: "Gerberbruch 1-5", adjustment: 1.02 },
            { name: "Gerberbruch 2-10", adjustment: 1.02 },
            { name: "Gerberbruch 11-15", adjustment: 1.51 },
            { name: "Gerberbruch 12-14", adjustment: 1.51 },
            { name: "Gerberbruch 16-18", adjustment: 1.02 },
            { name: "Gerberbruch 17", adjustment: 1.02 },
            { name: "Gerbergrabenweg 2-4", adjustment: 1.02 },
            { name: "Gerbergrabenweg 5-9", adjustment: 1.51 },
            { name: "Gerbergrabenweg 6-10", adjustment: 1.51 },
            { name: "Gerbergrabenweg 11-17", adjustment: 1.02 },
            { name: "Gerbergrabenweg 12-18", adjustment: 1.02 },
            { name: "Gerhard-Marcks-Weg", adjustment: 0.00 },
            { name: "Gerhart-Hauptmann-Str.", adjustment: 0.81 },
            { name: "Gerstemweg", adjustment: 0.00 },
            { name: "Gertrud-Bäumer-Weg", adjustment: -0.66 },
            { name: "Gertrudenplatz", adjustment: 0.84 },
            { name: "Gertrudenstr.", adjustment: 0.84 },
            { name: "Gerüstbauerring", adjustment: -0.91 },
            { name: "Geschwister-Scholl-Str.", adjustment: 0.00 },
            { name: "Gewerbehof", adjustment: -0.73 },
            { name: "Gewerbestr. 1", adjustment: -0.19 },
            { name: "Gewerbestr. 1a-3", adjustment: -0.68 },
            { name: "Gewerbestr. 4", adjustment: -0.68 },
            { name: "Gewettstr. (KTV)", adjustment: 0.84 },
            { name: "Gewettstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Gielandstr.", adjustment: 0.00 },
            { name: "Giordano-Bruno-Weg", adjustment: 0.00 },
            { name: "Glockengießerhof", adjustment: 0.81 },
            { name: "Gnatzkoppweg", adjustment: 0.00 },
            { name: "Gnoiener Weg", adjustment: -0.73 },
            { name: "Godeke-Michels-Str.", adjustment: 0.00 },
            { name: "Goerdelerstr.", adjustment: 0.00 },
            { name: "Goetheplatz 1-5", adjustment: 0.81 },
            { name: "Goetheplatz 2-4", adjustment: 0.81 },
            { name: "Goetheplatz 7-9", adjustment: 0.84 },
            { name: "Goetheplatz 8-10", adjustment: 0.84 },
            { name: "Goethestr.", adjustment: 0.81 },
            { name: "Goldberger Weg", adjustment: -0.73 },
            { name: "Goorstorfer Str.", adjustment: 0.00 },
            { name: "Goslarer Str.", adjustment: 0.32 },
            { name: "Graal-Müritzer Str.", adjustment: 0.00 },
            { name: "Grabower Str.", adjustment: -0.73 },
            { name: "Graf-Lippe-Str.", adjustment: 0.32 },
            { name: "Graf-Schack-Str.", adjustment: 0.81 },
            { name: "Graf-Schwerin-Str.", adjustment: 0.00 },
            { name: "Graf-Stauffenberg-Str.", adjustment: -0.94 },
            { name: "Grapengießerstr.", adjustment: 0.50 },
            { name: "Graureihenweg", adjustment: 0.00 },
            { name: "Grazer Str. 1", adjustment: 0.21 },
            { name: "Grazer Str. 2", adjustment: 0.21 },
            { name: "Grazer Str. 3-9", adjustment: 0.00 },
            { name: "Grazer Str. 4-8", adjustment: 0.00 },
            { name: "Greifswalder Str.", adjustment: 0.32 },
            { name: "Gretenwäschenweg", adjustment: 0.00 },
            { name: "Grevesmühlener Str.", adjustment: -0.73 },
            { name: "Groten Enn 1-21", adjustment: -0.91 },
            { name: "Groten Enn 4-24", adjustment: -0.91 },
            { name: "Groten Enn 23-29a", adjustment: -0.70 },
            { name: "Groten Enn 24a-28b", adjustment: -0.70 },
            { name: "Groten Enn 30-30a", adjustment: -0.91 },
            { name: "Groten Enn 31", adjustment: -0.91 },
            { name: "Groß Kleiner Allee", adjustment: -0.91 },
            { name: "Groß Kleiner Weg 1-17m", adjustment: 1.23 },
            { name: "Groß Kleiner Weg 2-18b", adjustment: 1.23 },
            { name: "Groß Kleiner Weg 19-21f", adjustment: -0.73 },
            { name: "Groß Kleiner Weg 20-22a", adjustment: -0.73 },
            { name: "Groß Schwaber Weg", adjustment: 0.00 },
            { name: "Groß Stover Str.", adjustment: -0.65 },
            { name: "Großbaumweg", adjustment: 0.00 },
            { name: "Große Goldstr.", adjustment: 0.81 },
            { name: "Große Mönchenstr. 1-5", adjustment: 0.50 },
            { name: "Große Mönchenstr. 2-4", adjustment: 0.50 },
            { name: "Große Mönchenstr. 6-12", adjustment: 0.71 },
            { name: "Große Mönchenstr. 7-11", adjustment: 0.71 },
            { name: "Große Mönchenstr. 13-15", adjustment: 0.50 },
            { name: "Große Mönchenstr. 14-16", adjustment: 0.50 },
            { name: "Große Rampe", adjustment: 0.00 },
            { name: "Große Scharrenstr.", adjustment: 0.81 },
            { name: "Große Wasserstr.", adjustment: 0.81 },
            { name: "Großer Horst", adjustment: -0.65 },
            { name: "Großer Katthagen", adjustment: 0.50 },
            { name: "Grubenstr. 1-17", adjustment: 0.81 },
            { name: "Grubenstr. 2-18", adjustment: 0.81 },
            { name: "Grubenstr. 20", adjustment: 0.50 },
            { name: "Grubenstr. 24", adjustment: 0.71 },
            { name: "Grubenstr. 25", adjustment: 0.71 },
            { name: "Grubenstr. 27", adjustment: 1.51 },
            { name: "Grubenstr. 28-32", adjustment: 1.02 },
            { name: "Grubenstr. 29-35", adjustment: 1.02 },
            { name: "Grubenstr. 36-62", adjustment: 0.81 },
            { name: "Grubenstr. 37-57", adjustment: 0.81 },
            { name: "Grüner Weg (Stadtmitte)", adjustment: 0.81 },
            { name: "Grüner Weg (Warnemünde)", adjustment: 1.23 },
            { name: "Gutenbergstr. 1-71", adjustment: 0.00 },
            { name: "Gutenbergstr. 2-70", adjustment: 0.00 },
            { name: "Gutenbergstr. 74-94", adjustment: -1.15 },
            { name: "Gutenbergstr. 75-93", adjustment: -1.15 },
            { name: "Gutsweg", adjustment: -0.65 },
            { name: "Gänseblümchenweg", adjustment: 0.00 },
            { name: "Gärtnerstr. 1", adjustment: 1.51 },
            { name: "Gärtnerstr. 2-16", adjustment: 1.02 },
            { name: "Gärtnerstr. 3-15", adjustment: 1.02 },
            { name: "Gärtnerstr. 17", adjustment: 1.51 },
            { name: "Gärtnerstr. 18", adjustment: 1.51 },
            { name: "Gösselweg", adjustment: 0.00 },
            { name: "Güstrower Str.", adjustment: -0.73 },
            { name: "Habichtshöhe 16-20", adjustment: 1.44 },
            { name: "Habichtshöhe 17-45", adjustment: 1.44 },
            { name: "Habichtshöhe 20a-20b", adjustment: 1.23 },
            { name: "Habichtshöhe 22-44", adjustment: 1.44 },
            { name: "Habichtshöhe 46-54", adjustment: 1.23 },
            { name: "Habichtshöhe 47-51", adjustment: 1.23 },
            { name: "Habichtshöhe 53", adjustment: 1.44 },
            { name: "Habichtshöhe 55", adjustment: 1.23 },
            { name: "Haedgestr. 1-3", adjustment: 0.84 },
            { name: "Haedgestr. 2-4", adjustment: 0.84 },
            { name: "Haedgestr. 5-31", adjustment: 1.05 },
            { name: "Haedgestr. 6-32", adjustment: 1.05 },
            { name: "Haedgestr. 33-37", adjustment: 0.84 },
            { name: "Haedgestr. 34-36", adjustment: 0.84 },
            { name: "Hafenallee", adjustment: -0.94 },
            { name: "Hafenbahnweg", adjustment: -0.94 },
            { name: "Haferweg", adjustment: 0.00 },
            { name: "Hagebuttenweg", adjustment: 1.23 },
            { name: "Hagenower Weg", adjustment: -0.73 },
            { name: "Hainbuchemring 1-11", adjustment: -0.94 },
            { name: "Hainbuchemring 4", adjustment: -0.94 },
            { name: "Hainbuchemring 10", adjustment: -0.73 },
            { name: "Hamburger Str. 28", adjustment: 0.32 },
            { name: "Hamburger Str. 30-38", adjustment: 0.00 },
            { name: "Hamburger Str. 31-61", adjustment: 0.00 },
            { name: "Hamburger Str. 40", adjustment: 0.70 },
            { name: "Hamburger Str. 50-62", adjustment: 0.00 },
            { name: "Hamburger Str. 115-119", adjustment: 0.21 },
            { name: "Hamburger Str. 116-118", adjustment: 0.21 },
            { name: "Hamburger Str. 120-142", adjustment: 0.00 },
            { name: "Hamburger Str. 121-143", adjustment: 0.00 },
            { name: "Handelsstr.", adjustment: -0.89 },
            { name: "Handwerkstr.", adjustment: -0.89 },
            { name: "Hanne-Nüte-Weg 1-5", adjustment: 0.21 },
            { name: "Hanne-Nüte-Weg 2-6", adjustment: 0.21 },
            { name: "Hanne-Nüte-Weg 7-21", adjustment: 0.00 },
            { name: "Hanne-Nüte-Weg 8-22", adjustment: 0.00 },
            { name: "Hanne-Nüte-Weg 23-27", adjustment: 0.21 },
            { name: "Hanne-Nüte-Weg 24-28", adjustment: 0.21 },
            { name: "Hannes-Meyer-Platz", adjustment: -1.15 },
            { name: "Hanning-Klauk-Weg", adjustment: 0.00 },
            { name: "Hans-E.-Oberländer-Weg", adjustment: 0.00 },
            { name: "Hans-Fallada-Str.", adjustment: -0.66 },
            { name: "Hans-Moral-Str.", adjustment: 0.00 },
            { name: "Hans-Sachs-Allee", adjustment: 0.32 },
            { name: "Hans-Seehase-Ring", adjustment: 0.00 },
            { name: "Hansastr.", adjustment: 0.84 },
            { name: "Hanseatenstr.", adjustment: 0.00 },
            { name: "Hartestr.", adjustment: 0.81 },
            { name: "Hartmut-Colden-Str.", adjustment: -1.15 },
            { name: "Hasenheide", adjustment: -0.94 },
            { name: "Hasenweg", adjustment: 0.00 },
            { name: "Haubentaucherweg", adjustment: 0.00 },
            { name: "Hauptstr.", adjustment: -0.73 },
            { name: "Hawermannweg", adjustment: 0.00 },
            { name: "Hedda-Zinner-Weg", adjustment: -0.66 },
            { name: "Hedwig-Woermann-Weg", adjustment: 0.00 },
            { name: "Hedwig-von-Goetzen-Str.", adjustment: 0.00 },
            { name: "Heidmüllerweg", adjustment: 0.00 },
            { name: "Heiligengeisthof", adjustment: 0.50 },
            { name: "Heiner-Moll-Weg", adjustment: 0.00 },
            { name: "Heinrich-Bauer-Weg 1", adjustment: 0.00 },
            { name: "Heinrich-Bauer-Weg 2", adjustment: 0.21 },
            { name: "Heinrich-Bauer-Weg 3", adjustment: 0.21 },
            { name: "Heinrich-Bauer-Weg 4", adjustment: 0.70 },
            { name: "Heinrich-Böll-Weg", adjustment: -0.66 },
            { name: "Heinrich-Engel-Weg", adjustment: 0.00 },
            { name: "Heinrich-Heine-Platz", adjustment: 0.00 },
            { name: "Heinrich-Heine-Str. 1-1c", adjustment: 1.44 },
            { name: "Heinrich-Heine-Str. 2", adjustment: 1.44 },
            { name: "Heinrich-Heine-Str. 3-15", adjustment: 1.23 },
            { name: "Heinrich-Heine-Str. 4-28", adjustment: 1.23 },
            { name: "Heinrich-Heine-Str. 29-31", adjustment: 1.44 },
            { name: "Heinrich-Heine-Str. 30", adjustment: 1.44 },
            { name: "Heinrich-Schütz-Str.", adjustment: 0.00 },
            { name: "Heinrich-Tessenow-Str.", adjustment: -1.15 },
            { name: "Heinrich-Vogeler-Weg", adjustment: 0.00 },
            { name: "Heinrich-von-Kleist-Weg", adjustment: 0.00 },
            { name: "Heinz-Kapelle-Str.", adjustment: 0.00 },
            { name: "Heisterweg", adjustment: 0.00 },
            { name: "Helen-Keller-Weg", adjustment: -0.66 },
            { name: "Hellingstr. 1", adjustment: 2.12 },
            { name: "Hellingstr. 3", adjustment: 2.61 },
            { name: "Hellingstr. 3a", adjustment: 2.12 },
            { name: "Hellingstr. 4-8", adjustment: 2.61 },
            { name: "Hellingstr. 5-9", adjustment: 2.61 },
            { name: "Hellingstr. 10", adjustment: 2.12 },
            { name: "Helmuth-Mentz-Str. 1", adjustment: 0.00 },
            { name: "Helmuth-Mentz-Str. 2", adjustment: 0.21 },
            { name: "Helmuth-Mentz-Str. 3", adjustment: 0.21 },
            { name: "Helmuth-Mentz-Str. 4-6", adjustment: 0.70 },
            { name: "Helmuth-Mentz-Str. 5-7", adjustment: 0.70 },
            { name: "Helmuth-Mentz-Str. 8", adjustment: 0.21 },
            { name: "Helmuth-Mentz-Str. 9", adjustment: 0.21 },
            { name: "Helsinkier Str.", adjustment: -0.56 },
            { name: "Henrik-Ibsen-Str.", adjustment: -0.66 },
            { name: "Herderstr.", adjustment: 0.81 },
            { name: "Hermann-Flach-Str.", adjustment: -0.91 },
            { name: "Hermann-Löns-Weg", adjustment: 0.00 },
            { name: "Hermannstr. (Stadtmitte) 1", adjustment: 0.50 },
            { name: "Hermannstr. (Stadtmitte) 5-33", adjustment: 0.81 },
            { name: "Hermannstr. (Stadtmitte) 6-34a", adjustment: 0.81 },
            { name: "Hermannstr. (Stadtmitte) 35", adjustment: 0.50 },
            { name: "Hermannstr. (Stadtmitte) 36", adjustment: 0.50 },
            { name: "Hermannstr. (Warnemünde)", adjustment: 1.44 },
            { name: "Herweghstr.", adjustment: 0.81 },
            { name: "Heulerweg", adjustment: 0.00 },
            { name: "Hinrichsdorf", adjustment: 0.00 },
            { name: "Hinrichsdorfer Str. 1-7", adjustment: 0.00 },
            { name: "Hinrichsdorfer Str. 2-50", adjustment: 0.00 },
            { name: "Hinrichsdorfer Str. 7b-7d", adjustment: -0.94 },
            { name: "Hinrichsdorfer Str. 7e", adjustment: -1.15 },
            { name: "Hinrichsdorfer Str. 7f-7k", adjustment: -0.94 },
            { name: "Hinrichsdorfer Str. 13-51", adjustment: 0.00 },
            { name: "Hinrichshäger Str.", adjustment: 0.00 },
            { name: "Hinter dem Rathaus", adjustment: 0.81 },
            { name: "Hinter den Dünen", adjustment: 1.23 },
            { name: "Hinter der Kirche", adjustment: -0.65 },
            { name: "Hinter der Mauer", adjustment: 0.81 },
            { name: "Hirtenweg", adjustment: -0.65 },
            { name: "Hohe Düne 1-19b", adjustment: 0.21 },
            { name: "Hohe Düne 2-4e", adjustment: 0.21 },
            { name: "Hohe Düne 8a-8b", adjustment: 0.70 },
            { name: "Hohe Düne 10-18b", adjustment: 0.21 },
            { name: "Hohe Düne 20a-20b", adjustment: 0.70 },
            { name: "Hohe Düne 21a-21f", adjustment: 0.70 },
            { name: "Hohe Düne 22-24", adjustment: 0.21 },
            { name: "Hohe Düne 23", adjustment: 0.21 },
            { name: "Hohe Düne 25-27", adjustment: 0.00 },
            { name: "Hohe Düne 26-28c", adjustment: 0.00 },
            { name: "Hohe Düne 29", adjustment: 0.21 },
            { name: "Hohe Düne 29a", adjustment: 0.00 },
            { name: "Hohe Düne 30-30a", adjustment: 0.21 },
            { name: "Hohe Düne 31-31a", adjustment: 0.21 },
            { name: "Holbeinplatz 10-12", adjustment: 0.32 },
            { name: "Holbeinplatz 11", adjustment: 0.32 },
            { name: "Holbeinplatz 14", adjustment: 0.00 },
            { name: "Holunderweg", adjustment: 0.00 },
            { name: "Hornissenweg", adjustment: -0.66 },
            { name: "Hospitalstr.", adjustment: 0.84 },
            { name: "Hufelandstr.", adjustment: 0.00 },
            { name: "Hufenkoppel", adjustment: 0.00 },
            { name: "Huflattichweg", adjustment: 0.00 },
            { name: "Humboldtstr.", adjustment: 0.81 },
            { name: "Hummelbrink", adjustment: 0.00 },
            { name: "Humperdinckstr.", adjustment: 0.00 },
            { name: "Hundertmännerstr.", adjustment: 0.84 },
            { name: "Hundsburgallee", adjustment: -0.89 },
            { name: "Husumer Str.", adjustment: -0.73 },
            { name: "Häktweg", adjustment: 0.84 },
            { name: "Händelstr.", adjustment: 0.00 },
            { name: "Höger Up", adjustment: 0.00 },
            { name: "Hölderlinweg", adjustment: 0.00 },
            { name: "Hüerbaasweg", adjustment: 0.00 },
            { name: "Igelweg", adjustment: 0.00 },
            { name: "Ilja-Ehrenburg-Str.", adjustment: 0.00 },
            { name: "Im Garten", adjustment: 0.00 },
            { name: "Im Heuschober", adjustment: 0.00 },
            { name: "Im Winkel", adjustment: 0.00 },
            { name: "Immenberg", adjustment: 0.00 },
            { name: "Industriestr. 7", adjustment: 0.00 },
            { name: "Industriestr. 8-10", adjustment: 0.00 },
            { name: "Industriestr. 9", adjustment: 0.00 },
            { name: "Industriestr. 10a-10d", adjustment: 0.00 },
            { name: "Industriestr. 10e", adjustment: 0.00 },
            { name: "Industriestr. 10f", adjustment: 0.00 },
            { name: "Industriestr. 11-15", adjustment: 0.00 },
            { name: "Industriestr. 12-14c", adjustment: 0.00 },
            { name: "Ingeborg-Bachmann-Str.", adjustment: -0.66 },
            { name: "Innsbrucker Str.", adjustment: 0.00 },
            { name: "Isolde-Kurz-Weg", adjustment: -0.66 },
            { name: "Jahnstr.", adjustment: 0.84 },
            { name: "Jan-Maat-Weg", adjustment: 0.00 },
            { name: "Jawaharlal-Nehru-Str.", adjustment: 0.00 },
            { name: "Joachim-Jungius-Str.", adjustment: 0.00 },
            { name: "Joachim-Schlue-Str.", adjustment: 0.00 },
            { name: "Joe-Duty-Weg", adjustment: 0.00 },
            { name: "Johann-C.-Wilken-Str.", adjustment: 0.00 },
            { name: "Johann-S.-Bach-Str.", adjustment: 0.00 },
            { name: "Johannes-Bobrowski-Weg", adjustment: -0.66 },
            { name: "Johannes-Kepler-Str.", adjustment: 0.00 },
            { name: "Johannesweg", adjustment: 0.00 },
            { name: "Johannisstr.", adjustment: 0.81 },
            { name: "John-Brinckman-Str. (Stadtmitte)", adjustment: 0.81 },
            { name: "John-Brinckman-Str. (Warn.) 1", adjustment: 1.23 },
            { name: "John-Brinckman-Str. (Warn.) 2-18", adjustment: 1.23 },
            { name: "John-Brinckman-Str. (Warn.) 3-17a", adjustment: 1.23 },
            { name: "John-Schehr-Str.", adjustment: 0.00 },
            { name: "Joliot-Curie-Allee", adjustment: 0.00 },
            { name: "Jollenweg 1-13", adjustment: 0.00 },
            { name: "Jollenweg 2-6", adjustment: 0.00 },
            { name: "Jollenweg 8", adjustment: 0.00 },
            { name: "Jollenweg 10-14", adjustment: 0.00 },
            { name: "Joseph-Haydn-Str.", adjustment: 0.00 },
            { name: "Joseph-Herzfeld-Str.", adjustment: 0.00 },
            { name: "Jung-Jochen-Weg", adjustment: 0.00 },
            { name: "Jurek-Becker-Str.", adjustment: -0.66 },
            { name: "Justus-von-Liebig-Weg", adjustment: 0.00 },
            { name: "Jägerweg 1-3", adjustment: 0.00 },
            { name: "Jägerweg 2", adjustment: 0.00 },
            { name: "Jägerweg 4", adjustment: 0.00 },
            { name: "Jägerweg 5", adjustment: 0.21 },
            { name: "Jürgeshof", adjustment: 0.00 },
            { name: "Kadammsweg", adjustment: 0.00 },
            { name: "Kadettweg", adjustment: 0.70 },
            { name: "Kamellenweg", adjustment: 0.00 },
            { name: "Kantenweg", adjustment: 1.23 },
            { name: "Kantstr. 1-11", adjustment: 0.21 },
            { name: "Kantstr. 2-10", adjustment: 0.21 },
            { name: "Kantstr. 12-14", adjustment: 0.00 },
            { name: "Kantstr. 13-15", adjustment: 0.00 },
            { name: "Kapitän-Borgwardt-Weg 1-3", adjustment: 0.00 },
            { name: "Kapitän-Borgwardt-Weg 2-4", adjustment: 0.00 },
            { name: "Kapitän-Borgwardt-Weg 4a-10", adjustment: 0.21 },
            { name: "Kapitän-Borgwardt-Weg 5-9", adjustment: 0.21 },
            { name: "Kapitän-Borgwardt-Weg 11", adjustment: 0.00 },
            { name: "Kapitän-Borgwardt-Weg 11a", adjustment: 0.21 },
            { name: "Kapitän-Borgwardt-Weg 12", adjustment: 0.00 },
            { name: "Kapitän-Borgwardt-Weg 13-15a", adjustment: 0.00 },
            { name: "Kapitän-Hahn-Weg", adjustment: 0.00 },
            { name: "Kapitän-Kraeplin-Weg 2-6", adjustment: 0.00 },
            { name: "Kapitän-Kraeplin-Weg 3-5a", adjustment: 0.00 },
            { name: "Kapitän-Kraeplin-Weg 10", adjustment: 0.70 },
            { name: "Kapitänsring", adjustment: 0.00 },
            { name: "Karl-Marx-Str.", adjustment: 0.32 },
            { name: "Karl-Theodor-Severin-Str.", adjustment: -1.15 },
            { name: "Karlshöfer Weg", adjustment: 0.00 },
            { name: "Karlstr.", adjustment: 0.81 },
            { name: "Karnickelweg", adjustment: 0.00 },
            { name: "Kasper-Möhme-Weg", adjustment: 0.00 },
            { name: "Kasper-Ohm-Weg", adjustment: 0.00 },
            { name: "Kassebohm-Kiesgrube", adjustment: 0.00 },
            { name: "Kassebohmer Weg", adjustment: 0.00 },
            { name: "Kastanienweg", adjustment: -0.94 },
            { name: "Katamaramweg 1-7", adjustment: 0.00 },
            { name: "Katamaramweg 2-8", adjustment: 0.00 },
            { name: "Katamaramweg 9", adjustment: 0.21 },
            { name: "Katamaramweg 10", adjustment: 0.21 },
            { name: "Katamaramweg 11-13", adjustment: 0.00 },
            { name: "Katamaramweg 12-14", adjustment: 0.00 },
            { name: "Kate-Diehn-Bitt-Weg", adjustment: 0.00 },
            { name: "Katergang", adjustment: 1.44 },
            { name: "Katerweg", adjustment: 0.00 },
            { name: "Katharinenstr.", adjustment: -0.94 },
            { name: "Katt-un-Mus-Weg", adjustment: 0.00 },
            { name: "Kaulbachstr. 1", adjustment: 0.70 },
            { name: "Kaulbachstr. 1a", adjustment: 0.21 },
            { name: "Kaulbachstr. 2-4b", adjustment: 0.21 },
            { name: "Kaulbachstr. 3", adjustment: 0.00 },
            { name: "Kaulbachstr. 3a-5", adjustment: 0.21 },
            { name: "Kaulbachstr. 6", adjustment: 0.70 },
            { name: "Kaulbachstr. 7", adjustment: 0.70 },
            { name: "Kehrwieder", adjustment: 1.05 },
            { name: "Kempowski-Ufer", adjustment: 1.20 },
            { name: "Kessiner Weg", adjustment: 0.00 },
            { name: "Kiebitzberg", adjustment: 0.84 },
            { name: "Kiefernweg", adjustment: 0.00 },
            { name: "Kieler Str.", adjustment: 0.32 },
            { name: "Kiewittweg", adjustment: 0.00 },
            { name: "Kirchenplatz 1", adjustment: 1.44 },
            { name: "Kirchenplatz 2", adjustment: 1.44 },
            { name: "Kirchenplatz 3-7b", adjustment: 1.23 },
            { name: "Kirchenplatz 4-8a", adjustment: 1.23 },
            { name: "Kirchenplatz 9-13a", adjustment: 1.44 },
            { name: "Kirchenplatz 10-12", adjustment: 1.44 },
            { name: "Kirchenplatz 14", adjustment: 1.23 },
            { name: "Kirchenstr. (KTV)", adjustment: 0.84 },
            { name: "Kirchenstr. (Warnemünde) 1", adjustment: 1.44 },
            { name: "Kirchenstr. (Warnemünde) 1a", adjustment: 1.93 },
            { name: "Kirchenstr. (Warnemünde) 2-4", adjustment: 1.44 },
            { name: "Kirchenstr. (Warnemünde) 3", adjustment: 1.44 },
            { name: "Kirchnerstr.", adjustment: 1.23 },
            { name: "Kirchsteig", adjustment: 0.00 },
            { name: "Kirschenweg", adjustment: 0.00 },
            { name: "Kistenmacherstr.", adjustment: 0.50 },
            { name: "Klagenfurter Str.", adjustment: 0.00 },
            { name: "Klas-Klasen-Weg", adjustment: 0.00 },
            { name: "Klaus-Groth-Str. 1", adjustment: 0.00 },
            { name: "Klaus-Groth-Str. 1a-3a", adjustment: 0.21 },
            { name: "Klaus-Groth-Str. 2-2c", adjustment: 0.21 },
            { name: "Klaus-Groth-Str. 2d", adjustment: 0.70 },
            { name: "Klaus-Groth-Str. 2e", adjustment: 0.21 },
            { name: "Klaus-Groth-Str. 2f-2g", adjustment: 0.70 },
            { name: "Klaus-Groth-Str. 2w-6", adjustment: 0.21 },
            { name: "Klaus-Groth-Str. 5-5a", adjustment: 0.00 },
            { name: "Klein Lichtenhäger Weg", adjustment: -0.73 },
            { name: "Klein Schwäßer Weg", adjustment: -0.65 },
            { name: "Klein Stover Weg", adjustment: -0.65 },
            { name: "Kleine Goldstr.", adjustment: 0.81 },
            { name: "Kleine Mönchenstr.", adjustment: 0.71 },
            { name: "Kleine Wasserstr.", adjustment: 0.81 },
            { name: "Kleiner Katthagen", adjustment: 0.50 },
            { name: "Kleiner Sommerweg 1-3", adjustment: 1.93 },
            { name: "Kleiner Sommerweg 2-6", adjustment: 1.93 },
            { name: "Kleiner Sommerweg 5", adjustment: 1.44 },
            { name: "Kleiner Sommerweg 7", adjustment: 1.93 },
            { name: "Kleiner Sommerweg 8-16", adjustment: 1.44 },
            { name: "Kleiner Sommerweg 9-15", adjustment: 1.44 },
            { name: "Kleiner Warnowdamm 1a-17", adjustment: -0.91 },
            { name: "Kleiner Warnowdamm 4-16", adjustment: -0.91 },
            { name: "Kleiner Warnowdamm 18", adjustment: -0.21 },
            { name: "Kleiner Warnowdamm 19", adjustment: -0.89 },
            { name: "Kleiner Warnowdamm 20-32", adjustment: -0.91 },
            { name: "Kleiner Warnowdamm 21-31", adjustment: -0.91 },
            { name: "Klinikberg", adjustment: -0.68 },
            { name: "Klockenbrink", adjustment: -0.91 },
            { name: "Klopstockstr.", adjustment: 0.84 },
            { name: "Klosterbachstr.", adjustment: 0.84 },
            { name: "Klosterhof", adjustment: 0.50 },
            { name: "Klützer Str.", adjustment: -0.73 },
            { name: "Klüverweg", adjustment: 0.00 },
            { name: "Knallerballerweg", adjustment: 0.00 },
            { name: "Knud-Rasmussen-Str.", adjustment: -0.66 },
            { name: "Kobertstr.", adjustment: 0.32 },
            { name: "Koch-Gotha-Str.", adjustment: 0.81 },
            { name: "Koggenweg 1-5", adjustment: 0.00 },
            { name: "Koggenweg 2-6", adjustment: 0.00 },
            { name: "Koggenweg 7-9", adjustment: 0.21 },
            { name: "Koggenweg 8-10", adjustment: 0.21 },
            { name: "Kolonie Hellberg", adjustment: 0.00 },
            { name: "Kolumbusring", adjustment: -0.89 },
            { name: "Konrad-Adenauer-Platz", adjustment: 0.81 },
            { name: "Konrad-Zuse-Str.", adjustment: 2.61 },
            { name: "Kopenhagener Str.", adjustment: -0.56 },
            { name: "Kopernikusstr. 1", adjustment: 0.32 },
            { name: "Kopernikusstr. 1a-1b", adjustment: 0.00 },
            { name: "Kopernikusstr. 2-16a", adjustment: 0.32 },
            { name: "Kopernikusstr. 3-17e", adjustment: 0.32 },
            { name: "Kopernikusstr. 18-40", adjustment: 0.00 },
            { name: "Kopernikusstr. 19-39", adjustment: 0.00 },
            { name: "Koppelsollstr.", adjustment: 0.00 },
            { name: "Koppelweg", adjustment: -0.56 },
            { name: "Korf-Beggerow-Weg", adjustment: 0.00 },
            { name: "Korf-Witt-Weg", adjustment: 0.00 },
            { name: "Kornblumenweg", adjustment: 0.00 },
            { name: "Korseltstr.", adjustment: 0.00 },
            { name: "Kosegartenstr.", adjustment: 0.32 },
            { name: "Kotfielderstr. 1-9", adjustment: 0.50 },
            { name: "Kotfielderstr. 2-8", adjustment: 0.50 },
            { name: "Kotfielderstr. 10-24", adjustment: 0.71 },
            { name: "Kotfielderstr. 11-15", adjustment: 0.71 },
            { name: "Kotfielderstr. 17-19", adjustment: 1.20 },
            { name: "Kotfielderstr. 21-23", adjustment: 0.71 },
            { name: "Kotfielderstr. 25-27", adjustment: 0.50 },
            { name: "Kotfielderstr. 26-28", adjustment: 0.50 },
            { name: "Kranichhof 1-9", adjustment: -0.94 },
            { name: "Kranichhof 2-10", adjustment: -0.94 },
            { name: "Kranichhof 11-13", adjustment: -0.73 },
            { name: "Kranichhof 12", adjustment: -0.73 },
            { name: "Kranichweg", adjustment: -0.66 },
            { name: "Kreingenweg", adjustment: 0.00 },
            { name: "Kringelhof", adjustment: -0.65 },
            { name: "Kringelweg", adjustment: 0.00 },
            { name: "Krischanweg", adjustment: 0.00 },
            { name: "Krummendorfer Str. 1-9c", adjustment: -0.94 },
            { name: "Krummendorfer Str. 2-14", adjustment: -0.94 },
            { name: "Krummendorfer Str. 9f", adjustment: 0.00 },
            { name: "Krummendorfer Str. 11-15", adjustment: -0.94 },
            { name: "Krämerstr. 1-5", adjustment: 0.81 },
            { name: "Krämerstr. 2-4", adjustment: 0.81 },
            { name: "Krämerstr. 6-10", adjustment: 0.50 },
            { name: "Krämerstr. 7-9", adjustment: 0.50 },
            { name: "Kräwtweg", adjustment: 0.84 },
            { name: "Krönkenhagen", adjustment: 0.71 },
            { name: "Kröpeliner Str.", adjustment: 0.50 },
            { name: "Kufsteiner Str.", adjustment: 0.00 },
            { name: "Kuhstr.", adjustment: 0.50 },
            { name: "Kunkeldanweg", adjustment: 0.00 },
            { name: "Kuphalstr. 1-13", adjustment: 0.21 },
            { name: "Kuphalstr. 2-16", adjustment: 0.21 },
            { name: "Kuphalstr. 15-77", adjustment: 0.00 },
            { name: "Kuphalstr. 18-76", adjustment: 0.00 },
            { name: "Kuphalstr. 77a", adjustment: 0.21 },
            { name: "Kuphalstr. 78", adjustment: 0.21 },
            { name: "Kuphalstr. 79", adjustment: 0.70 },
            { name: "Kuphalstr. 80", adjustment: 0.70 },
            { name: "Kurhausstr. 1-3", adjustment: 1.44 },
            { name: "Kurhausstr. 2", adjustment: 1.44 },
            { name: "Kurhausstr. 4-12a", adjustment: 1.23 },
            { name: "Kurhausstr. 5-13", adjustment: 1.23 },
            { name: "Kurhausstr. 17", adjustment: 1.44 },
            { name: "Kurhausstr. 18", adjustment: 1.44 },
            { name: "Kurt-Dunkelmann-Str. 1-9", adjustment: 2.61 },
            { name: "Kurt-Dunkelmann-Str. 2-4", adjustment: 2.61 },
            { name: "Kurt-Dunkelmann-Str. 6-10", adjustment: 2.12 },
            { name: "Kurt-Schumacher-Ring", adjustment: -1.15 },
            { name: "Kurt-Tucholsky-Str.", adjustment: 0.00 },
            { name: "Kurze Str.", adjustment: 0.81 },
            { name: "Kutterweg", adjustment: 0.21 },
            { name: "Kämmereistr.", adjustment: 0.84 },
            { name: "Käppen-Pött-Weg", adjustment: 0.00 },
            { name: "Kärntner Str.", adjustment: 0.00 },
            { name: "Käthe-Miethe-Str.", adjustment: -0.66 },
            { name: "Kölner Str.", adjustment: 0.32 },
            { name: "Köster-Klickermann-Weg", adjustment: 0.00 },
            { name: "Köster-Suhr-Weg", adjustment: 0.00 },
            { name: "Kösterbecker Weg", adjustment: 0.00 },
            { name: "Kösters Hof", adjustment: 0.00 },
            { name: "Kühlungsborner Str.", adjustment: -0.73 },
            { name: "Küterbruch", adjustment: 0.81 },
            { name: "Laakstr.", adjustment: 1.23 },
            { name: "Lagerlöfstr.", adjustment: -0.66 },
            { name: "Lagerstr. 7-9", adjustment: 0.50 },
            { name: "Lagerstr. 8-10", adjustment: 0.50 },
            { name: "Lagerstr. 11-17", adjustment: 0.71 },
            { name: "Lagerstr. 14-16", adjustment: 0.71 },
            { name: "Lagerstr. 18-26", adjustment: 1.20 },
            { name: "Lagerstr. 23", adjustment: 1.20 },
            { name: "Lagerstr. 27-37", adjustment: 0.71 },
            { name: "Lagerstr. 28-38", adjustment: 0.71 },
            { name: "Lagerstr. 39-45", adjustment: 0.50 },
            { name: "Lagerstr. 40-44", adjustment: 0.50 },
            { name: "Landreiterstr. 1-1b", adjustment: 0.00 },
            { name: "Landreiterstr. 2", adjustment: 0.00 },
            { name: "Landreiterstr. 2a-4", adjustment: 0.21 },
            { name: "Landreiterstr. 3-5a", adjustment: 0.21 },
            { name: "Landreiterstr. 6-8", adjustment: 0.70 },
            { name: "Landreiterstr. 7-9", adjustment: 0.70 },
            { name: "Landreiterstr. 10-12", adjustment: 0.21 },
            { name: "Landreiterstr. 11", adjustment: 0.21 },
            { name: "Landreiterstr. 13", adjustment: 0.00 },
            { name: "Landreiterstr. 14", adjustment: 0.00 },
            { name: "Lange Liete", adjustment: -0.65 },
            { name: "Lange Str.", adjustment: 0.50 },
            { name: "Langenort 1-1b", adjustment: 0.70 },
            { name: "Langenort 2-2a", adjustment: 0.70 },
            { name: "Langenort 3-5", adjustment: 0.21 },
            { name: "Langenort 4-6", adjustment: 0.21 },
            { name: "Langenort 7-11", adjustment: 0.00 },
            { name: "Langenort 8-12", adjustment: 0.00 },
            { name: "Langenort 13", adjustment: 0.21 },
            { name: "Langenort 14", adjustment: 0.70 },
            { name: "Langenort 15-15a", adjustment: 0.70 },
            { name: "Langenort 16-50", adjustment: 0.00 },
            { name: "Langenort 19-49", adjustment: 0.00 },
            { name: "Langenort 51-55", adjustment: 0.21 },
            { name: "Langenort 52-56", adjustment: 0.21 },
            { name: "Langenort Hufe", adjustment: 0.00 },
            { name: "Lastadie", adjustment: 0.50 },
            { name: "Laurembergstr.", adjustment: 0.32 },
            { name: "Leibnizplatz", adjustment: 0.81 },
            { name: "Leo-Tolstoi-Str.", adjustment: -0.66 },
            { name: "Leonhardtstr.", adjustment: 0.84 },
            { name: "Lessingstr.", adjustment: 0.81 },
            { name: "Lewarkweg", adjustment: 0.00 },
            { name: "Libellenweg", adjustment: -0.66 },
            { name: "Lichtenhäger Brink", adjustment: -0.73 },
            { name: "Lichtenhäger Chaussee", adjustment: -0.56 },
            { name: "Liebherrstr.", adjustment: 0.00 },
            { name: "Ligusterweg 1-1a", adjustment: -0.24 },
            { name: "Ligusterweg 2", adjustment: -0.73 },
            { name: "Ligusterweg 6-12", adjustment: -0.94 },
            { name: "Ligusterweg 9", adjustment: -0.94 },
            { name: "Likedeelerhof", adjustment: -0.91 },
            { name: "Lilienthalstr. 1", adjustment: 1.44 },
            { name: "Lilienthalstr. 2", adjustment: 1.44 },
            { name: "Lilienthalstr. 3-23", adjustment: 1.23 },
            { name: "Lilienthalstr. 4-24", adjustment: 1.23 },
            { name: "Lilienthalstr. 25", adjustment: 1.44 },
            { name: "Lilienthalstr. 25a", adjustment: 1.23 },
            { name: "Lilienthalstr. 26", adjustment: 1.44 },
            { name: "Lindenallee", adjustment: -0.94 },
            { name: "Lindenbergstr.", adjustment: 0.81 },
            { name: "Lindenstr.", adjustment: 0.81 },
            { name: "Liningweg", adjustment: 0.00 },
            { name: "Linzer Str. 21", adjustment: 0.00 },
            { name: "Linzer Str. 22-36", adjustment: 0.21 },
            { name: "Linzer Str. 23-37", adjustment: 0.21 },
            { name: "Lisa-Tetzner-Weg", adjustment: -0.66 },
            { name: "Lise-Meitner-Ring", adjustment: 0.00 },
            { name: "Liselotte-Herrmann-Str.", adjustment: 0.00 },
            { name: "Liskowstr.", adjustment: 0.32 },
            { name: "Loggerweg", adjustment: 1.51 },
            { name: "Lohgerberstr. 1-5", adjustment: 1.02 },
            { name: "Lohgerberstr. 2-4", adjustment: 1.02 },
            { name: "Lohgerberstr. 6-32", adjustment: 0.81 },
            { name: "Lohgerberstr. 7-31", adjustment: 0.81 },
            { name: "Lohgerberstr. 33-37", adjustment: 1.02 },
            { name: "Lohgerberstr. 34-36", adjustment: 1.02 },
            { name: "Lohmühlenweg", adjustment: 0.84 },
            { name: "Lomonossowstr.", adjustment: 0.00 },
            { name: "Lorenzstr.", adjustment: -1.15 },
            { name: "Lortzingstr. (Reutershagen)", adjustment: 0.00 },
            { name: "Lortzingstr. (Warnemünde) 1-9", adjustment: 1.23 },
            { name: "Lortzingstr. (Warnemünde) 2-10", adjustment: 1.23 },
            { name: "Lortzingstr. (Warnemünde) 11-11b", adjustment: 1.44 },
            { name: "Lortzingstr. (Warnemünde) 12", adjustment: 1.44 },
            { name: "Lortzingstr. (Warnemünde) 12a-14a", adjustment: 1.23 },
            { name: "Lortzingstr. (Warnemünde) 14b-14c", adjustment: 1.44 },
            { name: "Lortzingstr. (Warnemünde) 15-21", adjustment: 1.23 },
            { name: "Lortzingstr. (Warnemünde) 16-20", adjustment: 1.23 },
            { name: "Louis-Pasteur-Str.", adjustment: 0.00 },
            { name: "Ludwig-Feuerbach-Weg", adjustment: 0.00 },
            { name: "Ludwig-Krause-Str.", adjustment: 0.00 },
            { name: "Ludwigsluster Str.", adjustment: -0.73 },
            { name: "Ludwigstr.", adjustment: 0.81 },
            { name: "Luise-Otto-Peters-Ring", adjustment: -0.66 },
            { name: "Luise-Reuter-Ring", adjustment: 0.00 },
            { name: "Luisenstr. (KTV)", adjustment: 0.84 },
            { name: "Luisenstr. (Warnemünde)", adjustment: 1.44 },
            { name: "Luten-Bohn-Weg", adjustment: 0.00 },
            { name: "Luttermannstr.", adjustment: 0.81 },
            { name: "Lärchenweg", adjustment: 0.00 },
            { name: "Läuschenweg", adjustment: 0.00 },
            { name: "Löwenzahnweg", adjustment: 0.00 },
            { name: "Lübecker Str. 1", adjustment: 0.84 },
            { name: "Lübecker Str. 1a", adjustment: 1.54 },
            { name: "Lübecker Str. 1b-1f", adjustment: 1.05 },
            { name: "Lübecker Str. 2-26", adjustment: 0.84 },
            { name: "Lübecker Str. 3-25", adjustment: 0.84 },
            { name: "Lübecker Str. 30-32", adjustment: 2.12 },
            { name: "Lübecker Str. 31", adjustment: 2.12 },
            { name: "Lübecker Str. 160", adjustment: 1.91 },
            { name: "Lübzer Str.", adjustment: -0.73 },
            { name: "Lüneburger Str.", adjustment: 0.32 },
            { name: "Lütten Enn 1-3", adjustment: -0.70 },
            { name: "Lütten Enn 2", adjustment: -0.70 },
            { name: "Lütten Enn 4-8", adjustment: -0.21 },
            { name: "Lütten Enn 5-7", adjustment: -0.21 },
            { name: "Lütten Enn 9-9b", adjustment: -0.70 },
            { name: "Lütten Enn 10-10d", adjustment: -0.70 },
            { name: "Lütten Enn 11", adjustment: -0.91 },
            { name: "Lütten Enn 12", adjustment: -0.91 },
            { name: "Maiglöckchenweg", adjustment: -0.94 },
            { name: "Maikäferweg", adjustment: 0.00 },
            { name: "Majakowskistr.", adjustment: 0.00 },
            { name: "Malchiner Str.", adjustment: -0.73 },
            { name: "Malmöer Str.", adjustment: -0.56 },
            { name: "Mamsell-Westphalen-Weg", adjustment: 0.00 },
            { name: "Margaret-Mitchell-Str.", adjustment: -0.66 },
            { name: "Margaretenstr.", adjustment: 0.84 },
            { name: "Margeritenweg", adjustment: 0.00 },
            { name: "Marie-Bloch-Str.", adjustment: 0.00 },
            { name: "Marieneher Str. 1-23", adjustment: -0.89 },
            { name: "Marieneher Str. 4", adjustment: -0.68 },
            { name: "Marieneher Str. 4a-16", adjustment: -0.89 },
            { name: "Marienroggenweg", adjustment: -0.94 },
            { name: "Mariken-un-Jehann-Weg", adjustment: 0.00 },
            { name: "Maritimstr. 1", adjustment: 0.70 },
            { name: "Maritimstr. 3", adjustment: 0.00 },
            { name: "Markgrafenheider Str.", adjustment: 0.00 },
            { name: "Martin-Andersen-Nexö-Ring", adjustment: -0.66 },
            { name: "Martin-Luther-King-Allee", adjustment: -0.94 },
            { name: "Martin-Niemöller-Str.", adjustment: -0.94 },
            { name: "Mathias-Thesen-Str.", adjustment: 0.00 },
            { name: "Matrosenweg", adjustment: 0.00 },
            { name: "Maulwurfweg", adjustment: 0.00 },
            { name: "Max-Garthe-Str.", adjustment: 0.00 },
            { name: "Max-Maddalena-Str.", adjustment: 0.00 },
            { name: "Max-Planck-Str.", adjustment: 0.00 },
            { name: "Max-Reichpietsch-Str.", adjustment: 0.00 },
            { name: "Max-von-Laue-Str.", adjustment: 0.00 },
            { name: "Maxie-Wander-Ring", adjustment: -0.66 },
            { name: "Maxim-Gorki-Str.", adjustment: -0.66 },
            { name: "Maßmannstr.", adjustment: 0.84 },
            { name: "Mecklenburger Allee", adjustment: -0.73 },
            { name: "Meisenweg", adjustment: 0.00 },
            { name: "Mendelejewstr.", adjustment: 0.00 },
            { name: "Messestr.", adjustment: -0.66 },
            { name: "Meyers Hausstelle", adjustment: 0.00 },
            { name: "Mittelweg", adjustment: 1.23 },
            { name: "Modersohn-Becker-Weg", adjustment: 0.00 },
            { name: "Mohnblumenweg", adjustment: 0.00 },
            { name: "Molkenstr.", adjustment: 0.81 },
            { name: "Moordieck", adjustment: 0.00 },
            { name: "Mozartstr. (Reutershagen) 1-25", adjustment: 0.00 },
            { name: "Mozartstr. (Reutershagen) 2-24", adjustment: 0.00 },
            { name: "Mozartstr. (Reutershagen) 26-30a", adjustment: 0.21 },
            { name: "Mozartstr. (Reutershagen) 27-29", adjustment: 0.21 },
            { name: "Mozartstr. (Reutershagen) 31-47a", adjustment: 0.00 },
            { name: "Mozartstr. (Reutershagen) 32-46", adjustment: 0.00 },
            { name: "Mozartstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Mudder-Schulten-Weg", adjustment: 0.00 },
            { name: "Mälzereistr. 1", adjustment: 0.00 },
            { name: "Mälzereistr. 1a", adjustment: 0.21 },
            { name: "Möhlenkamp", adjustment: -0.73 },
            { name: "Möller-Voß-Weg", adjustment: 0.00 },
            { name: "Möllner Str. 1-11", adjustment: -0.73 },
            { name: "Möllner Str. 2-12a", adjustment: -0.73 },
            { name: "Möllner Str. 12b", adjustment: -0.56 },
            { name: "Möllner Str. 12c", adjustment: -0.73 },
            { name: "Möllner Str. 13-13a", adjustment: -0.56 },
            { name: "Mörlkeweg", adjustment: 0.00 },
            { name: "Möwenweg 1-7", adjustment: 0.21 },
            { name: "Möwenweg 2-6", adjustment: 0.21 },
            { name: "Möwenweg 8", adjustment: 0.70 },
            { name: "Möwenweg 9", adjustment: 0.70 },
            { name: "Möwenweg 10-16", adjustment: 0.21 },
            { name: "Möwenweg 11-15", adjustment: 0.21 },
            { name: "Möwenweg 17", adjustment: 0.00 },
            { name: "Mühlenberg", adjustment: 0.00 },
            { name: "Mühlendamm 4-8b", adjustment: 1.51 },
            { name: "Mühlendamm 5-7", adjustment: 1.51 },
            { name: "Mühlendamm 15", adjustment: 0.21 },
            { name: "Mühlendamm 16", adjustment: 0.21 },
            { name: "Mühlendamm 19-31", adjustment: 0.00 },
            { name: "Mühlendamm 20a-32", adjustment: 0.00 },
            { name: "Mühlendamm 32a", adjustment: 0.21 },
            { name: "Mühlendamm 32b", adjustment: 0.00 },
            { name: "Mühlendamm 32c-34a", adjustment: 0.21 },
            { name: "Mühlendamm 33-33a", adjustment: 0.21 },
            { name: "Mühlendamm 33b-35", adjustment: 0.70 },
            { name: "Mühlendamm 34b-34f", adjustment: 0.70 },
            { name: "Mühlendamm 34g", adjustment: 0.21 },
            { name: "Mühlendamm 34h-34p", adjustment: 0.70 },
            { name: "Mühlendamm 35b-37", adjustment: 1.51 },
            { name: "Mühlendamm 36", adjustment: 1.51 },
            { name: "Mühlenstr. (Evershagen)", adjustment: -0.66 },
            { name: "Mühlenstr. (Stadtmitte) 1-7", adjustment: 1.02 },
            { name: "Mühlenstr. (Stadtmitte) 2-6", adjustment: 1.02 },
            { name: "Mühlenstr. (Stadtmitte) 8-12", adjustment: 0.81 },
            { name: "Mühlenstr. (Stadtmitte) 9-13", adjustment: 0.81 },
            { name: "Mühlenstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Nelkenweg", adjustment: 0.00 },
            { name: "Nelly-Sachs-Ring", adjustment: -0.66 },
            { name: "Neptunallee 1-1a", adjustment: 1.91 },
            { name: "Neptunallee 2", adjustment: 2.12 },
            { name: "Neptunallee 3", adjustment: 2.12 },
            { name: "Neptunallee 4-8c", adjustment: 2.61 },
            { name: "Neptunallee 5-7f", adjustment: 2.61 },
            { name: "Neptunallee 9-9a", adjustment: 2.12 },
            { name: "Neptunallee 10", adjustment: 2.12 },
            { name: "Neptunblick", adjustment: 1.23 },
            { name: "Neptunweg 1-3", adjustment: 0.21 },
            { name: "Neptunweg 2-4", adjustment: 0.21 },
            { name: "Neptunweg 5-7", adjustment: 0.70 },
            { name: "Neptunweg 6", adjustment: 0.70 },
            { name: "Neptunweg 8-12", adjustment: 0.21 },
            { name: "Neptunweg 9-13", adjustment: 0.21 },
            { name: "Neu Hinrichsdorf", adjustment: 0.00 },
            { name: "Neubramowstr.", adjustment: 0.84 },
            { name: "Neubrandenburger Str. 1a-11a", adjustment: 0.00 },
            { name: "Neubrandenburger Str. 2-34", adjustment: 0.00 },
            { name: "Neubrandenburger Str. 13-13d", adjustment: 0.21 },
            { name: "Neubrandenburger Str. 13e", adjustment: 0.00 },
            { name: "Neubrandenburger Str. 13f", adjustment: 0.21 },
            { name: "Neubrandenburger Str. 13g-13h", adjustment: 0.00 },
            { name: "Neubrandenburger Str. 13k", adjustment: 0.21 },
            { name: "Neubrandenburger Str. 13m", adjustment: 0.70 },
            { name: "Neubrandenburger Str. 15-17", adjustment: 0.00 },
            { name: "Neudierkower Weg 1", adjustment: 0.00 },
            { name: "Neudierkower Weg 2", adjustment: 0.00 },
            { name: "Neudierkower Weg 4-6", adjustment: -0.94 },
            { name: "Neudierkower Weg 5", adjustment: -0.94 },
            { name: "Neue Bleicherstr. 1-5", adjustment: 1.02 },
            { name: "Neue Bleicherstr. 2-6", adjustment: 1.02 },
            { name: "Neue Bleicherstr. 7-15", adjustment: 1.51 },
            { name: "Neue Bleicherstr. 8-12", adjustment: 1.51 },
            { name: "Neue Bleicherstr. 16-22", adjustment: 1.02 },
            { name: "Neue Bleicherstr. 17-21", adjustment: 1.02 },
            { name: "Neue Reihe", adjustment: -0.65 },
            { name: "Neue Werderstr. 1-23", adjustment: 0.84 },
            { name: "Neue Werderstr. 2-24", adjustment: 0.84 },
            { name: "Neue Werderstr. 27-29", adjustment: 1.05 },
            { name: "Neue Werderstr. 28-30", adjustment: 1.05 },
            { name: "Neue Werderstr. 33-35", adjustment: 1.54 },
            { name: "Neue Werderstr. 34", adjustment: 1.54 },
            { name: "Neue Werderstr. 37-41", adjustment: 1.05 },
            { name: "Neue Werderstr. 38-42", adjustment: 1.05 },
            { name: "Neue Werderstr. 43-59", adjustment: 0.84 },
            { name: "Neue Werderstr. 44-54", adjustment: 0.84 },
            { name: "Neuer Markt 1-1a", adjustment: 0.81 },
            { name: "Neuer Markt 2", adjustment: 0.81 },
            { name: "Neuer Markt 3-17", adjustment: 0.50 },
            { name: "Neuer Markt 10-16", adjustment: 0.50 },
            { name: "Neuer Weg", adjustment: 0.00 },
            { name: "Neustreilitzer Str.", adjustment: -0.73 },
            { name: "Nigen Enn", adjustment: -0.91 },
            { name: "Niklotstr.", adjustment: 0.84 },
            { name: "Nobelstr.", adjustment: 0.00 },
            { name: "Nordahl-Grieg-Str.", adjustment: -0.66 },
            { name: "Nüßlerweg", adjustment: 0.00 },
            { name: "Oberhalb d. Gerberbruches 1-3", adjustment: 1.02 },
            { name: "Oberhalb d. Gerberbruches 2", adjustment: 1.51 },
            { name: "Oberhalb d. Gerberbruches 4-8", adjustment: 1.02 },
            { name: "Oberhalb d. Gerberbruches 5", adjustment: 0.81 },
            { name: "Oberhalb d. Gerberbruches 7", adjustment: 1.02 },
            { name: "Oberhalb d. Gerberbruches 8a", adjustment: 0.81 },
            { name: "Oberlose-Voß-Weg 1-3a", adjustment: 0.00 },
            { name: "Oberlose-Voß-Weg 2-2a", adjustment: 0.00 },
            { name: "Oberlose-Voß-Weg 4", adjustment: 0.21 },
            { name: "Oberlose-Voß-Weg 5", adjustment: 0.21 },
            { name: "Oberlose-Voß-Weg 6-20", adjustment: 0.70 },
            { name: "Oberlose-Voß-Weg 7-21", adjustment: 0.70 },
            { name: "Oberlose-Voß-Weg 22-32", adjustment: 0.21 },
            { name: "Oberlose-Voß-Weg 23-31", adjustment: 0.21 },
            { name: "Oewerwischenweg", adjustment: 0.00 },
            { name: "Oldendorfer Str.", adjustment: 0.00 },
            { name: "Oldendorpsstr.", adjustment: 0.32 },
            { name: "Oll-Daniel-Weg", adjustment: 0.00 },
            { name: "Oll-Päsel-Weg", adjustment: 0.00 },
            { name: "Olof-Palme-Str.", adjustment: -0.94 },
            { name: "Osloer Str.", adjustment: -0.56 },
            { name: "Ost-West-Str. 4-12a", adjustment: 0.21 },
            { name: "Ost-West-Str. 5-15", adjustment: 0.21 },
            { name: "Ost-West-Str. 16-32", adjustment: 0.00 },
            { name: "Ost-West-Str. 17-25", adjustment: 0.00 },
            { name: "Ost-West-Str. 31-33", adjustment: 0.21 },
            { name: "Ost-West-Str. 35", adjustment: 0.70 },
            { name: "Ostseeallee", adjustment: -0.56 },
            { name: "Ostseeweg", adjustment: 0.00 },
            { name: "Otternsteig 1", adjustment: 0.00 },
            { name: "Otternsteig 2-4", adjustment: 0.21 },
            { name: "Otternsteig 3-7", adjustment: 0.21 },
            { name: "Otternsteig 8", adjustment: 0.70 },
            { name: "Otternsteig 10", adjustment: 0.21 },
            { name: "Otternweg", adjustment: 0.00 },
            { name: "Ottostr.", adjustment: 0.84 },
            { name: "Pablo-Neruda-Str. 1-25", adjustment: -0.94 },
            { name: "Pablo-Neruda-Str. 2-20", adjustment: -0.94 },
            { name: "Pablo-Neruda-Str. 22", adjustment: 0.00 },
            { name: "Pablo-Neruda-Str. 24-26", adjustment: -0.94 },
            { name: "Pablo-Picasso-Str.", adjustment: -0.94 },
            { name: "Pappelallee", adjustment: -0.94 },
            { name: "Parchimer Str.", adjustment: -0.73 },
            { name: "Parkstr. (Hansaviertel)", adjustment: 0.32 },
            { name: "Parkstr. (Kröpeliner-Tor-Vorstadt)", adjustment: 0.84 },
            { name: "Parkstr. (Warnemünde) 1-25", adjustment: 1.23 },
            { name: "Parkstr. (Warnemünde) 2-26a", adjustment: 1.23 },
            { name: "Parkstr. (Warnemünde) 27-51", adjustment: 1.44 },
            { name: "Parkstr. (Warnemünde) 28-46m", adjustment: 1.44 },
            { name: "Parkstr. (Warnemünde) 48", adjustment: 1.23 },
            { name: "Parkstr. (Warnemünde) 50", adjustment: 1.44 },
            { name: "Parkstr. (Warnemünde) 52", adjustment: 1.93 },
            { name: "Parkstr. (Warnemünde) 53-61", adjustment: 1.93 },
            { name: "Paschenstr. (KTV)", adjustment: 0.84 },
            { name: "Paschenstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Patriotischer Weg 2-60", adjustment: 0.84 },
            { name: "Patriotischer Weg 3-61", adjustment: 0.84 },
            { name: "Patriotischer Weg 62-78", adjustment: 1.05 },
            { name: "Patriotischer Weg 63-77", adjustment: 1.05 },
            { name: "Patriotischer Weg 80-100", adjustment: 0.84 },
            { name: "Patriotischer Weg 81-83", adjustment: 0.84 },
            { name: "Patriotischer Weg 85-85c", adjustment: 1.05 },
            { name: "Patriotischer Weg 87-101", adjustment: 0.84 },
            { name: "Patriotischer Weg 100a-100c", adjustment: 1.05 },
            { name: "Patriotischer Weg 101a-101c", adjustment: 1.05 },
            { name: "Patriotischer Weg 102-110", adjustment: 0.84 },
            { name: "Patriotischer Weg 103-109", adjustment: 0.84 },
            { name: "Patriotischer Weg 111-119a", adjustment: 1.05 },
            { name: "Patriotischer Weg 112-120a", adjustment: 1.05 },
            { name: "Patriotischer Weg 123-135", adjustment: 0.84 },
            { name: "Patriotischer Weg 124-134", adjustment: 0.84 },
            { name: "Paul-Müller-Kaempff-Weg", adjustment: 0.00 },
            { name: "Paul-Wallat-Weg", adjustment: 0.00 },
            { name: "Paulstr.", adjustment: 0.81 },
            { name: "Pawlowstr.", adjustment: 0.00 },
            { name: "Peez", adjustment: 0.00 },
            { name: "Pennings Kuhl", adjustment: -0.65 },
            { name: "Peter-Cornelius-Str.", adjustment: 0.00 },
            { name: "Peter-E.-Erichson-Weg", adjustment: 0.00 },
            { name: "Peter-Kalfr-Str.", adjustment: 0.32 },
            { name: "Peter-Lurenz-Weg", adjustment: 0.00 },
            { name: "Petersdorfer Str. 10", adjustment: -0.94 },
            { name: "Petersdorfer Str. 15-15a", adjustment: -0.94 },
            { name: "Petersdorfer Str. 30", adjustment: 0.00 },
            { name: "Petersdorfer Str. 31", adjustment: 0.00 },
            { name: "Petersdorfer Str. 34-40", adjustment: -0.94 },
            { name: "Petersdorfer Str. 35", adjustment: -0.94 },
            { name: "Petersilienstr.", adjustment: 0.71 },
            { name: "Petridamm 1", adjustment: 0.21 },
            { name: "Petridamm 1a-9", adjustment: 0.00 },
            { name: "Petridamm 2-8", adjustment: 0.00 },
            { name: "Petridamm 9a-11b", adjustment: 0.21 },
            { name: "Petridamm 10-12", adjustment: 0.21 },
            { name: "Petridamm 11c-11d", adjustment: 0.00 },
            { name: "Petridamm 13-13f", adjustment: 0.21 },
            { name: "Petridamm 13h-15", adjustment: 0.00 },
            { name: "Petridamm 14-14e", adjustment: 0.00 },
            { name: "Petridamm 22", adjustment: 0.21 },
            { name: "Petridamm 22a", adjustment: 0.00 },
            { name: "Petridamm 23", adjustment: 0.21 },
            { name: "Petridamm 24-26", adjustment: 0.21 },
            { name: "Pferdestr.", adjustment: 0.81 },
            { name: "Philipp-Brandin-Str.", adjustment: -1.15 },
            { name: "Platz der Freiheit", adjustment: 0.32 },
            { name: "Platz der Freundschaft", adjustment: 0.00 },
            { name: "Platz des Friedens 1-13c", adjustment: 0.00 },
            { name: "Platz des Friedens 2-14c", adjustment: 0.00 },
            { name: "Platz des Friedens 15-21", adjustment: 0.21 },
            { name: "Platz des Friedens 16-20", adjustment: 0.21 },
            { name: "Platz des Friedens 22", adjustment: 0.00 },
            { name: "Platz des Friedens 23", adjustment: 0.00 },
            { name: "Pläterstr.", adjustment: 0.71 },
            { name: "Pöner Str.", adjustment: -0.73 },
            { name: "Poeler Str.", adjustment: -0.73 },
            { name: "Poggemweg", adjustment: 0.00 },
            { name: "Poststr. 1-3c", adjustment: 1.23 },
            { name: "Poststr. 2", adjustment: 1.23 },
            { name: "Poststr. 4-8", adjustment: 1.44 },
            { name: "Poststr. 5-41", adjustment: 1.44 },
            { name: "Poststr. 8a", adjustment: 1.23 },
            { name: "Poststr. 10-40", adjustment: 1.44 },
            { name: "Pressentinstr. 1-11", adjustment: 0.00 },
            { name: "Pressentinstr. 2-82b", adjustment: 0.00 },
            { name: "Pressentinstr. 11a", adjustment: 0.70 },
            { name: "Pressentinstr. 13-81b", adjustment: 0.00 },
            { name: "Primelweg", adjustment: 0.00 },
            { name: "Purbuser Str.", adjustment: -0.73 },
            { name: "Pädagogienstr.", adjustment: 0.50 },
            { name: "Pümperstr.", adjustment: 0.81 },
            { name: "Pütterweg", adjustment: 0.00 },
            { name: "Quartierstr.", adjustment: 0.84 },
            { name: "Querstr. III", adjustment: 1.93 },
            { name: "Querstr. IV", adjustment: 1.93 },
            { name: "Rahenweg", adjustment: 0.00 },
            { name: "Rahnstädter Weg", adjustment: 0.00 },
            { name: "Rapsweg", adjustment: 0.00 },
            { name: "Ratsplatz", adjustment: 0.84 },
            { name: "Ratzeburger Str.", adjustment: -0.73 },
            { name: "Reethruch", adjustment: -0.65 },
            { name: "Reiferweg", adjustment: 0.81 },
            { name: "Rembrandtstr.", adjustment: 0.32 },
            { name: "Rennbahnallee", adjustment: 0.00 },
            { name: "Reriker Str.", adjustment: -0.73 },
            { name: "Reusenweg", adjustment: -0.89 },
            { name: "Reutershäger Weg", adjustment: 0.00 },
            { name: "Ricarda-Huch-Str.", adjustment: -0.66 },
            { name: "Richard-Wagner-Str. (Stadtmitte)", adjustment: 0.81 },
            { name: "Richard-Wagner-Str. (Warnem.)", adjustment: 1.23 },
            { name: "Richtenberger Str.", adjustment: -0.73 },
            { name: "Rickertring", adjustment: 0.00 },
            { name: "Riekdahl", adjustment: 0.00 },
            { name: "Riekdahler Weg", adjustment: 0.00 },
            { name: "Rigaer Str.", adjustment: -0.56 },
            { name: "Rimelsweg", adjustment: 0.00 },
            { name: "Ringelrankenweg", adjustment: 0.00 },
            { name: "Roald-Amundsen-Str.", adjustment: -0.89 },
            { name: "Robbenweg", adjustment: 0.00 },
            { name: "Robert-Beltz-Weg", adjustment: 0.00 },
            { name: "Robert-Koch-Str.", adjustment: 0.00 },
            { name: "Robert-Schumann-Str.", adjustment: 0.00 },
            { name: "Robinienweg", adjustment: 0.00 },
            { name: "Rodompweg", adjustment: 0.00 },
            { name: "Roggentiner Weg", adjustment: 0.00 },
            { name: "Rosa-Luxemburg-Str.", adjustment: 0.81 },
            { name: "Rosenweg", adjustment: 0.00 },
            { name: "Rostocker Heide", adjustment: 0.50 },
            { name: "Rostocker Str. 1-3", adjustment: 1.23 },
            { name: "Rostocker Str. 2-4", adjustment: 1.23 },
            { name: "Rostocker Str. 4a-4e", adjustment: 1.44 },
            { name: "Rostocker Str. 5", adjustment: 1.44 },
            { name: "Rostocker Str. 6-10", adjustment: 1.93 },
            { name: "Rostocker Str. 9", adjustment: 1.93 },
            { name: "Rostocker Str. 11-13", adjustment: 1.44 },
            { name: "Rostocker Str. 12-12b", adjustment: 1.44 },
            { name: "Rostocker Str. 14-30", adjustment: 1.23 },
            { name: "Rostocker Str. 15-29", adjustment: 1.23 },
            { name: "Rostocker Str. 40", adjustment: 0.00 },
            { name: "Rotdornweg", adjustment: 1.23 },
            { name: "Rote-Burg-Graben", adjustment: 0.00 },
            { name: "Rudenweg", adjustment: 0.00 },
            { name: "Rudolf-Bartels-Weg", adjustment: 0.00 },
            { name: "Rudolf-Breitscheid-Str.", adjustment: 0.00 },
            { name: "Rudolf-Diesel-Str.", adjustment: 0.00 },
            { name: "Rudolf-Tarnow-Str.", adjustment: 0.00 },
            { name: "Rungestr.", adjustment: 0.50 },
            { name: "Röntgenstr.", adjustment: 0.00 },
            { name: "Röthsoll", adjustment: 0.00 },
            { name: "Rövershäger Chaussee 1", adjustment: 0.70 },
            { name: "Rövershäger Chaussee 2-4a", adjustment: 0.00 },
            { name: "Rövershäger Chaussee 3-5", adjustment: 0.00 },
            { name: "Rövershäger Chaussee 11", adjustment: -1.15 },
            { name: "Rügener Str.", adjustment: -0.56 },
            { name: "Sackpfeife", adjustment: 0.81 },
            { name: "Salvador-Allende-Str. 1-3", adjustment: -0.73 },
            { name: "Salvador-Allende-Str. 2", adjustment: -0.73 },
            { name: "Salvador-Allende-Str. 4-34", adjustment: -0.94 },
            { name: "Salvador-Allende-Str. 5-35", adjustment: -0.94 },
            { name: "Salvador-Allende-Str. 40-46", adjustment: -0.73 },
            { name: "Salvador-Allende-Str. 41-47", adjustment: -0.73 },
            { name: "Salzburger Str.", adjustment: 0.00 },
            { name: "Sanddornweg 5", adjustment: -0.24 },
            { name: "Sanddornweg 6", adjustment: -0.73 },
            { name: "Sassnitzer Str.", adjustment: -0.56 },
            { name: "Satower Str. 1-55a", adjustment: 0.00 },
            { name: "Satower Str. 2-166", adjustment: 0.00 },
            { name: "Satower Str. 55b", adjustment: -0.65 },
            { name: "Satower Str. 55c-163", adjustment: 0.00 },
            { name: "Schachtelhalmweg", adjustment: 0.00 },
            { name: "Schafgarbenweg", adjustment: 0.00 },
            { name: "Schafweidenweg", adjustment: 0.81 },
            { name: "Schenkendorfweg", adjustment: 0.00 },
            { name: "Schiffbauerring", adjustment: -0.91 },
            { name: "Schillerplatz", adjustment: 0.81 },
            { name: "Schillerstr. (Stadtmitte)", adjustment: 0.81 },
            { name: "Schillerstr. (Warnemünde) 1-3", adjustment: 1.44 },
            { name: "Schillerstr. (Warnemünde) 2", adjustment: 1.44 },
            { name: "Schillerstr. (Warnemünde) 4-10g", adjustment: 1.23 },
            { name: "Schillerstr. (Warnemünde) 5-11", adjustment: 1.23 },
            { name: "Schillerstr. (Warnemünde) 11a", adjustment: 1.44 },
            { name: "Schillerstr. (Warnemünde) 12-14", adjustment: 1.44 },
            { name: "Schillingallee", adjustment: 0.32 },
            { name: "Schlachthofstr.", adjustment: 1.91 },
            { name: "Schlehenweg 1-3", adjustment: -0.73 },
            { name: "Schlehenweg 2-4", adjustment: -0.73 },
            { name: "Schlehenweg 5", adjustment: -0.94 },
            { name: "Schlehenweg 6", adjustment: -0.94 },
            { name: "Schleswiger Str.", adjustment: -0.73 },
            { name: "Schliemannstr.", adjustment: 0.32 },
            { name: "Schmart-Dorf 10-12", adjustment: -0.68 },
            { name: "Schmart-Dorf 11", adjustment: -0.68 },
            { name: "Schmart-Dorf 12a-16a", adjustment: -0.19 },
            { name: "Schmart-Dorf 13-15i", adjustment: -0.19 },
            { name: "Schmart-Dorf 17-19", adjustment: -0.68 },
            { name: "Schmart-Dorf 18-18h", adjustment: -0.68 },
            { name: "Schmart-Dorf 19a", adjustment: -0.19 },
            { name: "Schmart-Dorf 20", adjustment: 0.70 },
            { name: "Schmart-Dorf 21", adjustment: 0.70 },
            { name: "Schmart-Dorf 40", adjustment: -0.68 },
            { name: "Schmarler Damm", adjustment: -0.89 },
            { name: "Schmarler Landgang", adjustment: -0.89 },
            { name: "Schmetterlingsweg", adjustment: -0.66 },
            { name: "Schmatermann", adjustment: 0.21 },
            { name: "Schnickmannstr. 1", adjustment: 0.50 },
            { name: "Schnickmannstr. 2", adjustment: 0.50 },
            { name: "Schnickmannstr. 4-10", adjustment: 0.71 },
            { name: "Schnickmannstr. 5-11", adjustment: 0.71 },
            { name: "Schnickmannstr. 12-14", adjustment: 0.50 },
            { name: "Schnickmannstr. 13", adjustment: 0.50 },
            { name: "Schonenfahrerstr. 1-3", adjustment: 1.91 },
            { name: "Schonenfahrerstr. 2", adjustment: 1.91 },
            { name: "Schonenfahrerstr. 4", adjustment: 2.12 },
            { name: "Schonenfahrerstr. 5", adjustment: 2.12 },
            { name: "Schonenfahrerstr. 6-8a", adjustment: 2.61 },
            { name: "Schonenfahrerstr. 7-7a", adjustment: 2.61 },
            { name: "Schonenfahrerstr. 9", adjustment: 2.12 },
            { name: "Schonenfahrerstr. 9a", adjustment: 2.61 },
            { name: "Schonenfahrerstr. 10", adjustment: 2.12 },
            { name: "Schonenfahrerstr. 11-11b", adjustment: 2.12 },
            { name: "Schonenfahrerstr. 12-12a", adjustment: 1.91 },
            { name: "Schonenfahrerstr. 13", adjustment: 1.91 },
            { name: "Schröderplatz 1-5", adjustment: 0.84 },
            { name: "Schröderplatz 2", adjustment: 0.81 },
            { name: "Schröderplatz 4", adjustment: 0.84 },
            { name: "Schröderstr.", adjustment: 0.81 },
            { name: "Schulenburgstr.", adjustment: 0.00 },
            { name: "Schulstr. (Gehlsdorf)", adjustment: 0.00 },
            { name: "Schulstr. (KTV)", adjustment: 0.84 },
            { name: "Schulstr. (Warnemünde) 1", adjustment: 1.44 },
            { name: "Schulstr. (Warnemünde) 2", adjustment: 1.23 },
            { name: "Schulstr. (Warnemünde) 2a", adjustment: 1.44 },
            { name: "Schulstr. (Warnemünde) 3-5a", adjustment: 1.23 },
            { name: "Schulstr. (Warnemünde) 4-6", adjustment: 1.23 },
            { name: "Schulze-Boysen-Str.", adjustment: 0.00 },
            { name: "Schutower Ringstr.", adjustment: -0.66 },
            { name: "Schutower Str. 1-1a", adjustment: 0.00 },
            { name: "Schutower Str. 2-8", adjustment: -0.66 },
            { name: "Schutower Str. 3-9", adjustment: -0.66 },
            { name: "Schutower Str. 10-14", adjustment: 0.00 },
            { name: "Schutower Str. 11-11a", adjustment: 0.00 },
            { name: "Schwaaner Landstr. 1-7a", adjustment: 0.81 },
            { name: "Schwaaner Landstr. 2-10", adjustment: 0.81 },
            { name: "Schwaaner Landstr. 12-200", adjustment: 0.00 },
            { name: "Schwaaner Landstr. 13a-201", adjustment: 0.00 },
            { name: "Schwansche Str.", adjustment: 0.50 },
            { name: "Schwarzer Weg (Reutershagen)", adjustment: 0.00 },
            { name: "Schwarzer Weg (Warnemünde) 2-22", adjustment: 1.93 },
            { name: "Schwarzer Weg (Warnemünde) 3-17", adjustment: 1.93 },
            { name: "Schwarzer Weg (Warnemünde) 19", adjustment: 1.44 },
            { name: "Schwarzer Weg (Warnemünde) 21", adjustment: 1.93 },
            { name: "Schwarzmoor", adjustment: -0.65 },
            { name: "Schwentnerstr.", adjustment: 0.00 },
            { name: "Schweriner Str. 8-66", adjustment: 0.00 },
            { name: "Schweriner Str. 9-25", adjustment: 0.00 },
            { name: "Schweriner Str. 27", adjustment: 0.21 },
            { name: "Schweriner Str. 37-65", adjustment: 0.00 },
            { name: "Schüttenweg", adjustment: 0.00 },
            { name: "Sebastian-Bach-Str.", adjustment: 0.00 },
            { name: "Seebrauk", adjustment: 1.23 },
            { name: "Seegrasweg", adjustment: 1.23 },
            { name: "Seehundweg", adjustment: 0.00 },
            { name: "Seelotsenring", adjustment: -0.91 },
            { name: "Seelöwenring", adjustment: 0.00 },
            { name: "Seepromenade", adjustment: 1.93 },
            { name: "Seestr. 1-5", adjustment: 1.93 },
            { name: "Seestr. 2-6", adjustment: 1.93 },
            { name: "Seestr. 7-9", adjustment: 1.44 },
            { name: "Seestr. 8-10", adjustment: 1.44 },
            { name: "Seestr. 12-18", adjustment: 1.93 },
            { name: "Seestr. 13-19", adjustment: 1.93 },
            { name: "Segelmacherweg 1-3", adjustment: -0.91 },
            { name: "Segelmacherweg 2-4", adjustment: -0.91 },
            { name: "Segelmacherweg 5-13", adjustment: -0.70 },
            { name: "Segelmakerweg 6-12", adjustment: -0.70 },
            { name: "Segelmacherweg 14-22", adjustment: -0.91 },
            { name: "Segelmacherweg 15-25", adjustment: -0.91 },
            { name: "Seidelstr.", adjustment: 0.32 },
            { name: "Seidenstr.", adjustment: 0.81 },
            { name: "Semmelweisstr.", adjustment: 0.00 },
            { name: "Siegfried-Witte-Str.", adjustment: 0.00 },
            { name: "Siegmannstr.", adjustment: 0.00 },
            { name: "Sievershagener Weg", adjustment: -0.66 },
            { name: "Sildemower Weg", adjustment: -0.65 },
            { name: "Simon-van-Utrecht-Str.", adjustment: 0.21 },
            { name: "Slüterstr. 1-3", adjustment: 1.02 },
            { name: "Slüterstr. 4-8", adjustment: 1.51 },
            { name: "Slüterstr. 9", adjustment: 1.51 },
            { name: "Slüterstr. 10", adjustment: 1.02 },
            { name: "Snider-Voß-Weg", adjustment: 0.00 },
            { name: "Soester Str.", adjustment: 0.32 },
            { name: "Sonnenblumenweg", adjustment: 1.23 },
            { name: "Sparlingsweg", adjustment: 0.00 },
            { name: "Spierenweg", adjustment: 0.00 },
            { name: "Spinnakerweg", adjustment: 0.00 },
            { name: "Spirfixweg", adjustment: 0.00 },
            { name: "Spreenweg", adjustment: 0.00 },
            { name: "Sprengmeisterweg", adjustment: -0.91 },
            { name: "St.-Georg-Str. 1-49b", adjustment: 0.81 },
            { name: "St.-Georg-Str. 2-50", adjustment: 0.81 },
            { name: "St.-Georg-Str. 57-63", adjustment: 0.84 },
            { name: "St.-Georg-Str. 58-62", adjustment: 0.84 },
            { name: "St.-Georg-Str. 63a-111", adjustment: 0.81 },
            { name: "St.-Georg-Str. 66-110", adjustment: 0.81 },
            { name: "St.-Petersburger Str.", adjustment: -0.56 },
            { name: "Stadthafen", adjustment: 0.70 },
            { name: "Stadtweide Reihenhäuser", adjustment: 0.00 },
            { name: "Stadtweide Steinhaus", adjustment: 0.00 },
            { name: "Stadtweider Winkel", adjustment: 0.00 },
            { name: "Stampfmüllerstr.", adjustment: 0.84 },
            { name: "Stangenland", adjustment: 0.00 },
            { name: "Stavenhagener Str.", adjustment: -0.73 },
            { name: "Steinstr. 1", adjustment: 0.81 },
            { name: "Steinstr. 2-6", adjustment: 0.50 },
            { name: "Steinstr. 3-7", adjustment: 0.50 },
            { name: "Steinstr. 9-13", adjustment: 0.81 },
            { name: "Steinstr. 10-12", adjustment: 0.81 },
            { name: "Stellmakerstrat", adjustment: 0.00 },
            { name: "Stephan-Jantzen-Platz", adjustment: 1.93 },
            { name: "Stephan-Jantzen-Ring", adjustment: -0.89 },
            { name: "Stephan-Jantzen-Str.", adjustment: 1.23 },
            { name: "Stephanstr.", adjustment: 0.81 },
            { name: "Sternberger Str.", adjustment: -0.73 },
            { name: "Stettiner Str.", adjustment: -0.73 },
            { name: "Steuerbordstr.", adjustment: 0.70 },
            { name: "Stockholmer Str.", adjustment: -0.56 },
            { name: "Stolteraer Weg", adjustment: 1.23 },
            { name: "Storchenwiese", adjustment: 0.00 },
            { name: "Stralsunder Str.", adjustment: 0.32 },
            { name: "Stranddistelweg", adjustment: 1.23 },
            { name: "Strandstr. 1-3", adjustment: 1.20 },
            { name: "Strandstr. 2-4", adjustment: 1.20 },
            { name: "Strandstr. 11", adjustment: 0.71 },
            { name: "Strandstr. 12", adjustment: 0.71 },
            { name: "Strandstr. 13-31", adjustment: 1.20 },
            { name: "Strandstr. 14-30", adjustment: 1.20 },
            { name: "Strandstr. 32-38", adjustment: 0.71 },
            { name: "Strandstr. 33-39", adjustment: 0.71 },
            { name: "Strandstr. 85-105", adjustment: 1.20 },
            { name: "Strandstr. 86-106", adjustment: 1.20 },
            { name: "Strandweg", adjustment: 1.93 },
            { name: "Strempelstr.", adjustment: 0.32 },
            { name: "Streuwiesenweg", adjustment: 1.23 },
            { name: "Strindbergstr.", adjustment: -0.66 },
            { name: "Stuthof", adjustment: 0.00 },
            { name: "Swienskuhlenstr.", adjustment: 0.00 },
            { name: "Swölkenweg", adjustment: 0.00 },
            { name: "Südring", adjustment: 0.00 },
            { name: "Südstr. III", adjustment: 0.00 },
            { name: "Taklerring", adjustment: -0.91 },
            { name: "Talliner Str.", adjustment: -0.56 },
            { name: "Talstr. 1-la", adjustment: 0.81 },
            { name: "Talstr. 1b-7", adjustment: 1.02 },
            { name: "Talstr. 2-6", adjustment: 1.02 },
            { name: "Talstr. 8-12", adjustment: 0.81 },
            { name: "Talstr. 9-11", adjustment: 0.81 },
            { name: "Tampenweg", adjustment: 0.00 },
            { name: "Tannenweg", adjustment: 0.00 },
            { name: "Taubenweg", adjustment: 0.00 },
            { name: "Tessiner Str.", adjustment: 0.00 },
            { name: "Teterower Str.", adjustment: -0.73 },
            { name: "Theodor-Heuss-Str.", adjustment: -1.15 },
            { name: "Theodor-Körner-Str.", adjustment: -0.66 },
            { name: "Theodor-Storm-Str.", adjustment: -0.66 },
            { name: "Thierfelderstr.", adjustment: 0.32 },
            { name: "Thomas-Mann-Str.", adjustment: 0.81 },
            { name: "Thomas-Morus-Str.", adjustment: -0.66 },
            { name: "Thomas-Müntrer-Platz", adjustment: 0.84 },
            { name: "Thuro-Balzer-Weg", adjustment: 0.00 },
            { name: "Thünenstr.", adjustment: 0.32 },
            { name: "Tiergartenallee 1-5", adjustment: 0.32 },
            { name: "Tiergartenallee 2-8", adjustment: 0.32 },
            { name: "Tiergartenallee 10", adjustment: 0.00 },
            { name: "Timmermannsstrat", adjustment: 0.00 },
            { name: "Tiroler Str.", adjustment: 0.00 },
            { name: "Toitenwinkler Allee", adjustment: -0.94 },
            { name: "Toitenwinkler Weg", adjustment: 0.00 },
            { name: "Torfbrücke", adjustment: 0.00 },
            { name: "Trelleborger Str.", adjustment: -0.56 },
            { name: "Tremsenplatz", adjustment: 0.32 },
            { name: "Trojanstr. (Hansaviertel)", adjustment: 0.32 },
            { name: "Trojanstr. (Warnemünde)", adjustment: 1.23 },
            { name: "Trondheimer Str.", adjustment: -0.56 },
            { name: "Trotzenburger Weg 1-13", adjustment: 0.00 },
            { name: "Trotzenburger Weg 2-12", adjustment: 0.00 },
            { name: "Trotzenburger Weg 14-14b", adjustment: 0.32 },
            { name: "Trotzenburger Weg 15", adjustment: 0.32 },
            { name: "Trägerstr.", adjustment: 0.71 },
            { name: "Tschaikowskisstr. 1-29", adjustment: 0.00 },
            { name: "Tschaikowskisstr. 2-28", adjustment: 0.00 },
            { name: "Tschaikowskisstr. 33", adjustment: 0.32 },
            { name: "Tschaikowskisstr. 34", adjustment: 0.32 },
            { name: "Tschaikowskisstr. 39-67", adjustment: 0.00 },
            { name: "Tschaikowskisstr. 40-66", adjustment: 0.00 },
            { name: "Tulpenweg", adjustment: 0.00 },
            { name: "Turkuer Str.", adjustment: -0.56 },
            { name: "Tychsenstr.", adjustment: 0.00 },
            { name: "Tümmlerweg", adjustment: 0.00 },
            { name: "Uferpromenade", adjustment: 0.70 },
            { name: "Uferstr. 1-3", adjustment: 0.21 },
            { name: "Uferstr. 2-4", adjustment: 0.21 },
            { name: "Uferstr. 5-9", adjustment: 0.70 },
            { name: "Uferstr. 6-8a", adjustment: 0.70 },
            { name: "Uhlenweg", adjustment: 0.00 },
            { name: "Ulmenmarkt", adjustment: 0.84 },
            { name: "Ulmenstr.", adjustment: 0.84 },
            { name: "Ulrich-von-Hutten-Str.", adjustment: 0.00 },
            { name: "Universitätsplatz", adjustment: 0.50 },
            { name: "Unkel-Andrees-Weg", adjustment: 0.00 },
            { name: "Up de Schnur", adjustment: 0.00 },
            { name: "Upundalsprung", adjustment: 0.00 },
            { name: "Up'n Warnowsand", adjustment: 0.00 },
            { name: "Urho-Kekkonen-Str. 1-13", adjustment: -0.94 },
            { name: "Urho-Kekkonen-Str. 2-14", adjustment: -0.94 },
            { name: "Urho-Kekkonen-Str. 15", adjustment: -0.73 },
            { name: "Urho-Kekkonen-Str. 16", adjustment: -0.73 },
            { name: "Usedomer Str.", adjustment: -0.56 },
            { name: "Utkiek", adjustment: 0.00 },
            { name: "Uwe-Johnson-Weg", adjustment: -0.66 },
            { name: "Vagel-Grip-Weg", adjustment: 0.00 },
            { name: "Verbindungsweg", adjustment: 0.00 },
            { name: "Vicke-Schorler-Ring", adjustment: 0.00 },
            { name: "Viergewerkersstr.", adjustment: 0.84 },
            { name: "Villacher Str.", adjustment: 0.00 },
            { name: "Virchowstr.", adjustment: 0.32 },
            { name: "Vitus-Bering-Str.", adjustment: -0.89 },
            { name: "Vogelsang", adjustment: 0.50 },
            { name: "Von-Moltke-Hof", adjustment: -0.94 },
            { name: "Von-Moltke-Str.", adjustment: -0.94 },
            { name: "Vormann-Stüve-Weg 1", adjustment: 0.21 },
            { name: "Vormann-Stüve-Weg 2", adjustment: 0.21 },
            { name: "Vormann-Stüve-Weg 6", adjustment: 0.70 },
            { name: "Vormann-Stüve-Weg 7", adjustment: 0.70 },
            { name: "Vormann-Stüve-Weg 8-12", adjustment: 0.21 },
            { name: "Vormann-Stüve-Weg 9-11", adjustment: 0.21 },
            { name: "Vorwedener Weg", adjustment: 0.00 },
            { name: "Voßstr.", adjustment: 0.32 },
            { name: "Vögenstr.", adjustment: 0.81 },
            { name: "Wachtlerstr.", adjustment: 1.23 },
            { name: "Waldemarstr.", adjustment: 0.84 },
            { name: "Waldmeisterweg", adjustment: 0.00 },
            { name: "Waldsiedlung 1a-5d", adjustment: 0.00 },
            { name: "Waldsiedlung 2a-6b", adjustment: 0.00 },
            { name: "Waldsiedlung 7a-9b", adjustment: 0.21 },
            { name: "Waldsiedlung 8a-10a", adjustment: 0.21 },
            { name: "Waldsiedlung 10b-32", adjustment: 0.00 },
            { name: "Waldsiedlung 11a-31", adjustment: 0.00 },
            { name: "Waldweg (Rostock-Heide)", adjustment: 0.00 },
            { name: "Waldweg (Warneiminde) 2-122", adjustment: 1.23 },
            { name: "Waldweg (Warneiminde) 9-121", adjustment: 1.23 },
            { name: "Waldweg (Warneiminde) 130", adjustment: 1.44 },
            { name: "Wallensteinslager", adjustment: 0.00 },
            { name: "Wallensteinstr.", adjustment: 0.81 },
            { name: "Wallstr.", adjustment: 0.50 },
            { name: "Walter-Butzek-Str.", adjustment: -1.15 },
            { name: "Walter-Husemann-Str.", adjustment: 0.00 },
            { name: "Walter-Stoecker-Str.", adjustment: 0.00 },
            { name: "Walweg", adjustment: 0.00 },
            { name: "Warener Str.", adjustment: -0.73 },
            { name: "Warnemünder Str. 1-13", adjustment: 0.00 },
            { name: "Warnemünder Str. 2-16b", adjustment: 0.00 },
            { name: "Warnemünder Str. 20", adjustment: 0.21 },
            { name: "Warnemünder Str. 20a", adjustment: 0.70 },
            { name: "Warnowallee", adjustment: -0.56 },
            { name: "Warnowenn", adjustment: -0.21 },
            { name: "Warnowpier 1-3", adjustment: -0.68 },
            { name: "Warnowpier 401-431", adjustment: -0.19 },
            { name: "Warnowpier 402-404", adjustment: -0.19 },
            { name: "Warnowpier 439", adjustment: -0.68 },
            { name: "Warnowrande", adjustment: 0.00 },
            { name: "Warnowstr.", adjustment: 1.02 },
            { name: "Warnowufer 23", adjustment: 1.54 },
            { name: "Warnowufer 24-24a", adjustment: 1.54 },
            { name: "Warnowufer 29", adjustment: 1.05 },
            { name: "Warnowufer 30-32", adjustment: 1.05 },
            { name: "Warnowufer 31", adjustment: 1.54 },
            { name: "Warnowufer 33", adjustment: 1.05 },
            { name: "Warnowufer 38-40", adjustment: 1.54 },
            { name: "Warnowufer 41", adjustment: 1.54 },
            { name: "Warnowufer 42-52", adjustment: 1.05 },
            { name: "Warnowufer 45-53", adjustment: 1.05 },
            { name: "Warnowufer 54-54a", adjustment: 1.54 },
            { name: "Warnowufer 55-65a", adjustment: 1.20 },
            { name: "Warnowufer 56-64a", adjustment: 1.20 },
            { name: "Warnowufer 66", adjustment: 0.71 },
            { name: "Warschauer Str.", adjustment: 0.32 },
            { name: "Weberstr.", adjustment: 0.00 },
            { name: "Weg der Freundschaft", adjustment: 0.70 },
            { name: "Weidengrund", adjustment: -0.65 },
            { name: "Weidenweg 2-2b", adjustment: 1.23 },
            { name: "Weidenweg 3", adjustment: 1.23 },
            { name: "Weidenweg 7", adjustment: 1.44 },
            { name: "Weinstr.", adjustment: 0.71 },
            { name: "Weizenweg", adjustment: 0.00 },
            { name: "Weißgerberstr.", adjustment: 0.81 },
            { name: "Wellenweg", adjustment: 0.70 },
            { name: "Wendenstr. 2", adjustment: 1.02 },
            { name: "Wendenstr. 3a-3b", adjustment: 1.02 },
            { name: "Wendenstr. 7", adjustment: 1.51 },
            { name: "Wendenstr. 8", adjustment: 1.51 },
            { name: "Werftallee 9", adjustment: 1.44 },
            { name: "Werftallee 10", adjustment: 1.44 },
            { name: "Werftallee 10a-12", adjustment: 1.23 },
            { name: "Werftallee 13-17", adjustment: 1.23 },
            { name: "Werftallee 20-30", adjustment: -0.91 },
            { name: "Werftallee 25", adjustment: -0.91 },
            { name: "Werftstr. 5-45", adjustment: 1.91 },
            { name: "Werftstr. 18-42", adjustment: 1.91 },
            { name: "Werftstr. 50", adjustment: 2.12 },
            { name: "Werkstr. 1-1a", adjustment: -0.19 },
            { name: "Werkstr. 2", adjustment: -0.19 },
            { name: "Werkstr. 3", adjustment: -0.68 },
            { name: "Werkstr. 3a", adjustment: -0.19 },
            { name: "Werkstr. 5-11", adjustment: -0.89 },
            { name: "Werkstr. 6-10", adjustment: -0.89 },
            { name: "Werner-Seelenbinder-Str.", adjustment: 0.00 },
            { name: "Weverweg", adjustment: 0.00 },
            { name: "Wielandstr.", adjustment: 0.81 },
            { name: "Wiener Platz 1-7", adjustment: 0.00 },
            { name: "Wiener Platz 2-8", adjustment: 0.00 },
            { name: "Wiener Platz 9-13", adjustment: 0.21 },
            { name: "Wiener Platz 10-12", adjustment: 0.21 },
            { name: "Wiener Platz 13a-15", adjustment: 0.00 },
            { name: "Wiener Platz 14", adjustment: 0.00 },
            { name: "Wiesenweg", adjustment: 0.00 },
            { name: "Wiethagen", adjustment: 0.32 },
            { name: "Wiggerestr.", adjustment: 0.66 },
            { name: "Wilhelm-Busch-Weg", adjustment: 0.00 },
            { name: "Wilhelm-Facklam-Weg", adjustment: 0.81 },
            { name: "Wilhelm-Külz-Platz", adjustment: 0.00 },
            { name: "Wilhelm-Leffers-Str.", adjustment: 0.00 },
            { name: "Wilhelm-Raabe-Weg", adjustment: 0.00 },
            { name: "Wilhelmshöhe 1", adjustment: 1.93 },
            { name: "Wilhelmshöhe 1a-1b", adjustment: 1.44 },
            { name: "Wilhelmshöhe 1c", adjustment: 1.23 },
            { name: "Wilhelmshöhe 1e", adjustment: 1.44 },
            { name: "Wilhelmshöhe 2-8", adjustment: 1.23 },
            { name: "Wilhelmshöhe 3-9a", adjustment: 1.23 },
            { name: "Willem-Barents-Str.", adjustment: -0.89 },
            { name: "Willi-Bredel-Str.", adjustment: -0.66 },
            { name: "Willi-Dößler-Str.", adjustment: -0.91 },
            { name: "Willi-Schröder-Str.", adjustment: 0.00 },
            { name: "Windmühlenstr.", adjustment: 0.84 },
            { name: "Wismarsche Str.", adjustment: 0.84 },
            { name: "Wokrenterstr. 1", adjustment: 0.50 },
            { name: "Wokrenterstr. 2", adjustment: 0.50 },
            { name: "Wokrenterstr. 3-5", adjustment: 0.71 },
            { name: "Wokrenterstr. 4-6", adjustment: 0.71 },
            { name: "Wokrenterstr. 27-27a", adjustment: 1.20 },
            { name: "Wokrenterstr. 28", adjustment: 1.20 },
            { name: "Wokrenterstr. 29-37", adjustment: 0.71 },
            { name: "Wokrenterstr. 30-36", adjustment: 0.71 },
            { name: "Wokrenterstr. 38-40", adjustment: 0.50 },
            { name: "Wokrenterstr. 39-41", adjustment: 0.50 },
            { name: "Wolfgang-Borchert-Weg", adjustment: -0.66 },
            { name: "Wolgaster Str.", adjustment: -0.73 },
            { name: "Wollenweberstr. 1-25", adjustment: 0.81 },
            { name: "Wollenweberstr. 2-28", adjustment: 0.81 },
            { name: "Wollenweberstr. 29-31", adjustment: 1.02 },
            { name: "Wollenweberstr. 30", adjustment: 1.02 },
            { name: "Wollenweberstr. 33-63", adjustment: 0.81 },
            { name: "Wollenweberstr. 34-64a", adjustment: 0.81 },
            { name: "Wossidlostr. (Gehlsdorf)", adjustment: 0.70 },
            { name: "Wossidlostr. (Warnemünde)", adjustment: 1.23 },
            { name: "Wächterstr.", adjustment: 0.84 },
            { name: "Wüsteney", adjustment: -0.65 },
            { name: "Zeesenweg", adjustment: 0.21 },
            { name: "Zelckstr.", adjustment: 0.81 },
            { name: "Ziolkowskistr.", adjustment: 0.00 },
            { name: "Zochstr. 1", adjustment: 1.54 },
            { name: "Zochstr. 8-14", adjustment: 1.23 },
            { name: "Zochstr. 9-11", adjustment: 1.23 },
            { name: "Zochstr. 13", adjustment: 1.23 },
            { name: "Zochstr. 18", adjustment: 1.23 },
            { name: "Zorenspielweg", adjustment: 0.00 },
            { name: "Zu den Söllen", adjustment: 0.00 },
            { name: "Zum Flachzentrum", adjustment: 1.54 },
            { name: "Zum Fuchsbau", adjustment: 1.54 },
            { name: "Zum Fährterminal", adjustment: 0.00 },
            { name: "Zum Kühlhaus 1-7", adjustment: -0.90 },
            { name: "Zum Kühlhaus 2", adjustment: -0.91 },
            { name: "Zum Kühlhaus 4-206", adjustment: -0.94 },
            { name: "Zum Laakkanal", adjustment: -0.94 },
            { name: "Zum Lebensbaum", adjustment: -0.94 },
            { name: "Zum Schäferteich", adjustment: -0.94 },
            { name: "Zum Sonnendeck", adjustment: 0.00 },
            { name: "Zum Sonnenhof", adjustment: -0.94 },
            { name: "Zum Südtor", adjustment: 0.00 },
            { name: "Zum Tanklager", adjustment: 0.00 },
            { name: "Zum Vogelnest", adjustment: -0.94 },
            { name: "Zum Walnusshof", adjustment: 0.84 },
            { name: "Zum Wasserwerk 1", adjustment: 0.21 },
            { name: "Zum Wasserwerk 2-4", adjustment: 0.00 },
            { name: "Zum Wasserwerk 3-5", adjustment: 0.00 },
            { name: "Zum Zollamt 1", adjustment: 1.23 },
            { name: "Zum Zollamt 2-4", adjustment: 1.44 },
            { name: "Zum Zollamt 3", adjustment: 1.44 },
            { name: "Zum Zollamt 5", adjustment: 1.93 },
            { name: "Zum Zollamt 6-6a", adjustment: 1.93 },
            { name: "Zum Zollamt 8", adjustment: 1.44 },
            { name: "Zum Zollamt 10", adjustment: 1.23 },
            { name: "Zum Ölhafen 2", adjustment: 0.21 },
            { name: "Zum Ölhafen 3-11", adjustment: 0.21 },
            { name: "Zum Ölhafen 4-10", adjustment: 0.70 },
            { name: "Zur Carbäk", adjustment: 0.00 },
            { name: "Zur Feuerwehr", adjustment: 0.00 },
            { name: "Zur Hansemesse", adjustment: -0.89 },
            { name: "Zur Himmelspforte", adjustment: 0.50 },
            { name: "Zur Kirschblüte 1-3", adjustment: -0.73 },
            { name: "Zur Kirschblüte 2", adjustment: -0.73 },
            { name: "Zur Kirschblüte 4-16", adjustment: -0.94 },
            { name: "Zur Kirschblüte 5-15", adjustment: -0.94 },
            { name: "Zur Kirschblüte 17", adjustment: -0.73 },
            { name: "Zur Kirschblüte 18", adjustment: -0.73 },
            { name: "Zur Lichtung", adjustment: 0.00 },
            { name: "Zur Lotsenbrüderschaft", adjustment: 0.00 },
            { name: "Zur Mooskuhle", adjustment: 0.00 },
            { name: "Zur Obstwiese", adjustment: 0.00 },
            { name: "Zur Promenade 1", adjustment: 1.93 },
            { name: "Zur Promenade 2", adjustment: 1.93 },
            { name: "Zur Promenade 3-5", adjustment: 1.23 },
            { name: "Zur Warnow", adjustment: 0.70 },
            { name: "Zur Yachtwerft", adjustment: 0.00 }

];        