import express, { Request, Response } from 'express'

const router = express.Router()

// BMI Calculator
router.post('/bmi', (req: Request, res: Response) => {
  try {
    const { weight, height } = req.body
    
    if (!weight || !height) {
      return res.status(400).json({
        success: false,
        error: 'Weight and height are required'
      })
    }
    
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category = ''
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'
    
    res.json({
      success: true,
      data: {
        bmi: Math.round(bmi * 10) / 10,
        category,
        weight,
        height
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate BMI'
    })
  }
})

// TDEE Calculator
router.post('/tdee', (req: Request, res: Response) => {
  try {
    const { weight, height, age, gender, activityLevel } = req.body
    
    if (!weight || !height || !age || !gender || !activityLevel) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      })
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2)
    
    res.json({
      success: true,
      data: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        weight,
        height,
        age,
        gender,
        activityLevel
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate TDEE'
    })
  }
})

// Body Fat Calculator
router.post('/body-fat', (req: Request, res: Response) => {
  try {
    const { weight, height, age, gender, neck, waist, hip } = req.body
    
    if (!weight || !height || !age || !gender || !neck || !waist) {
      return res.status(400).json({
        success: false,
        error: 'Weight, height, age, gender, neck, and waist measurements are required'
      })
    }
    
    let bodyFat
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      if (!hip) {
        return res.status(400).json({
          success: false,
          error: 'Hip measurement is required for females'
        })
      }
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
    }
    
    let category = ''
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential fat'
      else if (bodyFat < 14) category = 'Athletes'
      else if (bodyFat < 18) category = 'Fitness'
      else if (bodyFat < 25) category = 'Average'
      else category = 'Obese'
    } else {
      if (bodyFat < 14) category = 'Essential fat'
      else if (bodyFat < 21) category = 'Athletes'
      else if (bodyFat < 25) category = 'Fitness'
      else if (bodyFat < 32) category = 'Average'
      else category = 'Obese'
    }
    
    res.json({
      success: true,
      data: {
        bodyFat: Math.round(bodyFat * 10) / 10,
        category,
        measurements: { weight, height, age, gender, neck, waist, hip }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate body fat percentage'
    })
  }
})

export default router