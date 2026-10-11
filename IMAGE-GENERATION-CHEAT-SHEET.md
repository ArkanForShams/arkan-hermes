# Hermes Image Generation Cheat Sheet

**Purpose:** Create, edit, and control AI-generated images through Hermes.

This guide covers the current image-generation interface available in Hermes:

- Natural-language image requests in chat
- `image_generate` tool parameters
- Hermes CLI image input
- Text-to-image generation
- Image editing and transformation
- Reference-image guidance
- Aspect-ratio selection
- Prompt templates and production examples

---

## 1. The basic image-generation command

In Telegram, the Hermes chat, or the dashboard, write:

```text
Create an image of [subject], [style], [lighting], [composition], [aspect ratio].
```

### Simple example

```text
Create a photorealistic image of a white Arabian horse running across a desert at sunrise, cinematic lighting, wide landscape composition.
```

### Better example

```text
Create a premium cinematic landscape image of a white Arabian horse running across golden desert dunes at sunrise. Warm rim lighting, blowing dust, detailed mane, realistic anatomy, low-angle camera, dramatic sky, strong negative space on the right, ultra-detailed commercial photography, no text, no watermark.
```

### Recommended prompt formula

```text
Subject + setting + style + lighting + camera/composition + color + technical constraints
```

Example:

```text
A classic Indian Ambassador car + neutral studio background + realistic 3D technical render + softbox lighting + three-quarter front view + ivory and chrome palette + landscape, no text, no watermark.
```

---

## 2. The `image_generate` command/tool

The underlying Hermes image-generation tool is:

```text
image_generate
```

It accepts these parameters:

```json
{
  "prompt": "Describe the image you want",
  "aspect_ratio": "landscape",
  "image_url": "/path/to/source-image.png",
  "reference_image_urls": [
    "/path/to/style-reference.png",
    "https://example.com/reference.jpg"
  ]
}
```

Only `prompt` is required. The other parameters are optional.

---

## 3. `prompt`

### Purpose

Describes what Hermes should create or how it should edit an image.

### Syntax

```json
{
  "prompt": "Your detailed visual instruction"
}
```

### Text-to-image example

```json
{
  "prompt": "A premium 3D exploded-view illustration of a classic Hindustan Motors Ambassador, with the body shell, engine, chassis, wheels, seats, dashboard, doors, glass, suspension, and exhaust separated but aligned in engineering order. Neutral studio background, realistic CAD-quality parts, soft shadows, ivory paint and chrome details, no readable text, no watermark."
}
```

### Prompt sections

Use these sections when the image needs precision:

```text
Subject:
Setting:
Style:
Materials:
Lighting:
Camera angle:
Composition:
Color palette:
Required elements:
Excluded elements:
Output format/aspect ratio:
```

### Structured example

```text
Subject: classic Hindustan Motors Ambassador sedan
Setting: neutral automotive design studio
Style: realistic CAD-quality exploded-view render
Materials: ivory painted steel, chrome, black rubber, glass, brushed metal
Lighting: soft studio lighting with subtle contact shadows
Camera angle: three-quarter front view, slightly above eye level
Composition: centered, all components spatially aligned around the vehicle
Required elements: engine, transmission, chassis, suspension, wheels, interior, body panels, glass
Excluded elements: people, extra cars, fantasy parts, readable labels, watermark
Output: wide landscape image
```

---

## 4. `aspect_ratio`

Controls the shape of the generated image.

Allowed values:

```text
landscape
square
portrait
```

### Landscape

```json
{
  "aspect_ratio": "landscape"
}
```

Best for:

- Website hero images
- Automotive illustrations
- Presentations
- YouTube thumbnails
- Desktop wallpapers
- Wide technical diagrams

Example:

```text
Create a wide landscape image of a futuristic Riyadh skyline at sunset, with empty space on the left for a title.
```

### Square

```json
{
  "aspect_ratio": "square"
}
```

Best for:

- Instagram posts
- Profile images
- Product tiles
- Icons and centered objects
- Social media cards

Example:

```text
Create a square product image of a premium black smartwatch on a dark reflective surface, studio lighting, centered composition.
```

### Portrait

```json
{
  "aspect_ratio": "portrait"
}
```

Best for:

- Mobile wallpapers
- Instagram Stories
- Posters
- Character portraits
- Vertical social content

Example:

```text
Create a vertical portrait poster of an astronaut standing on a red planet, dramatic backlight, large sky area above the subject.
```

### Aspect-ratio guidance

You can also state the intended use in the prompt:

```text
Landscape composition for a website hero, wide negative space on the right.
```

