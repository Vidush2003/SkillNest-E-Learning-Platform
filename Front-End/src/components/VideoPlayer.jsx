import { Play } from 'lucide-react';

const VideoPlayer = ({ url, title }) => {
  // Check if it's a YouTube embed URL
  const isYouTube = url && url.includes('youtube.com/embed');

  if (isYouTube) {
    return (
      <div className="video-player-container">
        <iframe
          width="100%"
          height="400"
          src={url}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: '0.5rem' }}
        ></iframe>
        <div style={{ padding: '1rem', backgroundColor: 'var(--dark-bg)', color: 'var(--white)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={20} />
            {title}
          </h4>
        </div>
      </div>
    );
  }

  // Default video player for other video formats
  return (
    <div className="video-player-container">
      <video
        className="video-player"
        controls
        controlsList="nodownload"
        src={url}
        title={title}
      >
        Your browser does not support the video tag.
      </video>
      <div style={{ padding: '1rem', backgroundColor: 'var(--dark-bg)', color: 'var(--white)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play size={20} />
          {title}
        </h4>
      </div>
    </div>
  );
};

export default VideoPlayer;
