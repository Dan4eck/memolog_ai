'use client';

import { MemeTemplate } from '@/types/meme';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TemplateCardProps {
  template: MemeTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/generate?templateId=${template.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group"
    >
      {/* Template Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
        <Image
          src={template.url}
          alt={template.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />
      </div>
    </div>
  );
}
