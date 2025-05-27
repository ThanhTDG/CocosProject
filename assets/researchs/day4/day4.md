# Comparison Report: Sprite Size Modes – Trimmed vs. Raw

## 1. Trimmed Mode

**Definition:**  
Trimmed mode automatically sets the Node’s size to match exactly the non-transparent (cropped) area of the sprite image. Transparent pixels around the main content are ignored and do not affect the Node’s dimensions.

**Advantages:**  
- **Optimizes Space:** The Node is as compact as its visible content, resulting in a cleaner Scene Editor and more efficient object arrangement.
- **Precise Interaction:** The Node’s size matches the visible sprite, enabling more accurate positioning, easier alignment, and more precise bounding box calculations for collision detection.
- **Atlas Compatibility:** Ideal for sprites in a Texture Atlas (sprite sheet), as frames are often trimmed to save space.

**Recommended Use Cases:**  
- Game characters, enemies, items, or props with transparent padding around their active area.
- Visual effects or particles with transparent backgrounds.
- Animation frames that have been trimmed in a sprite sheet.

**Example:**  
A running character sprite image is 128x128 pixels, but the character only occupies a 60x80 pixel region in the center. Using Trimmed, the Node will be about 60x80, making it easier to position the character accurately and fit its collision box snugly.

---

## 2. Raw Mode

**Definition:**  
Raw mode sets the Node’s size to match the original (full) dimensions of the sprite image, including all transparent areas. For example, a 128x128 PNG will always result in a 128x128 Node in this mode.

**Advantages:**  
- **Maintains Frame Size:** The full, untrimmed dimensions of the image asset are preserved, including any transparent padding.
- **Predictable Spacing:** Allows precise control over transparent padding that may be intentionally included for consistent spacing.
- **Supports Original Size Calculations:** Useful if scripts or systems rely on the Sprite Component always having the same dimensions as its original SpriteFrame asset.

**Recommended Use Cases:**  
- Pixel art games or grid-based systems where each sprite “cell” must keep a fixed size to align with a grid, regardless of the actual content.
- UI elements with fixed transparent padding to ensure consistent spacing between components.
- Full-screen backgrounds or images where trimming offers little or no benefit.

**Example:**  
In a scenario with 32x32 pixel art tiles for a game map, but some tiles only have active pixels in a 28x28 area, using Raw ensures the Nodes remain 32x32 to fit the grid.