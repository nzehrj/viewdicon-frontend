/**
 * Watchful Eye Face Capture Utility
 * Silent face capture for financial security
 */

export interface FaceCaptureResult {
  success: boolean;
  face_hash?: string;
  error?: string;
}

/**
 * Capture face silently using front camera
 * Returns face embedding hash
 */
export const captureWatchfulEye = async (): Promise<FaceCaptureResult> => {
  try {
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        success: false,
        error: 'Camera not available on this device',
      };
    }

    // Request camera access (front-facing)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    // Wait a moment for face to be in frame
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      stream.getTracks().forEach(track => track.stop());
      return {
        success: false,
        error: 'Failed to create canvas context',
      };
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Stop camera immediately
    stream.getTracks().forEach(track => track.stop());

    // Generate face hash (in production, use actual face embedding model)
    // For now, we'll create a simple hash from the image data
    const faceHash = await generateFaceHash(imageData);

    return {
      success: true,
      face_hash: faceHash,
    };

  } catch (error) {
    console.error('Face capture error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Generate face embedding hash from image data
 * TODO: Replace with actual face recognition model (MobileFaceNet, FaceNet, etc.)
 */
const generateFaceHash = async (imageData: string): Promise<string> => {
  // In production, this should:
  // 1. Load face detection model
  // 2. Detect face in image
  // 3. Extract face embedding
  // 4. Hash the embedding
  
  // For now, generate a hash from image data
  const encoder = new TextEncoder();
  const data = encoder.encode(imageData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `0x${hashHex.substring(0, 32)}`; // Return first 32 chars
};

/**
 * Check if device supports face capture
 */
export const isFaceCaptureSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};