/**
 * Utility functions for working with videos
 */

/**
 * Get the duration of a video file asynchronously
 * This function doesn't block the page rendering and updates the duration when available
 * 
 * @param videoUrl - The URL of the video file
 * @param callback - Optional callback function that will be called with the duration when available
 * @returns Promise that resolves immediately with a default duration ('00:00')
 */
export const getVideoDuration = (
  videoUrl: string, 
  callback?: (duration: string) => void
): Promise<string> => {
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
