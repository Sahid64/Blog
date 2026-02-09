import './tweet.css';

// Server-safe fallback for tweets: render a simple link to the tweet.
export function TweetComponent({ id }: { id: string }) {
  const url = `https://twitter.com/i/web/status/${id}`;
  return (
    <div className="tweet my-6">
      <div className="flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View tweet
        </a>
      </div>
    </div>
  );
}