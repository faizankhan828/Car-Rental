/**
 * Direct browser → Cloudinary upload (no backend needed)
 * Uses Cloudinary's unsigned upload API.
 *
 * SETUP REQUIRED (one time):
 * 1. Go to https://cloudinary.com/console/settings/upload
 * 2. Scroll to "Upload presets" → click "Add upload preset"
 * 3. Set: Preset name = "primeride_cars", Signing mode = "Unsigned", Folder = "primeride/cars"
 * 4. Save it
 */

const CLOUD_NAME = 'Root';           // your Cloudinary cloud name
const UPLOAD_PRESET = 'primeride_cars'; // the unsigned preset you create

/**
 * Upload a file directly to Cloudinary from the browser.
 * Returns { url, public_id } on success.
 * Throws on failure.
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'primeride/cars');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
}
