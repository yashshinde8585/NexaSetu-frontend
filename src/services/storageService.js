import { supabase } from './supabaseClient';
import apiClient from '../api/apiClient';

const BUCKET_NAME = 'task-attachments';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'text/plain',
  'application/json',
];

export const uploadAttachment = async (
  file,
  workspaceId,
  projectId,
  taskId = 'new'
) => {
  // Pre-validate file metrics on the client to avoid unnecessary pre-sign API roundtrips
  // and protect backend bandwidth from obvious policy violations.
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max limit is 10MB.`
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported.`);
  }

  try {
    // Request a short-lived signed write URL from the backend gateway.
    // This maintains bucket privacy and enforces IAM policy checks at the API layer.
    const { data: signedData } = await apiClient.post(
      '/tasks/attachments/upload-url',
      {
        workspaceId,
        projectId,
        taskId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }
    );

    const { token, storagePath } = signedData;

    // Upload directly to object storage via the signed URL. Bypasses the application
    // server to prevent thread blocking and memory bloat from file buffering.
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .uploadToSignedUrl(storagePath, token, file);

    if (error) throw error;

    return {
      name: file.name,
      url: '', // Left blank as URLs are dynamically pre-signed on-demand during fetches
      storagePath: storagePath,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('[STORAGE-SERVICE] Upload failed:', error.message);
    throw error;
  }
};

// Permanently removes the attachment object from the Supabase bucket by its storage key.
export const deleteAttachment = async (storagePath) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) throw error;
  } catch (error) {
    console.error('[STORAGE-SERVICE] Delete failed:', error.message);
    throw error;
  }
};

export default {
  uploadAttachment,
  deleteAttachment,
};
