import { NextResponse } from 'next/server';
import { getMemeTemplates } from '@/lib/memes';

export async function GET() {
  try {
    const templates = await getMemeTemplates();

    if (templates.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch meme templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching meme templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meme templates' },
      { status: 500 }
    );
  }
}
