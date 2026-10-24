import { NextResponse } from 'next/server';
import { defaultExperienceContent } from '@/config/experienceContent';

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: defaultExperienceContent,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load content',
        fallback: defaultExperienceContent,
      },
      { status: 500 }
    );
  }
}
