import { supabase } from './supabaseClient';
import apiClient from '../api/apiClient';

const BUCKET_NAME = 'task-attachments';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip', 'text/plain', 'application/json'
];

class StorageService {
  async uploadAttachment(file, workspaceId, projectId, taskId = 'new') {
    // 1. Validation
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max limit is 10MB.`);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported.`);
    }

    try {
      // 2. Request Signed Upload URL from Backend
      const { data: signedData } = await apiClient.post('/tasks/attachments/upload-url', {
        workspaceId,
        projectId,
        taskId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const { signedUrl, token, storagePath } = signedData;

      // 3. Upload directly to Supabase using the signed URL
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .uploadToSignedUrl(storagePath, token, file);

      if (error) throw error;

      return {
        name: file.name,
        url: '', // Temporary placeholder, backend will sign this on fetch
        storagePath: storagePath,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('[STORAGE-SERVICE] Upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Deletes a file from Supabase Storage.
   * @param {string} storagePath - The path in the bucket.
   */
  async deleteAttachment(storagePath) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      if (error) throw error;
    } catch (error) {
      console.error('[STORAGE-SERVICE] Delete failed:', error.message);
      throw error;
    }
  }
}

export default new StorageService();
