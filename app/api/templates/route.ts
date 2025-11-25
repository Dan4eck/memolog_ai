import { NextResponse } from 'next/server';
import axios from 'axios';
import { ImgflipTemplatesResponse, MemeTemplate } from '@/types/meme';

export async function GET() {
  try {
    // Fetch meme templates from Imgflip API
    const response = await axios.get<ImgflipTemplatesResponse>(
      'https://api.imgflip.com/get_memes'
    );

    if (!response.data.success) {
      return NextResponse.json(
        { error: 'Failed to fetch meme templates' },
        { status: 500 }
      );
    }

    // Get the top 50 most popular templates
    const templates: MemeTemplate[] = response.data.data.memes.slice(0, 50);

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
