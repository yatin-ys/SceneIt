// app/movies/[category]/loading.tsx
import MediaGridSkeleton from "@/components/skeletons/MediaGridSkeleton";

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* The page title is usually handled by the page itself or layout,
          but you can add a placeholder for the grid's own title if needed. */}
      <MediaGridSkeleton itemCount={12} showTitle={true} />
    </div>
  );
}