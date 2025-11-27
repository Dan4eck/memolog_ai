'use client';

import { MemeTemplate } from '@/types/meme';
import TemplateCard from './TemplateCard';

interface TemplateCarouselProps {
  templates: MemeTemplate[];
}

export default function TemplateCarousel({ templates }: TemplateCarouselProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
