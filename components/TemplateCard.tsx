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
      className="flex-shrink-0 w-64 cursor-pointer group"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-square">
          <Image
            src={template.url}
            alt={template.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="256px"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 dark:text-gray-200">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {template.box_count} text {template.box_count === 1 ? 'box' : 'boxes'}
          </p>
        </div>
      </div>
    </div>
  );
}
