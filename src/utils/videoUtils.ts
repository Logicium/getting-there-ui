/**
 * Utility functions for working with videos
 */

// Cache keys for localStorage
const DURATION_CACHE_KEY = 'video_durations_cache';
const THUMBNAIL_CACHE_KEY = 'video_thumbnails_cache';

/**
 * Get cached duration for a video
 */
function getCachedDuration(videoUrl: string): string | null {
  try {
    const cache = localStorage.getItem(DURATION_CACHE_KEY);
    if (!cache) return null;
    
    const durations = JSON.parse(cache);
    return durations[videoUrl] || null;
  } catch (e) {
    console.error('Error reading duration cache:', e);
    return null;
  }
}

/**
 * Cache a video duration
 */
function cacheDuration(videoUrl: string, duration: string): void {
  try {
    const cache = localStorage.getItem(DURATION_CACHE_KEY);
    const durations = cache ? JSON.parse(cache) : {};
    durations[videoUrl] = duration;
    localStorage.setItem(DURATION_CACHE_KEY, JSON.stringify(durations));
  } catch (e) {
    console.error('Error caching duration:', e);
  }
}

/**
 * Get cached thumbnail for a video
 */
export function getCachedThumbnail(videoUrl: string): string | null {
  try {
    const cache = localStorage.getItem(THUMBNAIL_CACHE_KEY);
    if (!cache) return null;
    
    const thumbnails = JSON.parse(cache);
    return thumbnails[videoUrl] || null;
  } catch (e) {
    console.error('Error reading thumbnail cache:', e);
    return null;
  }
}

/**
 * Cache a video thumbnail
 */
function cacheThumbnail(videoUrl: string, thumbnail: string): void {
  try {
    const cache = localStorage.getItem(THUMBNAIL_CACHE_KEY);
    const thumbnails = cache ? JSON.parse(cache) : {};
    thumbnails[videoUrl] = thumbnail;
    localStorage.setItem(THUMBNAIL_CACHE_KEY, JSON.stringify(thumbnails));
  } catch (e) {
    console.error('Error caching thumbnail:', e);
  }
}

/**
 * Get the duration of a video file asynchronously
 * This function doesn't block the page rendering and updates the duration when available
 * Now includes caching support
 * 
 * @param videoUrl - The URL of the video file
 * @param callback - Optional callback function that will be called with the duration when available
 * @returns Promise that resolves immediately with cached duration or default '00:00'
 */
export const getVideoDuration = (
  videoUrl: string, 
  callback?: (duration: string) => void
): Promise<string> => {
  // Check cache first
  const cachedDuration = getCachedDuration(videoUrl);
  if (cachedDuration) {
    // If we have a cached duration, call callback immediately
    if (callback) {
      callback(cachedDuration);
    }
    return Promise.resolve(cachedDuration);
  }

  return new Promise((resolve) => {
    // Create a video element to load the metadata
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous'; // Add CORS support
    video.style.display = 'none'; // Hide the video element

    // Set up the metadata loaded handler
    video.onloadedmetadata = () => {
      // Round to nearest second
      const seconds = Math.round(video.duration);

      // Format as MM:SS
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const formattedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

      // Cache the duration
      cacheDuration(videoUrl, formattedDuration);

      // Call the callback with the actual duration if provided
      if (callback) {
        callback(formattedDuration);
      }

      // Clean up
      document.body.removeChild(video);
      resolve(formattedDuration);
    };

    // Handle errors
    video.onerror = (e) => {
      console.error('Error loading video metadata:', videoUrl, e, video.error);
      if (callback) {
        callback('00:00');
      }

      // Clean up
      document.body.removeChild(video);
      resolve('00:00');
    };

    // No additional event listeners needed for production

    // Append to DOM to ensure it loads properly
    document.body.appendChild(video);

    // Set the source to start loading the metadata
    video.src = videoUrl;

    // Force the browser to start loading the video
    video.load();

    // Set a timeout to resolve with default duration if metadata doesn't load
    setTimeout(() => {
      if (!video.duration || video.duration === Infinity) {
        if (callback) {
          callback('00:00');
        }

        try {
          document.body.removeChild(video);
        } catch (e) {
          console.error('Error removing video element:', e);
        }

        resolve('00:00');
      }
    }, 5000); // 5 second timeout
  });
};

/**
 * Generate a thumbnail from a video URL
 * @param videoUrl - The URL of the video
 * @param timeInSeconds - The time point to capture (default: 1 second)
 * @returns Promise<string> - Base64 data URL of the thumbnail
 */
export async function generateVideoThumbnail(
    videoUrl: string,
    timeInSeconds: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to the desired time
      video.currentTime = Math.min(timeInSeconds, video.duration - 0.1);
    });

    video.addEventListener('seeked', () => {
      try {
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Clean up
        video.src = '';
        video.load();

        resolve(thumbnailUrl);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', (error) => {
      reject(new Error('Error loading video for thumbnail generation'));
    });

    // Start loading the video
    video.src = videoUrl;
  });
}

/**
 * Generate a thumbnail with retry logic
 * Now includes caching support
 * @param videoUrl - The URL of the video
 * @param maxRetries - Maximum number of retry attempts
 * @returns Promise<string | null> - Base64 data URL of the thumbnail or null if failed
 */
export async function generateVideoThumbnailWithRetry(
    videoUrl: string,
    maxRetries: number = 2
): Promise<string | null> {
  // Check cache first
  const cachedThumbnail = getCachedThumbnail(videoUrl);
  if (cachedThumbnail) {
    return cachedThumbnail;
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Try different time points for each retry
      const timePoints = [1, 2, 3];
      const timeInSeconds = timePoints[attempt] || 1;

      const thumbnail = await generateVideoThumbnail(videoUrl, timeInSeconds);
      
      // Cache the thumbnail
      if (thumbnail) {
        cacheThumbnail(videoUrl, thumbnail);
      }
      
      return thumbnail;
    } catch (error) {
      console.error(`Thumbnail generation attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries) {
        console.error('All thumbnail generation attempts failed');
        return null;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return null;
}
