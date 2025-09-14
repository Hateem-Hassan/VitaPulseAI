import { NextRequest, NextResponse } from 'next/server';
import { costOptimizedAiService } from '@/utils/ai-cost-optimized';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, dietaryRestrictions, cuisine } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients array is required' },
        { status: 400 }
      );
    }

    // Generate recipe using cost-optimized AI service
    const recipe = await costOptimizedAiService.generateRecipe(
      ingredients,
      dietaryRestrictions || [],
      cuisine || 'Any'
    );

    return NextResponse.json({
      success: true,
      data: recipe,
      provider: costOptimizedAiService.getCurrentProvider(),
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}