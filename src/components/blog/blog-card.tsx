import { Skeleton } from '@/components/ui/skeleton';
import { LocaleLink } from '@/i18n/navigation';
import { formatDate } from '@/lib/formatter';
import { type BlogType, categorySource } from '@/lib/source';
import Image from 'next/image';

interface BlogCardProps {
  locale: string;
  post: BlogType;
}

export default function BlogCard({ locale, post }: BlogCardProps) {
  const { date, title, description, categories, image } = post.data;
  const publishDate = formatDate(new Date(date));
  const blogCategories = categorySource
    .getPages(locale)
    .filter((category) => categories.includes(category.slugs[0] ?? ''));

  return (
    <LocaleLink href={`/blog/${post.slugs}`} className="block h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/20">
        {image && (
          <div className="relative aspect-[3/2] overflow-hidden bg-muted">
            <Image
              src={image}
              alt={`${title} cover`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        {/* Post info container */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {blogCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <span
                    key={category.slugs[0]}
                    className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {category.data.name}
                  </span>
                ))}
              </div>
            )}
            {/* Post title */}
            <h3 className="text-lg line-clamp-2 font-medium">{title}</h3>

            {/* Post excerpt */}
            <div className="mt-2">
              {description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-muted-foreground">
            <time className="truncate text-sm" dateTime={date}>
              {publishDate}
            </time>
          </div>
        </div>
      </div>
    </LocaleLink>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-full">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <Skeleton className="mb-4 h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
        </div>
        <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
