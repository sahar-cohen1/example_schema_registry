import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'sahar-cohen1/example_schema_registry',
    mode: 'pull-request',
  },
  ui: {
    brand: {
      name: 'Schema Registry',
    },
  },
  collections: {
    schemas: collection({
      label: 'Schemas',
      slugField: 'title',
      path: 'src/content/schemas/{slug}.json',
      format: {  data: 'json'},
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        version: fields.text({
          label: 'Version',
          defaultValue: '1.0.0',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value || 'Tag',
          }
        ),
        content: fields.document({
          label: 'Schema Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});