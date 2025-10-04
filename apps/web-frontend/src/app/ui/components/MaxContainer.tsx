export default function MaxWidthContainer({
  id,
  className,
  children
}: {
  id?: string,
  className?: string,
  children: React.ReactNode
}) {
  
  return (
    <div 
      id={id}
      className={`flex justify-center w-full [&>*]:w-full 2xl:[&>*]:w-384 ${className}`}
    >
      {children}
    </div>
  );
}