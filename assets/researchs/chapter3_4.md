# 1. Texture Properties

## 1.1. Premultiply Alpha

### Premultiplied Alpha
- RGB values are already multiplied by the alpha channel.
- GPU calculation:
  ```
  result = source.RGB + dest.RGB * (1 - source.A)
  ```
- Advantages:
  - Fewer operations → faster rendering
  - More accurate blending and interpolation
  - Avoids color halos around transparent edges

### Non-Premultiplied Alpha
- RGB values are **not** multiplied by alpha beforehand.
- GPU calculation:
  ```
  result = source.RGB * source.A + dest.RGB * (1 - source.A)
  ```
- Disadvantages:
  - More multiplications per pixel
  - Can cause color errors, especially on transparent edges

---

## 1.2. Wrap Mode

### Clamp Mode
- Restricts texture coordinates (UV) to the `[0, 1]` range.
- When coordinates exceed this range, the edge pixels are extended.

### Repeat Mode
- Repeats the texture content when UV coordinates exceed the `[0, 1]` range.

---

## 1.3. Texture Filter Modes

### Point Filtering
- Uses the closest texel color.
- Fast performance.
- Results in blocky or aliased texture appearance.

### Bilinear Filtering
- Blends the colors of the 4 nearest texels.
- Smoother than Point Filtering.
- Requires more computation.

### Trilinear Filtering
- Blends bilinear results from two mipmap levels.
- Produces the smoothest textures.
- Highest computational cost among the three.

---

# 2. Texture Atlas

A **Texture Atlas** is a single large image that combines many smaller images called **sprites**.  
Each sprite has its own position in the atlas, and a **mapping file** describes where each sprite is located.

### Files used in Cocos Creator:
- `.plist` – Stores sprite metadata (position, size, rotation).
- `.png` – The large image that contains all sprites.

---

## 2.1. Benefits of Using a Texture Atlas

- **Reduces game size and memory usage**:
  - Packing multiple images into one file minimizes memory allocation.
- **Improves rendering performance**:
  - Multiple sprites can be drawn with a single GPU command (**draw call**).

---

## 2.2. Auto Atlas in Cocos Creator

**Auto Atlas** is a feature in **Cocos Creator** that automatically generates a texture atlas from individual image files during the build process.

### 2.2.1. How to Create an Auto Atlas
- Right-click on the folder containing images.
- Select: `Create → Auto Atlas`.
- A `.pac` file will be created as the auto atlas.

### 2.2.2. Recommended Atlas Size
- Use **2048x2048 pixels or smaller**.
- Ensures compatibility with older mobile devices that may not support large textures.

---

# 3. Auto Atlas Settings

When configuring an Auto Atlas, the following settings can be adjusted:

- **Max Width / Max Height**: Defines the maximum dimensions of the atlas image.
- **Padding**: Adds spacing between sprites to prevent color bleeding.
- **Allow Rotation**: Permits the system to rotate sprites for better packing efficiency.
- **Force Squared**: Forces the atlas to have equal width and height (e.g., 1024x1024).
- **Power Of Two**: Ensures width and height are powers of two (e.g., 512, 1024, 2048) for GPU compatibility.
- **Heuristics**: Controls how sprites are arranged to optimize space usage.
- **Padding Bleed ("Extrude")**: Adds a 1-pixel border around each sprite to avoid edge artifacts.
- **Filter Unused Resources**: Automatically excludes unused sprites (effective during build only, not in preview).