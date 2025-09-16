import express, { Request, Response } from 'express'

const router = express.Router()

// Generate meal plan
router.post('/generate', (req: Request, res: Response) => {
  try {
    const { calories, dietType, allergies, preferences } = req.body
    
    if (!calories) {
      return res.status(400).json({
        success: false,
        error: 'Daily calorie target is required'
      })
    }
    
    // Sample meal plan data (in a real app, this would use AI or a nutrition database)
    const mealPlan = {
      breakfast: {
        name: 'Oatmeal with Berries',
        calories: Math.round(calories * 0.25),
        protein: 12,
        carbs: 45,
        fat: 8,
        ingredients: ['Rolled oats', 'Mixed berries', 'Almond milk', 'Honey']
      },
      lunch: {
        name: 'Grilled Chicken Salad',
        calories: Math.round(calories * 0.35),
        protein: 35,
        carbs: 20,
        fat: 15,
        ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Lemon']
      },
      dinner: {
        name: 'Salmon with Quinoa',
        calories: Math.round(calories * 0.30),
        protein: 40,
        carbs: 35,
        fat: 20,
        ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Garlic', 'Herbs']
      },
      snacks: {
        name: 'Greek Yogurt with Nuts',
        calories: Math.round(calories * 0.10),
        protein: 15,
        carbs: 12,
        fat: 10,
        ingredients: ['Greek yogurt', 'Mixed nuts', 'Berries']
      }
    }
    
    res.json({
      success: true,
      data: {
        mealPlan,
        totalCalories: calories,
        dietType: dietType || 'balanced',
        allergies: allergies || [],
        preferences: preferences || []
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate meal plan'
    })
  }
})

// Get nutrition info for food
router.post('/nutrition', (req: Request, res: Response) => {
  try {
    const { food, quantity } = req.body
    
    if (!food) {
      return res.status(400).json({
        success: false,
        error: 'Food item is required'
      })
    }
    
    // Sample nutrition data (in a real app, this would query a nutrition database)
    const nutritionData = {
      food,
      quantity: quantity || '100g',
      calories: 150,
      protein: 8,
      carbs: 20,
      fat: 5,
      fiber: 3,
      sugar: 12,
      sodium: 200
    }
    
    res.json({
      success: true,
      data: nutritionData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get nutrition information'
    })
  }
})

// Save meal plan
router.post('/save', (req: Request, res: Response) => {
  try {
    const { userId, mealPlan, date } = req.body
    
    if (!userId || !mealPlan) {
      return res.status(400).json({
        success: false,
        error: 'User ID and meal plan are required'
      })
    }
    
    // In a real app, this would save to database
    res.json({
      success: true,
      message: 'Meal plan saved successfully',
      data: {
        id: Date.now().toString(),
        userId,
        date: date || new Date().toISOString().split('T')[0],
        mealPlan
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save meal plan'
    })
  }
})

export default router