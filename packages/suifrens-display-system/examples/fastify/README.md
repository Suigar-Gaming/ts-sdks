# Suifrens Fastify rendering server

This server uses the built display library's public exports to serve Suifrens and accessories as SVG or PNG images. It reads each Suifren's attributes and equipped accessories from Sui over gRPC.

## Setup

Run these commands from the repository root with the Node.js version in `.node-version` and the pnpm version in the root `package.json`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --filter @suigar/suifrens-fastify dev
```

Open [http://localhost:3000](http://localhost:3000). The server listens on `0.0.0.0:3000`; if another server is using port 3000, stop it first.

You don't need an `.env`, wallet, private key or database. Rendering a Suifren requires access to the public Sui fullnode. Accessories come from the local catalogue.

The dev command rebuilds and restarts the server after source edits. If you change the display library, rebuild it separately.

## Network selection

The server uses mainnet by default. Pass `--network` to choose:

```bash
pnpm --filter @suigar/suifrens-fastify dev --network mainnet
pnpm --filter @suigar/suifrens-fastify dev --network testnet
```

Choose `mainnet` or `testnet`. The choice sets the package IDs and gRPC endpoint (`https://fullnode.<network>.sui.io:443`) and survives restarts after source edits. Use a Suifren object ID from that network.

## HTTP routes

| Method | Route                      | Response                                                 |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/`                        | Health check: `{"ok":true}`                              |
| GET    | `/suifrens/:suifrenId/svg` | SVG of a Capy or Bullshark with its equipped accessories |
| GET    | `/accessories/:name/svg`   | SVG of a catalogue accessory on an incognito character   |

For PNG output, use:

| Method | Route                      | Response                                                 |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/suifrens/:suifrenId/png` | PNG of a Capy or Bullshark with its equipped accessories |
| GET    | `/accessories/:name/png`   | PNG of a catalogue accessory on an incognito character   |

SVG responses use `Content-Type: image/svg+xml`; PNG responses use `Content-Type: image/png`. PNGs have a transparent background and default to 1024 pixels wide, with a height that preserves the SVG's proportions. Both formats use the same rendering and network settings.

Set the PNG width in pixels with `?width=512`. Use a whole number from 1 to 4096. Invalid values return `400` before the server reads from Sui or renders an image.

```text
/accessories/soccer%20team%20shirt/png?width=512
/suifrens/OBJECT_ID/png?width=512
```

Use `?logo=true` to show the Sui logo in the bottom-right corner, or `?logo=false` to hide it. The logo is off by default for accessories and Suifrens in both formats. Other values return `400`.

```text
/accessories/soccer%20team%20shirt/svg?logo=false
/accessories/soccer%20team%20shirt/png?width=512&logo=false
/suifrens/OBJECT_ID/svg?logo=true
/suifrens/OBJECT_ID/png?width=512&logo=true
```

All image routes show a shadow by default. Turn it off with `?shadow=false` or on with `?shadow=true`. Other values return `400`. Combine these options with the logo setting and PNG width as needed:

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

The server serves images only and has no game or transaction endpoints.

## Checks

```bash
pnpm --filter @suigar/suifrens-fastify typecheck
pnpm --filter @suigar/suifrens-fastify test
```

See the [package README](../../README.md) for the rendering API and public exports.
