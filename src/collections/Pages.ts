import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'text',
  },
  enableQueryPresets: true,
  lockDocuments: false,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
