import React from 'react';

interface SkeletonCardProps {
    className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-paper dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-lg overflow-hidden ${className}`}>
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center gap-2">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Grid of skeleton cards
export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

// Hero skeleton for featured news
export const SkeletonHero: React.FC = () => {
    return (
        <div className="animate-pulse bg-paper dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden">
            <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-700" />
            <div className="p-8 space-y-4">
                <div className="h-4 w-24 bg-red-200 dark:bg-red-900/50 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
        </div>
    );
};

export default SkeletonCard;
