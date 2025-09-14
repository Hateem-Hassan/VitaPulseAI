import { NextRequest, NextResponse } from 'next/server';
import { costOptimizedAiService } from '@/utils/ai-cost-optimized';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); 
    const { query, userContext } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Generate health advice using cost-optimized AI service
    const advice = await costOptimizedAiService.generateHealthAdvice(query, userContext || {});

    return NextResponse.json({
      success: true,
      data: { advice },
      provider: costOptimizedAiService.getCurrentProvider(),
    });
  } catch (error) {
    console.error('Error generating health advice:', error);
    return NextResponse.json(
      { error: 'Failed to generate health advice' },
      { status: 500 }
    );
  }
}