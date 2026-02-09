// Server-friendly YouTube embed using iframe
export function YouTubeComponent(props: any) {
  const id = props.id || props.children || "";
  // If a full URL is provided, try to extract the video id
  const match = String(id).match(/(v=|youtu\.be\/)([A-Za-z0-9_-]{6,11})/);
  const videoId = match ? match[2] : String(id);
  const src = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="relative w-full h-0 pb-[56.25%] my-6">
      <iframe
        src={src}
        title={props.title || "YouTube video"}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
