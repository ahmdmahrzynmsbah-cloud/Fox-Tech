import React, { useState, useEffect } from 'react';

export default function BunnyVideoPlayer({ videoId }: { videoId: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    fetch(`/api/bunny/play-url/${videoId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (active && data?.url) setUrl(data.url);
      })
      .catch(err => {
        if (err?.name !== 'AbortError') {
          console.error("Bunny player fetch error:", err);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [videoId]);

  if (!url) return <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>;

  return (
    <iframe 
      src={url}
      loading="lazy"
      style={{border: 'none', position: 'absolute', top: 0, height: '100%', width: '100%'}}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen
    />
  );
}

