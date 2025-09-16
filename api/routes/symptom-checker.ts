import express, { Request, Response } from 'express'

const router = express.Router()

// Analyze symptoms
router.post('/analyze', (req: Request, res: Response) => {
  try {
    const { symptoms, age, gender, duration } = req.body
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one symptom is required'
      })
    }
    
    // Sample symptom analysis (in a real app, this would use AI/ML models)
    const possibleConditions = [
      {
        name: 'Common Cold',
        probability: 75,
        severity: 'mild',
        description: 'A viral infection of the upper respiratory tract',
        recommendations: [
          'Get plenty of rest',
          'Stay hydrated',
          'Use over-the-counter pain relievers if needed',
          'Consider seeing a doctor if symptoms worsen'
        ]
      },
      {
        name: 'Seasonal Allergies',
        probability: 60,
        severity: 'mild',
        description: 'Allergic reaction to environmental allergens',
        recommendations: [
          'Avoid known allergens',
          'Use antihistamines',
          'Keep windows closed during high pollen days',
          'Consult an allergist for testing'
        ]
      },
      {
        name: 'Viral Infection',
        probability: 45,
        severity: 'moderate',
        description: 'General viral infection affecting multiple systems',
        recommendations: [
          'Rest and recover',
          'Monitor symptoms closely',
          'Seek medical attention if symptoms persist',
          'Stay isolated to prevent spread'
        ]
      }
    ]
    
    const analysis = {
      symptoms,
      patientInfo: { age, gender, duration },
      possibleConditions,
      urgencyLevel: 'low',
      disclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional for proper medical advice.',
      recommendations: [
        'Monitor your symptoms',
        'Rest and stay hydrated',
        'Consult a healthcare provider if symptoms worsen or persist'
      ]
    }
    
    // Adjust urgency based on symptoms
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever']
    const hasEmergencySymptom = symptoms.some((symptom: string) => 
      emergencySymptoms.some(emergency => symptom.toLowerCase().includes(emergency))
    )
    
    if (hasEmergencySymptom) {
      analysis.urgencyLevel = 'high'
      analysis.recommendations.unshift('Seek immediate medical attention')
    }
    
    res.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms'
    })
  }
})

// Get symptom suggestions
router.get('/symptoms', (req: Request, res: Response) => {
  try {
    const { search } = req.query
    
    const allSymptoms = [
      'Headache', 'Fever', 'Cough', 'Sore throat', 'Runny nose',
      'Fatigue', 'Nausea', 'Vomiting', 'Diarrhea', 'Stomach pain',
      'Muscle aches', 'Joint pain', 'Dizziness', 'Shortness of breath',
      'Chest pain', 'Back pain', 'Skin rash', 'Itching', 'Sneezing',
      'Congestion', 'Loss of appetite', 'Weight loss', 'Weight gain',
      'Sleep problems', 'Anxiety', 'Depression', 'Memory problems'
    ]
    
    let filteredSymptoms = allSymptoms
    if (search && typeof search === 'string') {
      filteredSymptoms = allSymptoms.filter(symptom => 
        symptom.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    res.json({
      success: true,
      data: {
        symptoms: filteredSymptoms.slice(0, 20), // Limit to 20 results
        total: filteredSymptoms.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get symptom suggestions'
    })
  }
})

// Save symptom report
router.post('/save-report', (req: Request, res: Response) => {
  try {
    const { userId, symptoms, analysis, date } = req.body
    
    if (!userId || !symptoms || !analysis) {
      return res.status(400).json({
        success: false,
        error: 'User ID, symptoms, and analysis are required'
      })
    }
    
    // In a real app, this would save to database
    res.json({
      success: true,
      message: 'Symptom report saved successfully',
      data: {
        id: Date.now().toString(),
        userId,
        date: date || new Date().toISOString(),
        symptoms,
        analysis
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save symptom report'
    })
  }
})

export default router