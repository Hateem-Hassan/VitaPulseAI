import { NextRequest, NextResponse } from 'next/server';
import { costOptimizedAiService } from '@/utils/ai-cost-optimized';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile } = body;

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Generate meal plan using cost-optimized AI service
    const mealPlan = await costOptimizedAiService.generateMealPlan(userProfile);

    return NextResponse.json({
      success: true,
      data: mealPlan,
      provider: costOptimizedAiService.getCurrentProvider(),
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}