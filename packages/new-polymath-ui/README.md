# Polymath UI

A library for Polymath's custom UI components. [Check out the library live here!](https://polymath-ui-develop.netlify.com/).

## Development

After cloning, run `yarn` to install all dependencies.

Then run `docz:dev` to launch the component playground using [Docz](https://www.docz.site/).

## Testing

To run tests:
`yarn test`

## Add a new component

### New component should follow the following patterns

- Styling of components should not impact other components: no external margins on the parent container (with the exception of the `Heading` and `Paragraph` primitives that have default, overridables, margins).
  The component styles should **not** take into consideration its position in the app. It should be displayable anywhere.
  You will use the primitives to "layout" your components in the final page (where they are being used).

**Don't**

```
<Component style={{ marginTop: '30px' }} />
```

**Do**

```
<Box mr={30}>
  <Component />
</Box>
```

- Component should reuse _primitive components_ as much as possible.
- Avoid adding custom props. Create a new alternative component instead. [More infos].(https://medium.freecodecamp.org/introducing-the-single-element-pattern-dfbd2c295c5d#25ff).

**Don't**

```
  <Page centered />
```

**Do**

```
  <Page />
  <PageCentered />
```

- Nested components should follow the `Parent.Child` pattern.
- Component should be tested (snapshot + unit tests if applicable).
- Component should have a specific page in the UI website usign an `.mdx` file.

## Add new SVG icons

- Export your SVG in black `#000` (or replace the hex value in the following command by the color of your SVG)
- Add the SVG files to `images/{folder}`
- `npx @svgr/cli --icon --replace-attr-values "#000=currentColor" --ext tsx -d images/{folder}/generated images/{folder}`
