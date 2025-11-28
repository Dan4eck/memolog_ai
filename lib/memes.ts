import { ImgflipTemplatesResponse, MemeTemplate } from '@/types/meme';

export async function getMemeTemplates(): Promise<MemeTemplate[]> {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes', {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Imgflip');
        }

        const data: ImgflipTemplatesResponse = await response.json();

        if (!data.success) {
            throw new Error('Imgflip API returned unsuccessful response');
        }

        // Return top 50 templates
        return data.data.memes.slice(0, 50);
    } catch (error) {
        console.error('Error fetching meme templates:', error);
        return [];
    }
}

export async function getTemplateById(id: string): Promise<MemeTemplate | null> {
    const templates = await getMemeTemplates();
    return templates.find((t) => t.id === id) || null;
}
