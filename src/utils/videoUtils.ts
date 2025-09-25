/**
 * Utility functions for working with videos
 */

/**
 * Get the duration of a video file
 * @param videoUrl - The URL of the video file
 * @returns Promise that resolves to the duration of the video in MM:SS format
 */
export const getVideoDuration = (videoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Round to nearest second
      const seconds = Math.round(video.duration);
      
      // Format as MM:SS
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      const formattedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      resolve(formattedDuration);
    };
    
    // Handle errors by providing a default duration
    video.onerror = () => {
      console.error('Error loading video metadata:', videoUrl);
      resolve('00:00');
    };
    
    // Set the source and load the video
    video.src = videoUrl;
  });
};