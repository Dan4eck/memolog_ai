import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, GeneratedMeme } from '@/types/meme';
import OpenAI from 'openai';

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
          caption.texts
        );

        generatedMemes.push({
          id: `${templateId}-${Date.now()}-${i}`,
          imageUrl,
          caption: {
            texts: caption.texts,
            tone: caption.tone,
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
): Promise<Array<{ texts: string[]; tone?: string }>> {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.warn('OpenAI API key not found, using fallback captions');
    return generateFallbackCaptions(topic, boxCount);
  }

  try {
    const client = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `You are a meme caption expert. Generate 4 funny caption variations for the "${templateName}" meme about: ${topic}

Template info: ${boxCount} text ${boxCount === 1 ? 'box' : 'boxes'}

IMPORTANT: You already know this meme format. Generate captions that match how this meme is typically used, with varied tones:
1. Sarcastic/ironic
2. Wholesome/relatable
3. Edgy/provocative
4. Meta/self-aware

Return ONLY valid JSON array (no markdown, no explanation):
[
  {"texts": ["text for box 1", "text for box 2", ...], "tone": "sarcastic"},
  {"texts": ["text for box 1", "text for box 2", ...], "tone": "wholesome"},
  {"texts": ["text for box 1", "text for box 2", ...], "tone": "edgy"},
  {"texts": ["text for box 1", "text for box 2", ...], "tone": "meta"}
]

Each text max 50 characters. Make them funny and viral-worthy!`;

    const response = await client.responses.create({
      model: 'gpt-5.1',
      input: prompt,
    });

    const content = response.output_text;

    if (!content) {
      console.warn('Empty response from OpenAI');
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

    // Validate each caption has the correct structure
    const validCaptions = captions.filter(
      (cap) => Array.isArray(cap.texts) && cap.texts.length === boxCount
    );

    if (validCaptions.length === 0) {
      return generateFallbackCaptions(topic, boxCount);
    }

    return validCaptions;
  } catch (error) {
    console.error('Error generating captions with OpenAI:', error);
    return generateFallbackCaptions(topic, boxCount);
  }
}

function generateFallbackCaptions(
  topic: string,
  boxCount: number
): Array<{ texts: string[]; tone?: string }> {
  // Simple fallback captions when OpenAI is not available
  const variations = [
    {
      texts: boxCount === 1
        ? [`${topic} hits different`]
        : boxCount === 2
        ? [`When ${topic} hits`, `It just hits different`]
        : boxCount === 3
        ? [`Me`, `${topic}`, `Also me`]
        : [`Step 1: ${topic}`, `Step 2: ???`, `Step 3: Profit`, `Wait what`],
      tone: 'relatable',
    },
    {
      texts: boxCount === 1
        ? [`${topic} be like`]
        : boxCount === 2
        ? [`${topic} be like`, `You know the vibe`]
        : boxCount === 3
        ? [`Nobody:`, `${topic}:`, `Literally nobody:`]
        : [`${topic}`, `More ${topic}`, `Even more ${topic}`, `Too much ${topic}`],
      tone: 'sarcastic',
    },
    {
      texts: boxCount === 1
        ? [`POV: ${topic}`]
        : boxCount === 2
        ? [`POV: ${topic}`, `Relatable content`]
        : boxCount === 3
        ? [`${topic}`, `This is fine`, `Everything is fine`]
        : [`Trying ${topic}`, `Failing at ${topic}`, `Trying again`, `Still failing`],
      tone: 'wholesome',
    },
    {
      texts: boxCount === 1
        ? [`Nobody: ${topic}`]
        : boxCount === 2
        ? [`Nobody: ${topic}`, `Facts though`]
        : boxCount === 3
        ? [`Me doing ${topic}`, `Also me`, `Why am I like this`]
        : [`${topic}`, `${topic}`, `${topic}`, `Did I mention ${topic}?`],
      tone: 'meta',
    },
  ];

  // Trim texts to fit box_count
  return variations.map(v => ({
    texts: v.texts.slice(0, boxCount),
    tone: v.tone,
  }));
}

async function generateMemeImage(
  templateId: string,
  texts: string[]
): Promise<string> {
  const username = process.env.IMGFLIP_USERNAME;
  const password = process.env.IMGFLIP_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Imgflip credentials not configured. Please set IMGFLIP_USERNAME and IMGFLIP_PASSWORD environment variables.'
    );
  }

  const params = new URLSearchParams();
  params.append('template_id', templateId);
  params.append('username', username);
  params.append('password', password);

  // Add text boxes dynamically based on array length
  texts.forEach((text, index) => {
    params.append(`boxes[${index}][text]`, text);
  });

  console.log('Imgflip API request params:', params.toString());
  console.log('Number of texts:', texts.length);
  console.log('Texts array:', JSON.stringify(texts));

  const response = await fetch('https://api.imgflip.com/caption_image', {
    method: 'POST',
    body: params,
  });

  const data = await response.json();

  console.log('Imgflip API response:', JSON.stringify(data));

  if (!data.success) {
    throw new Error(data.error_message || 'Failed to generate meme image');
  }

  return data.data.url;
}
