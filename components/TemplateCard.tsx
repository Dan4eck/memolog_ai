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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
          <Image
            src={template.url}
            alt={template.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>
        <div className="p-3 flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 dark:text-gray-200">
            {template.name}
          </h3>
        </div>
      </div>
    </div>
  );
}
