'use client';

import { MemeTemplate } from '@/types/meme';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: MemeTemplate[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