The explicit `aspect_ratio` parameter is the control that should be preferred.

---

## 5. `image_url` — edit an existing image

### Purpose

Use `image_url` when you want Hermes to transform an existing image instead of creating from scratch.

### Syntax

```json
{
  "prompt": "Describe exactly what to change",
  "image_url": "/absolute/path/to/source-image.png"
}
```

### Local-image example

```json
{
  "prompt": "Keep the car's shape and camera angle. Repaint the body deep British racing green, preserve the chrome parts, improve the studio lighting, remove the background clutter, and keep the image realistic.",
  "image_url": "/home/shams/images/ambassador-reference.png",
  "aspect_ratio": "landscape"
}
```

### URL example

```json
{
  "prompt": "Remove the background and place the product on a clean white studio background. Preserve the product's exact shape and colors.",
  "image_url": "https://example.com/product.png",
  "aspect_ratio": "square"
}
```

### Editing rules

Be explicit about preservation:

```text
Preserve the subject's identity, proportions, pose, camera angle, and composition. Change only the background and lighting.
```

Be explicit about changes:

```text
Change only the paint color. Do not alter the body shape, wheels, windows, grille, or perspective.
```

---

## 6. `reference_image_urls` — guide style or design

### Purpose

Use reference images to guide:

- Style
- Color palette
- Character appearance
- Product shape
- Composition
- Brand visual language

### Syntax

```json
{
  "prompt": "Create a new image using the references for style and visual direction",
  "reference_image_urls": [
    "/absolute/path/to/reference-1.png",
    "/absolute/path/to/reference-2.jpg"
  ]
}
```

Up to 16 reference images can be provided.

### Example: style references

```json
{
  "prompt": "Create a new dark, premium, kinetic sportswear campaign image. Use the references for color language and lighting style, but create a completely new composition with a runner in motion. No logos, no text, no watermark.",
  "reference_image_urls": [
    "/home/shams/references/dark-sportswear-1.jpg",
    "/home/shams/references/dark-sportswear-2.jpg"
  ],
  "aspect_ratio": "landscape"
}
```

### Example: product consistency

```json
{
  "prompt": "Create three-quarter product photography of the same black wireless speaker shown in the reference. Preserve the product's proportions, grille pattern, buttons, and color. Place it on a luxury walnut desk with soft morning light.",
  "reference_image_urls": [
    "/home/shams/references/speaker-front.png",
    "/home/shams/references/speaker-side.png"
  ],
  "aspect_ratio": "square"
}
```

### Reference-image best practice

Use references for visual direction, not as a substitute for instructions. Always explain:

```text
Use the reference for [style/shape/color/composition]. Do not copy [logo/text/person/brand identity].
```

---

## 7. Text-to-image versus image editing

### Create a new image

```text
Create a new image of a vintage Ambassador car in a rainy Mumbai street, cinematic photography, reflections on wet pavement, no text.
```

Use this when the subject and composition are new.

### Edit an existing image

```text
Edit this image: keep the car exactly the same, replace the background with a rainy Mumbai street, add realistic reflections, and preserve the original camera angle.
```

Use this when the original image must remain recognizable.

### Use references

```text
Create a new image of the car using these references for the vehicle shape and color palette, but use a new three-quarter composition in a museum studio.
```

Use this when consistency matters but the composition should change.

---

## 8. Negative constraints

Negative constraints tell the model what to avoid.

### Common exclusions

```text
no text, no watermark, no logo, no people, no extra objects, no duplicate parts, no distorted hands, no cropped subject, no blur, no artifacts
```

### Example

```text
Create a clean technical illustration of a motorcycle engine. No people, no garage, no labels, no watermark, no extra engines, no floating parts, no cropped components.
```

### Important limitation

AI image models may not always obey exact exclusions. For critical text, logos, UI, measurements, or labels, generate the visual first and add exact elements afterward in a design tool.

---

## 9. Composition commands

Use these phrases to control the layout.

| Instruction | Effect |
|---|---|
| `centered composition` | Places the subject centrally |
| `symmetrical composition` | Creates formal balance |
| `three-quarter view` | Shows front and side depth |
| `front-facing view` | Direct frontal presentation |
| `side profile` | Shows the silhouette |
| `top-down view` | Overhead composition |
| `low-angle view` | Makes the subject feel powerful |
| `bird's-eye view` | High elevated perspective |
| `close-up` | Focuses on detail |
| `wide shot` | Shows context and environment |
| `negative space on the left` | Leaves room for text or layout |
| `rule of thirds` | Places the subject off-center |
| `isolated on white` | Product-style isolation |
| `exploded view` | Components separated but aligned |
| `cutaway view` | Interior structure exposed |
| `isometric view` | Technical 3D presentation |

