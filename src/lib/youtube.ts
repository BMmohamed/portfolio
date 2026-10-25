/**
 * YouTube Utility functions for property video management
 */

export function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex (watch, youtu.be, embed, shorts, live)
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match && match[1] ? match[1] : null;
}

export function getYouTubeEmbedUrl(url?: string, autoplay: boolean = false): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  const autoplayParam = autoplay ? '&autoplay=1' : '';
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${autoplayParam}`;
}

export function getYouTubeWatchUrl(url?: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(url?: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
