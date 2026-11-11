# Suifrens Fastify rendering server

This example serves SVG and PNG images of Suifrens and accessories over HTTP. It renders them with the display library's built public exports and fetches each Suifren's attributes and equipped accessories from Sui over gRPC.

## Setup

From the repository root, using the Node.js version in `.node-version` and pnpm version in the root `package.json`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --filter @suigar/suifrens-fastify dev
```

Open [http://localhost:3000](http://localhost:3000). The server listens on `0.0.0.0:3000`; if another server is using port 3000, stop it first.

You don't need an `.env`, wallet, private key or database. Rendering a Suifren requires access to the public Sui fullnode. Accessories come from the local catalogue.

The dev command rebuilds and restarts the server when you edit its source. Changes to the library need a separate library rebuild.

## Network selection

The server uses mainnet by default. Pass `--network` to choose:

```bash
pnpm --filter @suigar/suifrens-fastify dev --network mainnet
pnpm --filter @suigar/suifrens-fastify dev --network testnet
```

The supported values are `mainnet` and `testnet`. This sets the package IDs and gRPC endpoint (`https://fullnode.<network>.sui.io:443`). The server keeps your choice when it restarts after a source edit. The Suifren object ID must belong to that network.

## HTTP routes

| Method | Route                      | Response                                                 |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/`                        | Health check: `{"ok":true}`                              |
| GET    | `/suifrens/:suifrenId/svg` | SVG of a Capy or Bullshark with its equipped accessories |
| GET    | `/accessories/:name/svg`   | SVG of a catalogue accessory on an incognito character   |

PNG versions of both image routes are also available:

| Method | Route                      | Response                                                 |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/suifrens/:suifrenId/png` | PNG of a Capy or Bullshark with its equipped accessories |
| GET    | `/accessories/:name/png`   | PNG of a catalogue accessory on an incognito character   |

SVG responses use `Content-Type: image/svg+xml`. PNG responses use `Content-Type: image/png` and have a transparent background, a default width of 1024 pixels and a height that preserves the SVG's aspect ratio. Both formats use the same rendering and network settings.

Set the PNG width in pixels with `?width=512`. The height follows the image's proportions. Width must be a whole number from 1 to 4096; invalid values return `400` before any on-chain read or rendering.

```text
/accessories/soccer%20team%20shirt/png?width=512
/suifrens/OBJECT_ID/png?width=512
```

Use `?logo=true` or `?logo=false` to show or hide the Sui logo in the bottom-right corner. This works on both SVG and PNG routes. The logo is hidden by default for both accessories and Suifrens. Other values return `400`.

```text
/accessories/soccer%20team%20shirt/svg?logo=false
/accessories/soccer%20team%20shirt/png?width=512&logo=false
/suifrens/OBJECT_ID/svg?logo=true
/suifrens/OBJECT_ID/png?width=512&logo=true
```

The shadow is enabled by default on all image routes. Use `?shadow=false` to hide it or `?shadow=true` to show it. Other values return `400`. You can combine it with the logo option and PNG width:

```text
/accessories/soccer%20team%20shirt/svg?shadow=false
/accessories/soccer%20team%20shirt/png?width=512&logo=false&shadow=false
/suifrens/OBJECT_ID/svg?logo=true&shadow=false
/suifrens/OBJECT_ID/png?width=512&shadow=true
```

For `:suifrenId`, copy the full object ID from an individual NFT's explorer page. A wallet address, package ID or collection Move type won't work here. Missing or deleted objects return `404`. If the server can't read or render the object, it returns `500`.

For `:name`, use the accessory's exact catalogue name, including case, and URL-encode spaces and special characters. Unknown names return `404`.

```bash
curl http://localhost:3000/

# Replace OBJECT_ID with a Suifren object ID on the selected network.
curl "http://localhost:3000/suifrens/OBJECT_ID/svg" -o suifren.svg

curl "http://localhost:3000/accessories/soccer%20team%20shirt/svg" -o accessory.svg

curl "http://localhost:3000/suifrens/OBJECT_ID/png" -o suifren.png
curl "http://localhost:3000/accessories/soccer%20team%20shirt/png" -o accessory.png
```

These routes serve images. The server has no game or transaction endpoints.

## Checks

```bash
pnpm --filter @suigar/suifrens-fastify typecheck
pnpm --filter @suigar/suifrens-fastify test
```

See the [package README](../../README.md) for the rendering API and public exports.
