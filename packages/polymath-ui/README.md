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
- `npx @svgr/cli --icon --replace-attr-values "#000000=currentColor" -d images/{folder} images/{folder}`
