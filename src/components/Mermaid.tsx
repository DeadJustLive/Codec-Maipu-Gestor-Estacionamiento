import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'Inter, sans-serif',
});

export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.render(id.current, chart)
      .then((result) => setSvg(result.svg))
      .catch((e) => console.error('Mermaid render error:', e));
  }, [chart]);

  return <div className="flex justify-center w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: svg }} />;
}
