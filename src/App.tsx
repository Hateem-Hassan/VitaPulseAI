import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { HealthCalculators } from './pages/HealthCalculators'
import { AISymptomChecker } from './pages/AISymptomChecker'
import { FoodLogger } from './pages/FoodLogger'
import { MealPlanner } from './pages/MealPlanner'
import { GetStarted } from './pages/GetStarted'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health-calculators" element={<HealthCalculators />} />
          <Route path="/ai-symptom-checker" element={<AISymptomChecker />} />
          <Route path="/food-logger" element={<FoodLogger />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/get-started" element={<GetStarted />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App