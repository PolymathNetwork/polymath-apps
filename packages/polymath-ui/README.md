# Polymath UI

A library for Polymath's custom UI components. [Check out the library live here!](https://polymath-ui-develop.netlify.com/).

## Development

After cloning, run `yarn` to install all dependencies.

Then run `docz:dev` to launch the component playground using [Docz](https://www.docz.site/).

## Testing

To run tests:
`yarn test`

## Add new SVG icons

- Export your SVG in black `#000000` (or replace the hex value in the following command by the color of your SVG)
- Add the SVG files to `images/{folder}`
- `npx @svgr/cli --icon --replace-attr-values "#000000=currentColor" -d ./src/images/{folder} ./src/images/{folder}`

ex: `npx @svgr/cli --icon --replace-attr-values "#000000=currentColor" -d ./src/images/icons ./src/images/icons`

## Add a new component

### New component should follow the following patterns

- Layout should not impact other components (ie: no external margins on the parent container). The component styles should **not** take into consideration its position in the app. It should be displayable anywhere.
  You will use the primitives to "layout" your components in the final page (where they are being used).

**Don't**

```
<Container style={{ marginTop: '30px' }} />
```

**Do**

```
<Box mr={30}>
  <Container />
</Box>
```

- Component should reuse _primitive components_ as much as possible.
- Nested components should follow the `Parent.Child` pattern.
- Component should be tested (snapshot + unit tests if applicable).
- Component should have a specific page in the UI website usign an `.mdx` file.
