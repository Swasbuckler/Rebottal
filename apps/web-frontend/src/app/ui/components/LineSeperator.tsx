import { useMemo } from "react";

export default function LineSeperator({
  vertical,
  widths,
  className
}: {
  vertical?: boolean,
  widths: string,
  className?: string
}) {

  const widthString = useMemo(() => {
    const widthList = widths.split(' ');
    let widthStringList: string[] = [];
    widthList.forEach((width) => {
      let dimension = 'h-';

      if (vertical) {
        dimension = 'w-';
      }

      if (width.includes(':')) {
        const widthSplit = width.split(':');
        widthStringList = [...widthStringList, `${widthSplit[0]}:${dimension}[${widthSplit[1]}]`];
      } else {
        widthStringList = [...widthStringList, `${dimension}[${width}]`];
      }
    })

    return widthStringList.join(' ');
  }, [widths]);

  return (
    <div className={`${vertical ? `h-full ${widthString}` : `w-full ${widthString}`} ${className}`}></div>
  );
}

type Breakpoints = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';