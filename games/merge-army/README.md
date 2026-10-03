# Merge Army 2.0 — The Greenwood Siege

Static browser game and installable web app. Serve this directory over HTTPS. No build step, account, API key, or third-party gameplay dependencies.

## Play and install

Open `index.html` through a web server. Tap a soldier, then a matching soldier to merge. Dragging also works. An empty destination moves a soldier; an occupied destination swaps soldiers. The back is always on the left and the front is always on the right, matching the battlefield.

Android: open the game in Chrome and choose **Install game** when offered, or **Add to Home screen** from Chrome's menu. iPad/iPhone: open in Safari and choose **Share → Add to Home Screen**. Visit once online to cache the game; subsequent launches work offline. Progress is local to the device and browser. It is not synchronized between devices.

## What changed

- Original illustrated character atlas and painted battlefield; numbered lanes, tier badges, health bars, clearer attack effects, and contextual formation hints.
- A playable first-merge tutorial, persistent matching highlights, stable controls during rendering, pointer cancellation, keyboard access, tap swaps, and drag movement.
- Knight front-position damage reduction of 18%; ranged back-position attack-speed bonus of 12%; merged soldiers heal fully and receive a short attack frenzy.
- Sequential waves with seven-second preparation breaks, healing, gold rewards, optional early wave dispatch, and relevant upgrades after each third wave or boss.
- Boss victory waits for the whole final wave. Timers and queued attacks belong to a specific run and are cancelled on restart or exit.
- Daily battles use a UTC-date seed for combat, recruitment, and upgrade choices. Cosmetic randomness does not affect their sequence.
- Recruiting upgrades have a minimum interval of 1.6 seconds and cannot produce a negative timer. Full boards hold the next free recruit.
- The original `mergeArmySaveV1` key is retained for medals, records, unlocks, commanders, settings, and upgrades.
- Scoped service worker, manifest, and home-screen icons; offline play without touching other website apps.

## Series foundation

`EPISODE` in `index.html` defines the chapter, wave count, and three regions. `UNIT`, `ENEMY`, `BOSSES`, and `UPGRADES` contain reusable gameplay data. `SPRITES` maps the atlas; a new chapter can replace scenery, encounters, and this data while retaining controls, combat, saving, and app support. A native wrapper would still need platform packaging and device testing; this release is an installable web app.

## Art provenance and production brief

Both original raster assets were generated with the built-in image-generation tool for this game. `assets/army-atlas.webp` is the optimized transparent four-by-four sprite sheet. `assets/greenwood.webp` is the optimized landscape. PNG icons use the generated Knight tile.

Atlas brief: a strict 4×4 transparent sprite sheet, with consistent right-facing, full-body, expressive toy-like fantasy characters and strong silhouettes. Rows: Archer/Knight/Mage/Spearman; Healer/Bomber/Frost Mage/Goblin; Skeleton/Wolf/Orc/Troll; Ghost/Bat Demon/Siege Golem/Castle. Hand-painted cel shading, warm highlights, no text or UI.

Landscape brief: a wide illustrated emerald meadow with three horizontal tracks, blue mountains and pine forests, a distant turquoise river, stone fragments and banners on the left, dark forest on the right, open space for game units, no characters, text, or UI.

## Validation

Engine simulation covers the guided merge, actual pointer event route, swapping, paused-input protection, full-board recruit retention, upgrade selection, final campaign result, restart cancellation, seeded Daily repeatability, and migration of an existing save. Tactical simulations exercise sustained combat, enemies, bosses, recruitment, and ability use. The localhost-only `?qa=1` hook supports development and is inaccessible on the public hostname.