### Example

```text
Create a centered isometric exploded-view illustration of a mechanical watch, with the components separated vertically and aligned precisely, soft gray background, no labels.
```

---

## 10. Camera and lens language

### Camera instructions

```text
35mm wide-angle lens
50mm natural perspective
85mm portrait lens
macro close-up
telephoto compression
low camera angle
eye-level camera
slightly elevated camera
orthographic technical view
```

### Examples

```text
Use a 35mm lens for a cinematic wide environmental scene.
```

```text
Use an 85mm lens for a flattering professional portrait with soft background blur.
```

```text
Use an orthographic technical view for an accurate engineering diagram.
```

---

## 11. Lighting commands

| Instruction | Visual result |
|---|---|
| `soft studio lighting` | Clean product presentation |
| `hard directional light` | Strong shadows and contrast |
| `golden-hour lighting` | Warm sunset atmosphere |
| `blue-hour lighting` | Cool evening mood |
| `rim lighting` | Bright outline around the subject |
| `volumetric light` | Visible light rays |
| `neon lighting` | Cyberpunk/urban glow |
| `high-key lighting` | Bright, low-shadow appearance |
| `low-key lighting` | Dark, dramatic contrast |
| `overcast natural light` | Soft outdoor light |
| `dramatic backlight` | Silhouette and atmosphere |

### Example

```text
Premium product photography, soft directional studio light from the upper left, subtle rim light on the right edge, controlled shadows, dark charcoal background.
```

---

## 12. Style commands

### Photorealistic

```text
photorealistic commercial photography, realistic materials, natural proportions, high detail
```

### Technical 3D

```text
CAD-quality 3D render, engineering visualization, precise mechanical relationships, realistic PBR materials
```

### Illustration

```text
editorial illustration, clean ink lines, muted color palette, sophisticated magazine aesthetic
```

### Vector

```text
flat vector illustration, clean geometric shapes, limited color palette, crisp edges
```

### Cinematic

```text
cinematic composition, film still, atmospheric depth, dramatic lighting, controlled color grading
```

### Luxury

```text
premium luxury advertising aesthetic, restrained palette, refined materials, elegant composition, polished studio lighting
```

---

## 13. Reusable prompt templates

### Product image

```text
Create a premium product photograph of [PRODUCT].
Place it on [SURFACE] in [SETTING].
Use [LIGHTING] and [CAMERA ANGLE].
Style: [STYLE].
Color palette: [COLORS].
Composition: [COMPOSITION].
No text, no watermark, no extra products.
```

### Technical exploded view

```text
Create a detailed technical exploded-view illustration of [OBJECT].
Separate the major components while keeping them aligned in their real assembly order:
[COMPONENT LIST].
Use [VIEW TYPE], [MATERIALS], [LIGHTING], and [BACKGROUND].
Engineering visualization, realistic mechanical relationships, no readable labels, no watermark.
```

### Image editing

```text
Edit the supplied image.
Preserve: [ELEMENTS TO KEEP].
Change: [ELEMENTS TO CHANGE].
Remove: [ELEMENTS TO REMOVE].
Maintain the original subject identity, proportions, and camera angle.
Style: [STYLE].
```

### Social media graphic

```text
Create a [SQUARE/PORTRAIT/LANDSCAPE] social media graphic about [TOPIC].
Visual concept: [CONCEPT].
Style: [STYLE].
Color palette: [COLORS].
Leave clean space for a text overlay in [LOCATION].
Avoid long text inside the image. No watermark.
```

### Website hero

```text
Create a wide website hero image for [BRAND/TOPIC].
Main subject: [SUBJECT].
Visual mood: [MOOD].
Style: [STYLE].
Place the main subject on the [LEFT/RIGHT/CENTER].
Leave clean negative space on the [LEFT/RIGHT] for a headline.
No text in the image, no watermark.
```

---

## 14. Hermes CLI commands

### Check Hermes version

```bash
hermes --version
```

### Open the interactive model/provider picker

```bash
hermes model
```

### Start interactive Hermes chat

```bash
hermes
```

Then ask:

```text
Generate a square image of a premium black coffee machine on a marble counter, studio lighting, no text.
```

### One-shot image-generation request

```bash
hermes chat -q "Create a landscape cinematic image of Riyadh at golden hour, modern skyline, warm light, no text, no watermark."
```

### Provide a local input image for an edit request

```bash
hermes chat --image /home/shams/images/source.png -q "Keep the subject unchanged, replace the background with a clean white studio background, and improve the lighting."
```

