export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-gray border-t-brand rounded-full animate-spin"></div>
      <p className="text-brand-charcoal font-serif tracking-widest uppercase text-sm animate-pulse">
        Carregando...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 mb-4 w-full"></div>
      <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/4"></div>
    </div>
  );
}
