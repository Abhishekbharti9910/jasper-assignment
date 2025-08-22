'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700">
        <div className="absolute top-3 left-3 w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>

        {/* Rating */}
        <div className="flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center space-x-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