### Use a specific model for the Hermes request

```bash
hermes -m MODEL -q "Create a photorealistic product image of a black luxury watch on dark stone."
```

### Use a specific provider for the Hermes request

```bash
hermes --provider PROVIDER -q "Create a clean technical illustration of a gearbox in exploded view."
```

### Use a named profile

```bash
hermes -p arkan chat -q "Create a premium automotive illustration of a classic Ambassador sedan."
```

### Limit tool iterations for a simple generation request

```bash
hermes chat --max-turns 10 -q "Create a square editorial illustration of a book and a coffee cup."
```

### Quiet CLI output

```bash
hermes chat -Q -q "Create a landscape image of a desert road at sunrise."
```

> `hermes chat --image` supplies an input image to the Hermes conversation. The actual image-generation/editing operation is performed through the image-generation tool available to the agent.

---

## 15. Best command examples

### Ambassador exploded view

```text
Create a premium engineering exploded-view illustration of a classic Hindustan Motors Ambassador sedan. Show the ivory body shell lifted above the chassis, engine and transmission separated forward, doors and hood detached, glass floating near the frames, grille and chrome bumpers separated, interior seats and dashboard exposed, suspension and wheels aligned below, and exhaust and fuel tank visible underneath. Realistic CAD-quality 3D render, orthographic three-quarter front view, neutral warm-gray studio background, soft shadows, no people, no readable text, no watermark.
```

### Corporate AI banner

```text
Create a wide dark premium technology banner showing an abstract AI command center with glowing data streams, subtle network geometry, deep void-black background, electric blue and gold accents, cinematic rim lighting, clean negative space on the right for a headline, no text, no logos, no watermark.
```

### Website hero

```text
Create a landscape website hero image for an AI leadership consultancy. Show a calm executive silhouette standing before a luminous strategic data horizon, dark navy and black palette, restrained gold highlights, cinematic but professional, subject positioned on the left, negative space on the right, no text, no watermark.
```

### Product edit

```text
Edit the supplied product image. Preserve the product's exact shape, buttons, proportions, and camera angle. Replace the background with a premium charcoal studio backdrop, add a soft reflection beneath the product, use controlled rim lighting, remove all clutter, and do not add text or logos.
```

### Style-reference generation

```text
Create a new image of a modern electric vehicle driving through Riyadh at blue hour. Use the reference images for the dark cinematic color palette, controlled highlights, and premium automotive advertising style. Create a new composition; do not copy logos, people, or text. Landscape format, no watermark.
```

---

## 16. What usually produces the best results

1. Name the subject precisely.
2. State the intended visual style.
3. Specify the camera angle and composition.
4. Define the lighting and color palette.
5. Add exclusions such as `no text` and `no watermark`.
6. Use `landscape`, `square`, or `portrait` deliberately.
7. For editing, explicitly say what must remain unchanged.
8. Use reference images when consistency matters.
9. Generate a draft before requesting a final polished version.
10. Add exact logos, long text, labels, and UI overlays afterward when accuracy matters.

## 17. Quick troubleshooting

### The subject looks wrong
Add:

```text
unmistakable silhouette, accurate proportions, realistic anatomy, clearly visible defining features
```

### Too many unwanted objects
Add:

```text
single subject only, no duplicate objects, no extra vehicles, clean isolated composition
```

### Image is too generic
Add specific:

```text
materials, decade, region, camera angle, lighting direction, surface details, wear patterns
```

### Text is incorrect
Use:

```text
no text in the generated image; add the exact text afterward in post-processing
```

### The edit changes too much
Use:

```text
preserve the original subject, proportions, pose, perspective, and composition; change only [REQUESTED CHANGE]
```

### The composition is cropped
Use:

```text
full subject visible, generous margins, nothing cropped by the frame
```

---

## 18. Fast command card

```text
Create [subject] in [style], [lighting], [camera/composition], [colors].
Use [landscape/square/portrait].
Include [required details].
Exclude [unwanted details].
No text, no watermark.
```

### Text-to-image

```text
Create a new image of [SUBJECT]...
```

### Edit

```text
Edit this image: preserve [WHAT TO KEEP], change [WHAT TO CHANGE]...
```

### Reference-guided

```text
Use the reference images for [STYLE/SHAPE/COLOR], but create a new composition of [SUBJECT]...
```

### CLI

```bash
hermes chat -q "Create ..."
hermes chat --image /path/to/source.png -q "Edit ..."
hermes -p PROFILE chat -q "Create ..."
hermes -m MODEL chat -q "Create ..."
```
