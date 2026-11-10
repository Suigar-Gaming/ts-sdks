# @suigar/suifrens-display-system

## 1.2.2

### Patch Changes

- 2526ff5: Prevent mirrored arms, hands and sleeves from briefly collapsing at quarter-turn animation endpoints.

## 1.2.1

### Patch Changes

- dd2f7e9: Refine the capy thumbs-up into a compact forward-facing pose with a shorter integrated thumb and one continuous limb outline. Move the posed arm slightly down and left, with its wrist directed toward the belly. Preserve the normal resting pose, head portraits, bullsharks, held-object grips, native palette and foreground layering.

## 1.2.0

### Minor Changes

- 6f283d6: Add an optional native capy thumbs-up gesture to inline and asset renderers. Keep the original head, body, colors and shoulder registration; head portraits and held-object grips remain unchanged.

## 1.1.2

### Patch Changes

- 0ace5d9: Fit running headbands to each species. Keep the capy ribbon short and curved across the front of both ear roots, lower at the near ear and rising just beyond the far ear, in full-body and head-only renders. Preserve a clear forehead, eyes and muzzle, and compact tied ends behind the near ear.
- 019ebb1: Anchor native capy and bullshark arm rotations at their shoulder seams instead of SVG origins. Raised arms, patterns and held accessories remain attached to the torso during celebrations and other arm animations.
- f474fb4: Fit cream runner-singlet binding to the native garment contour: retain the neckline and add continuous inset side/hem piping beneath the animated arms. Replace detached side stripes and shoulder marks with registered fabric edges on capys and bullsharks, preserving bibs, colors and limb registration.
- da5bb39: Allow left-hand objects to opt into foreground rendering together with the gripping arm, keeping raised trophies visible in front of the head on both species. Preserve the microphone animation's existing automatic layering.

  Register foreground native arms and their patterns when they mount during a pose change, so held objects and the gripping hand continue to animate together.

## 1.1.1

### Patch Changes

- d009895: Fit runner uniforms to the native body and foot silhouettes, close shirt/short seams, remove doubled outlines and detached trim, and simplify the headband joins. Preserve both species, readable bibs and independent native limb animation.

## 1.1.0

### Minor Changes

- ffcfed5: Add configurable runner singlets with numbered bibs, shorts, headbands and running shoes for capys and bullsharks. Export buildRunnerAccessories with validated kit colors, bib numbers and optional mirrored bib compensation. Both inline and asset renderers preserve native animated joint registration.

## 1.0.7

### Patch Changes

- 2e4f6f6: Restore the original avatar body placement and facial alignment with or without a crown. Keep the native SVG canvas unchanged and allow complete crown artwork to overflow for unframed characters; framed avatars retain their established crop. This also corrects Capy eyes and other nested SVG artwork that were scaled by the enlarged crown canvas in v1.0.6.

## 1.0.6

### Patch Changes

- 02a8bea: Display complete VIP crowns, including tall tips and side ornaments, on Capy and Bullshark. Remove export masks that cut through crown artwork, preserve crown size and placement with matching padded image bounds, and give crowned portraits room for head-bound motion in both renderers.

## 1.0.5

### Patch Changes

- 3018e9f: Fix individual goth boots to render only the selected boot without clipping. Correct bullshark fin animation registration and its attachment pivot, detect transformed accessory roots, and deduplicate fallback registrations. Rebuild animation registrations when switching between capy and bullshark in both inline and asset renderers.

## 1.0.4

### Patch Changes

- ebd68e1: Prepare release versions and changelogs through automated Changesets pull requests, and publish the compiled GitHub archive after the version pull request is merged. Validate feature changes with pending changesets without requiring release packing.
- 5033892: Fix automated GitHub release preparation by invoking Changesets versioning without shell operators being forwarded as command arguments.

## 1.0.3

### Patch Changes

- Distribute compiled ESM entry points, TypeScript declarations and SVG assets as a versioned GitHub Release archive, without consumer build scripts or development dependencies. Restore the historical `CapyImage` and `BullsharkImage` root exports when replacing Suigar's copied distribution with the source build. That source build uses thicker clothing outlines and arm animation markers; team palettes and native geometry remain unchanged.

  Track subsequent releases with Changesets-generated versions and changelog entries, and include the changelog in the release archive.
