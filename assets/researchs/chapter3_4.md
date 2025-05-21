# Texture Properties

### Premultiply Alpha
- **Premultiplied Alpha:**  
  RGB values are already multiplied by the alpha channel.  
  GPU calculates:  
  `result = source.RGB + dest.RGB * (1 - source.A)`  
  - Fewer operations → faster rendering  
  - More accurate blending and interpolation  
  - Avoids color halos around transparent edges

- **Non-Premultiplied Alpha:**  
  RGB values are **not** multiplied by alpha beforehand.  
  GPU calculates:  
  `result = source.RGB * source.A + dest.RGB * (1 - source.A)`  
  - More multiplications per pixel  
  - Can cause color errors, especially on transparent edges

---

### Wrap Mode

- **Clamp Mode:**  
  Restricts texture coordinates (UV) to `[0, 1]`.  
  Extends edge pixels when coordinates exceed this range.

- **Repeat Mode:**  
  Repeats the texture content multiple times when UV coordinates go beyond `[0, 1]`.

---

### Texture Filter Modes

- **Point Filtering:**  
  Uses the closest texel color.  
  Fast but causes blocky or aliased textures.

- **Bilinear Filtering:**  
  Blends colors of 4 nearest texels.  
  Smooths blockiness with more computation than Point filtering.

- **Trilinear Filtering:**  
  Blends bilinear results from 2 mipmap levels.  
  Produces the smoothest textures but is the most computationally heavy.