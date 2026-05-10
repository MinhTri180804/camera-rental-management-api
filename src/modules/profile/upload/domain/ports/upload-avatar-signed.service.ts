export interface IUploadAvatarSignedService {
  generate({ userId }: { userId: string }): {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    uploadPreset: string;
    folder: string;
    publicId: string;
  };
  delete({ userId }: { userId: string }): Promise<void>;
}

export const UPLOAD_AVATAR_SIGNED_SERVICE = 'UPLOAD_AVATAR_SIGNED_SERVICE';
