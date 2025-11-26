import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, GeneratedMeme } from '@/types/meme';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { templateId, topic } = body;

    // Validate input
    if (!templateId || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing templateId or topic' },
        { status: 400 }
      );
    }

    if (topic.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Topic must be 200 characters or less' },
        { status: 400 }
      );
    }

    // Get template info to know box_count
    const templatesResponse = await fetch('https://api.imgflip.com/get_memes');
    const templatesData = await templatesResponse.json();

    const template = templatesData.data.memes.find(
      (m: any) => m.id === templateId
    );

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Step 1: Generate captions using OpenAI
    const captions = await generateCaptions(
      template.name,
      topic,
      template.box_count
    );

    if (!captions || captions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate captions' },
        { status: 500 }
      );
    }

    // Step 2: Generate images using Imgflip
    const generatedMemes: GeneratedMeme[] = [];

    for (let i = 0; i < Math.min(captions.length, 4); i++) {
      const caption = captions[i];

      try {
        const imageUrl = await generateMemeImage(
          templateId,
          caption.top,
          caption.bottom || ''
        );

        generatedMemes.push({
          id: `${templateId}-${Date.now()}-${i}`,
          imageUrl,
          caption: {
            top: caption.top,
            bottom: caption.bottom,
          },
        });
      } catch (err) {
        console.error(`Failed to generate meme ${i}:`, err);
        // Continue with other memes even if one fails
      }
    }

    if (generatedMemes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate any memes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      memes: generatedMemes,
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

async function generateCaptions(
  templateName: string,
  topic: string,
  boxCount: number
): Promise<Array<{ top: string; bottom?: string }>> {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.warn('OpenAI API key not found, using fallback captions');
    return generateFallbackCaptions(topic, boxCount);
  }

  try {
    const systemPrompt = `You are a witty meme caption writer. Generate funny, concise, and relatable captions for memes. Keep captions short (max 50 characters each) and appropriate for social media.`;

    const userPrompt = `Generate 4 different funny caption variations for the "${templateName}" meme template about: ${topic}

The template has ${boxCount} text ${boxCount === 1 ? 'box' : 'boxes'}.

Return ONLY a valid JSON array with this exact format:
[
  ${boxCount === 1 ? '{"top": "text"}' : '{"top": "text", "bottom": "text"}'},
  ...
]

Make each caption unique, funny, and relevant to "${topic}". Each text should be max 50 characters.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return generateFallbackCaptions(topic, boxCount);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateFallbackCaptions(topic, boxCount);
    }

    // Parse JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Could not parse JSON from OpenAI response');
      return generateFallbackCaptions(topic, boxCount);
    }

    const captions = JSON.parse(jsonMatch[0]);

    // Validate captions
    if (!Array.isArray(captions) || captions.length === 0) {
      return generateFallbackCaptions(topic, boxCount);
    }

    return captions;
  } catch (error) {
    console.error('Error generating captions with OpenAI:', error);
    return generateFallbackCaptions(topic, boxCount);
  }
}

function generateFallbackCaptions(
  topic: string,
  boxCount: number
): Array<{ top: string; bottom?: string }> {
  // Simple fallback captions when OpenAI is not available
  const topTexts = [
    `When ${topic} hits different`,
    `${topic} be like`,
    `POV: ${topic}`,
    `Nobody: ${topic}`,
  ];

  const bottomTexts = [
    `It just hits different`,
    `You know the vibe`,
    `Relatable content`,
    `Facts though`,
  ];

  return topTexts.map((top, i) => ({
    top,
    bottom: boxCount > 1 ? bottomTexts[i] : undefined,
  }));
}

async function generateMemeImage(
  templateId: string,
  text0: string,
  text1: string
): Promise<string> {
  const username = process.env.IMGFLIP_USERNAME;
  const password = process.env.IMGFLIP_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Imgflip credentials not configured. Please set IMGFLIP_USERNAME and IMGFLIP_PASSWORD environment variables.'
    );
  }

  const params = new URLSearchParams({
    template_id: templateId,
    username,
    password,
    text0,
    text1,
  });

  const response = await fetch('https://api.imgflip.com/caption_image', {
    method: 'POST',
    body: params,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error_message || 'Failed to generate meme image');
  }

  return data.data.url;
}
