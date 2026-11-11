import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

function getCloudinaryProviderOptions(cloudinaryUrl?: string) {
  if (!cloudinaryUrl) return {};

  const parsedUrl = new URL(cloudinaryUrl);
  if (
    parsedUrl.protocol !== 'cloudinary:' ||
    !parsedUrl.hostname ||
    !parsedUrl.username ||
    !parsedUrl.password
  ) {
    throw new Error('CLOUDINARY_URL doit être une URL Cloudinary valide.');
  }

  return {
    cloud_name: parsedUrl.hostname,
    api_key: decodeURIComponent(parsedUrl.username),
    api_secret: decodeURIComponent(parsedUrl.password),
  };
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: getCloudinaryProviderOptions(env('CLOUDINARY_URL')),
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
