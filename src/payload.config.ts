// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { roles } from './fields/roles'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  queryPresets: {
    access: {
      read: ({ req: { user } }) => ({
        'access.read.roles': {
          in: user?.roles,
        },
      }),
      update: ({ req: { user } }) => ({
        'access.update.roles': {
          in: user?.roles,
        },
      }),
    },
    constraints: {
      read: [{ label: 'Specific Roles', value: 'specificRoles', fields: [roles] }],
      update: [{ label: 'Specific Roles', value: 'specificRoles', fields: [roles] }],
    },
  },
  collections: [Users, Media, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    importExportPlugin({
      overrideExportCollection: (collection) => {
        collection.admin.group = 'System'
        return collection
      },
      disableJobsQueue: true,
    }),
    payloadCloudPlugin(),
  ],
})
