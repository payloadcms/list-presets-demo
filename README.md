# List Presets Demo

_This feature is released and installed as a canary version. It is not yet available in the latest stable release. See package.json for exact details._

List Presets allow you to save and share filters, columns, and sort orders for your Collections. This is useful for reusing common or complex filtering patterns and column configurations across your team.

Each preset is saved as a new record in the database under the `payload-list-presets` collection. This allows for an endless number of preset configurations, where the users of your app define the presets that are most useful to them, rather than being hard coded into the Payload Config.

Within the Admin Panel, List Presets are applied to the List View. When enabled, new controls are displayed for you can manage presets. Once saved, these presets are available for future use by you and your team.

To enable List Presets on a Collection, use the `enableListPresets` property in your Collection Config.

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  enableListPresets: true,
}
```

## Access Control

List Presets are subject to the same Access Control patterns as the rest of Payload. This means you can use the same access control functions you are already familiar with to control who can read, update, and delete each individual preset.

### Default Access Control

By default, Payload provides a set of sensible defaults for all List Presets, but you can customize these rules to suit your needs. Those defaults are as follows:

- Only Me: Only the user who created the preset can read, update, and delete it.
- Everyone: All users can read, update, and delete the preset.
- Specific Users: Only select users can read, update, and delete the preset.

When a user manages a preset, these options will be available to them in the Admin Panel.

### Custom Access Control

You can also add custom access control rules to List Presets. For example, you could create a rule that only allows users with a specific role to read, update, or delete a preset.

#### Adding a new option

To add custom access control to List Presets, you'll first need to append a new option for users to select when managing a preset. Options are per operation, so you can have completely different rules for reading, updating, and deleting.

Each options requires a label, a value, and a list of fields that will be used to determine access. The fields are conditionally rendered only when that particular option is selected.

To do this, use the `listPresets.constraints` property in your Payload Config.

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  listPresets: {
    // ...
    constraints: {
      read: {
        label: 'Specific Roles',
        value: 'specificRoles,
        fields: [
          {
            name: 'roles',
            type: 'select',
            hasMany: true,
            options: [
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
            ],
          },
        ],
      },
      update: {
        // ...
      },
      delete: {
        // ...
      },
    }
  },
})
```

#### Applying the new option

Once you've added the new option, you'll need to write specific access control rules for each operation using the fields that you've provided. Payload will automatically merge these rules with the default rules.

To do this, use the `listPresets.access` property in your Collection Config:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  listPresets: {
    // ...
    access: {
      read: ({ req: { user } }) => ({
        'access.read.roles': {
          // Your fields are automatically injected into the access[operation] group
          in: user?.roles,
        },
      }),
      update: () => {
        // ...
      },
      delete: () => {
        // ...
      },
    },
  },
})
```

_Note: Payload injects your custom fields into the `access[operation]` group, so your rules need to reflect this._
