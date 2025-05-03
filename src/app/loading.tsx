import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="space-y-8 p-4">
      {/* Header Skeleton */}
      <div className="bg-accent/20 py-6 text-center shadow-md rounded-lg mb-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-3/4 mx-auto mb-2 bg-accent/30" />
          <Skeleton className="h-5 w-1/2 mx-auto bg-accent/30" />
        </div>
      </div>

      {/* Informative Alert Skeleton */}
      <Skeleton className="h-16 w-full bg-accent/10" />

      {/* Form Card Skeleton */}
      <div className="w-full max-w-3xl mx-auto shadow-lg rounded-lg border p-6">
        <Skeleton className="h-8 w-1/3 mb-2 bg-primary/10" />
        <Skeleton className="h-4 w-1/2 mb-6 bg-muted" />

        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
           </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/4 bg-muted" />
                 <Skeleton className="h-10 w-full bg-muted" />
              </div>
           </div>

            {/* Radio Group Skeletons */}
           <div className="space-y-3 border p-4 rounded-md shadow-sm">
              <Skeleton className="h-6 w-1/4 mb-2 bg-accent/10" />
              <div className="flex flex-col space-y-3">
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
              </div>
           </div>
           <div className="space-y-3 border p-4 rounded-md shadow-sm">
              <Skeleton className="h-6 w-1/4 mb-2 bg-accent/10" />
              <div className="flex flex-col space-y-3">
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
                 <Skeleton className="h-6 w-3/4 bg-muted" />
              </div>
           </div>

            {/* Submit Button Skeleton */}
           <Skeleton className="h-10 w-full bg-primary/20" />
        </div>
      </div>

       {/* Footer Skeleton */}
       <div className="bg-accent/20 py-4 text-center mt-12 rounded-lg shadow-md">
          <div className="container mx-auto px-4">
              <Skeleton className="h-4 w-3/4 mx-auto bg-accent/30" />
          </div>
       </div>
    </div>
  );
}
