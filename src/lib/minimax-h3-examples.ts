/**
 * Published MiniMax H3 sample clips.
 *
 * The same data powers the homepage showcase, the /examples hub and the
 * per-clip VideoObject pages. Prompts are the directions that produced the
 * clips; they are shown verbatim so visitors can reuse them.
 */
export type ExampleClip = {
  slug: string;
  file: string;
  title: string;
  aspect: string;
  mode: 'Text to video' | 'First & last frame' | 'Multimodal reference';
  resolution: '768P' | '2K';
  summary: string;
  prompt: string;
};

/** Date the sample library was first published on this site. */
export const EXAMPLES_PUBLISHED = '2026-08-05';

export const EXAMPLES: ExampleClip[] = [
  {
    slug: 'showcase-film',
    file: 'showcase-film.mp4',
    title: 'Cinematic macro portrait',
    aspect: '4:5',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'An extreme macro shot of a gecko eye that holds focus while the pupil contracts. Useful as a reference for shallow depth of field and quiet natural sound design.',
    prompt:
      'Extreme macro cinematic portrait of a golden crested gecko, its enormous textured eye filling the frame. The reptile remains calm while the pupil subtly contracts and the head makes tiny natural movements. Warm amber key light, deep black background, razor-sharp scale detail, very shallow depth of field, slow controlled push-in, premium wildlife documentary photography, quiet natural ambience.',
  },
  {
    slug: 'showcase-product',
    file: 'showcase-product.mp4',
    title: 'Commercial product film',
    aspect: '4:3',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A vertical city canyon shot with pulsing architectural lights and a bold title that stays stable across the move. Good test of on-screen typography and commercial pacing.',
    prompt:
      'A dramatic upward-looking commercial shot inside a narrow futuristic city canyon. Symmetrical concrete towers rise toward the night sky while illuminated geometric windows and red industrial lights pulse in sequence. Slow vertical dolly, precise architectural perspective, glossy reflections, dark emerald and crimson color grade, bold centered brand typography remains stable, deep mechanical ambience.',
  },
  {
    slug: 'showcase-context',
    file: 'showcase-context.mp4',
    title: 'Multimodal direction',
    aspect: '16:9',
    mode: 'Multimodal reference',
    resolution: '768P',
    summary:
      'A beach performance directed with reference inputs rather than a longer written prompt. Shows how image and video references steer framing and performance detail.',
    prompt:
      'Surreal cinematic beach performance: a middle-aged man in glasses lies on the sand in close-up while a woman seated behind him gently guides his head through a strange relaxation ritual. Natural coastal daylight, wind moving hair and fabric, subtle facial reactions, handheld documentary framing, realistic skin detail, distant waves and soft beach ambience.',
  },
  {
    slug: 'showcase-campaign',
    file: 'showcase-campaign.mp4',
    title: 'Campaign filmmaking',
    aspect: '4:5',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A neo-noir opening-title sequence built from screen-print textures and readable lettering. A practical reference for graphic, editorial-style campaign work.',
    prompt:
      'Animated neo-noir opening-title sequence for a film called MIDNIGHT LINE. A blue night train cuts through graphic panels, ticket stubs, clocks, Japanese typography and red route diagrams. Bold screen-print textures, black cobalt and burnt-orange palette, rhythmic editorial cuts, crisp readable lettering, suspenseful rail sounds and pulsing cinematic percussion.',
  },
  {
    slug: 'showcase-world',
    file: 'showcase-world.mp4',
    title: 'Worldbuilding sequence',
    aspect: '1:1',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A beauty close-up on a mirrored silver visor, where highlights travel across chrome and skin. Demonstrates reflective surfaces and luxury fashion-film lighting.',
    prompt:
      'Extreme beauty close-up of a dark-skinned woman wearing a sculptural mirrored silver visor. The camera glides slowly across the visor edge, eye, nose and lips as soft studio highlights travel over chrome and luminous skin. Minimal white environment, luxury fashion-film lighting, precise reflections, intimate breathing and delicate metallic sound design.',
  },
  {
    slug: 'showcase-performance',
    file: 'showcase-performance.mp4',
    title: 'Expressive performance',
    aspect: '3:4',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A stylized game menu that animates around a character without corrupting the interface text. The clip to study if you need stable UI overlays.',
    prompt:
      'A vivid stylized video-game menu comes alive around a rebellious pink-haired fantasy character. The character shifts her weight and reacts with playful attitude while neon green buttons, stickers and hand-drawn interface elements animate cleanly without changing their text. Saturated purple and acid-green palette, punchy game UI sounds, energetic electronic music.',
  },
  {
    slug: 'hero',
    file: 'hero.mp4',
    title: 'Editorial motion study',
    aspect: '16:9',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A quiet café portrait with a small emotional beat and a soft rack of background pedestrians. Shows restrained performance direction in a single continuous shot.',
    prompt:
      'Cinematic editorial portrait of a young woman with natural curly hair sitting alone at a European sidewalk café. She looks down pensively, then makes a subtle emotional movement as pedestrians drift softly out of focus behind her. Warm afternoon light, shallow depth of field, gentle handheld camera, muted film colors, quiet street ambience and restrained piano.',
  },
  {
    slug: 'hf-first-last',
    file: 'hf-first-last.mp4',
    title: 'First and last frame control',
    aspect: '1:1',
    mode: 'First & last frame',
    resolution: '768P',
    summary:
      'A rack focus from a ramen bowl in the foreground to a family in the background, driven by first and last frame images. The clearest example of keyframe-guided motion.',
    prompt:
      'A cozy traditional Japanese family dinner seen across a polished wooden table, with a steaming blue-and-white ramen bowl in the immediate foreground. Begin focused sharply on the noodles, scallions and swirling steam, then perform a slow rack focus to the smiling family conversing in the background. Static cinematic camera, warm shoji-screen daylight, ceramic and chopstick sounds, gentle acoustic guitar and koto.',
  },
  {
    slug: 'openart-portrait-1',
    file: 'openart-portrait-1.mp4',
    title: 'Portrait motion study',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A high-speed motorsport tracking shot where the bike leans through a corner and sponsor graphics stay legible. Built for vertical delivery.',
    prompt:
      'High-speed motorsport tracking shot of a professional rider leaning a red racing motorcycle deep into a circuit corner. The camera pans smoothly alongside the bike, wheels spinning with natural motion blur, sponsor graphics remain crisp, asphalt and painted curbs streak past, bright outdoor race-day light, aggressive engine roar and wind.',
  },
  {
    slug: 'openart-portrait-3',
    file: 'openart-portrait-3.mp4',
    title: 'Vertical campaign story',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A figure walking through misty pines with layered parallax and drifting fog. A reference for atmospheric depth in a vertical frame.',
    prompt:
      'A solitary figure moves cautiously through a misty pine forest at dawn. Tall dark trunks pass in layered parallax as the camera follows at shoulder height, cold blue-grey fog drifting between the trees, damp clothing and branches moving naturally, restrained handheld suspense, distant birds, footsteps and low atmospheric tension.',
  },
  {
    slug: 'openart-portrait-4',
    file: 'openart-portrait-4.mp4',
    title: 'Social film concept',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A ground-level battlefield tracking shot with rolling smoke and wind-driven uniforms. Shows how period detail survives fast lateral camera movement.',
    prompt:
      'World War I soldiers advance through a devastated muddy battlefield beneath a heavy blue-grey sky. The camera tracks beside them at ground level as smoke rolls through shattered trees and uniforms react naturally to the wind. Gritty historical realism, desaturated cinematic grade, distant artillery, boots in mud and tense orchestral undertone.',
  },
  {
    slug: 'openart-community-1',
    file: 'openart-community-1.mp4',
    title: 'MiniMax community creation',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A first-person design sequence with hands sketching beside a laptop. The hand and tool detail is the part worth inspecting at full speed.',
    prompt:
      'Dynamic first-person product-design sequence in a bright studio: hands sketch a flowing multicolor curve on white paper beside a laptop displaying professional design software. Smooth close camera movement, accurate hands and tools, clean desk details, natural daylight, pencil sounds and subtle upbeat creative-work music.',
  },
  {
    slug: 'openart-feature-3',
    file: 'openart-feature-3.mp4',
    title: 'Cinematic character study',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A low-angle skate bowl run with clothing and hair reacting to speed. A test of fast subject tracking inside a vertical sports-commercial frame.',
    prompt:
      'A fearless young woman in a black helmet and streetwear carves rapidly across a sunlit concrete skate bowl. Low-angle tracking camera stays close to the board, hair and clothing respond to speed, wheels grip and slide realistically, crisp midday shadows, energetic urban sports-commercial finish with wheel and wind sound.',
  },
  {
    slug: 'h3-direct-2k',
    file: 'h3-direct-2k.mp4',
    title: 'Direct native 2K output',
    aspect: '16:9',
    mode: 'Text to video',
    resolution: '2K',
    summary:
      'A space-opera trailer beat cut to a fleet jump and a bridge impact, rendered directly at 2K. Use it to judge detail retention at the higher resolution tier.',
    prompt:
      'Epic space-opera trailer: a silver-haired female captain stands alone before a colossal curved observation window as the last fleet assembles against a purple nebula. Slow push-in, then cut to her tense close-up as every warship jumps to hyperspace in a blinding blue-white flash and the bridge shakes violently. Native 2K detail, synchronized metallic impacts, sub-bass boom and mournful orchestral score.',
  },
  {
    slug: 'r2va-direct-2k',
    file: 'r2va-direct-2k.mp4',
    title: 'Direct reference transfer in 2K',
    aspect: '16:9',
    mode: 'Multimodal reference',
    resolution: '2K',
    summary:
      'A reference-driven shot that keeps a subject’s face, clothing and the animal in frame while he turns and speaks. The clip to study for identity retention.',
    prompt:
      'A stylish young man in a vivid pink suit stands in a windswept green field holding a small black lamb, with white sheep grazing behind him. Preserve his identity, clothing and the animal while he turns naturally and delivers an emotional line to camera. Golden late-afternoon light, gentle handheld framing, realistic lip sync, wind, sheep ambience and soft cinematic music.',
  },
  {
    slug: 'openart-h3-4x19',
    file: 'openart-h3-4x19.mp4',
    title: 'MiniMax vertical visual experiment',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A Victorian equestrian scene with two figures on white horses and small natural adjustments in posture. A period-costume test in a vertical frame.',
    prompt:
      'Elegant Victorian equestrian scene outside a grand stone estate: two aristocratic women in tailored black riding coats and tall top hats sit on white horses. One woman gestures while speaking and the horses shift naturally. Overcast English countryside light, refined period-drama cinematography, subtle camera drift, hoof movement, leather creaks and distant birds.',
  },
  {
    slug: 'openart-h3-community-2',
    file: 'openart-h3-community-2.mp4',
    title: 'Community motion concept',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'A macro hummingbird hovering at a flower, with wing blur and iridescent feather shifts. A good example of macro motion in a vertical crop.',
    prompt:
      'Macro slow-motion shot of an iridescent blue hummingbird hovering beside vivid pink trumpet flowers. Its wings beat in a translucent blur while its beak reaches into a blossom, tiny feathers shimmer from cobalt to turquoise, dark soft-focus garden background, stabilized wildlife camera, natural wing buzz and garden ambience.',
  },
  {
    slug: 'openart-h3-community-3',
    file: 'openart-h3-community-3.mp4',
    title: 'Community cinematic scene',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'An underwater reef drift with caustic light moving across coral and fish. Shows layered depth and continuous camera float without cuts.',
    prompt:
      'Dreamlike underwater journey through a richly colored coral reef made of soft blue, lavender and white anemones. Orange clownfish and small yellow reef fish weave naturally between the coral as the camera floats forward, caustic sunlight ripples across every surface, tranquil bubbles and immersive underwater ambience.',
  },
  {
    slug: 'openart-h3-community-4',
    file: 'openart-h3-community-4.mp4',
    title: 'Sunlit floral portrait',
    aspect: '9:16',
    mode: 'Text to video',
    resolution: '768P',
    summary:
      'Dappled sunlight through a straw hat falls across a face in a slow push-in. A reference for fine skin and fabric detail in a beauty-film finish.',
    prompt:
      'Sunlit cinematic close-up of a freckled blonde woman wearing a wide woven straw hat, framed behind large pink lilies in a lush summer garden. Dappled bands of sunlight pass through the loose straw weave and paint delicate moving patterns across her green eyes, cheeks, and soft smile. A light breeze gently stirs her hair, the hat brim, and the flower petals as she looks directly into the camera. Slow intimate push-in, very shallow depth of field, warm natural skin tones, crisp floral detail, dreamy luxury beauty-film finish, subtle birdsong and soft garden ambience.',
  },
];

export const EXAMPLES_BY_SLUG = new Map(
  EXAMPLES.map((clip) => [clip.slug, clip])
);

export function getExamplePrompt(file: string): string {
  return EXAMPLES.find((clip) => clip.file === file)?.prompt ?? '';
}
