'use client';

import { getH3ReservedCredits } from '@/lib/minimax-h3-pricing';
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Box,
  Camera,
  Check,
  Clapperboard,
  Copy,
  Film,
  Gauge,
  Image as ImageIcon,
  Layers3,
  LoaderCircle,
  Maximize2,
  Mic2,
  MonitorPlay,
  MousePointer2,
  Package,
  Play,
  ShoppingBag,
  Sparkles,
  Upload,
  Users,
  WandSparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

const videoBase = '/videos/minimax-h3';

const prompts = [
  {
    category: 'Cinematic',
    title: 'Neon rain pursuit',
    prompt:
      'A lone courier runs through a rain-soaked neon market at midnight. Handheld tracking shot, shallow depth of field, practical reflections, urgent footsteps and distant sirens, cinematic 24fps.',
  },
  {
    category: 'Product',
    title: 'Luxury reveal',
    prompt:
      'A sculptural perfume bottle rotates on black volcanic glass. A ribbon of crimson light travels across the surface, macro lens, precise brand-safe text, soft atmospheric sound design.',
  },
  {
    category: 'Character',
    title: 'Quiet close-up',
    prompt:
      'Close-up portrait of an astronaut removing her helmet in a silent greenhouse on Mars. Natural breathing, subtle eye movement, warm dawn through dusty glass, slow push-in.',
  },
  {
    category: 'Motion',
    title: 'Fabric choreography',
    prompt:
      'A dancer in a long crimson silk dress turns inside a brutalist concrete gallery. Orbiting camera, fabric motion remains physically coherent, footsteps echo in stereo.',
  },
  {
    category: 'Campaign',
    title: 'Summer campaign',
    prompt:
      'Fast-cut summer sports campaign: ocean sprint, close-up water droplets, bold product hero frame, seamless match cuts, energetic percussion, premium commercial finish.',
  },
  {
    category: 'Worldbuilding',
    title: 'Miniature city',
    prompt:
      'A living miniature city built inside an antique mechanical watch. Camera dives between gears into tiny streets, warm window light, intricate scale, gentle ticking and city ambience.',
  },
  {
    category: 'Performance',
    title: 'Expressive performance',
    prompt:
      'A dramatic close performance in a dim theatre, subtle facial emotion, controlled handheld camera, warm edge light, realistic fabric and skin detail, quiet room tone building into orchestral sound.',
  },
  {
    category: 'Editorial',
    title: 'Editorial motion study',
    prompt:
      'A surreal editorial sequence where glass, chrome, and crimson silk transform between shots. Precise match cuts, slow orbital camera, deep graphite background, tactile sound design.',
  },
];

const galleryPrompts: Record<string, string> = {
  'showcase-film.mp4':
    'Extreme macro cinematic portrait of a golden crested gecko, its enormous textured eye filling the frame. The reptile remains calm while the pupil subtly contracts and the head makes tiny natural movements. Warm amber key light, deep black background, razor-sharp scale detail, very shallow depth of field, slow controlled push-in, premium wildlife documentary photography, quiet natural ambience.',
  'showcase-product.mp4':
    'A dramatic upward-looking commercial shot inside a narrow futuristic city canyon. Symmetrical concrete towers rise toward the night sky while illuminated geometric windows and red industrial lights pulse in sequence. Slow vertical dolly, precise architectural perspective, glossy reflections, dark emerald and crimson color grade, bold centered brand typography remains stable, deep mechanical ambience.',
  'showcase-context.mp4':
    'Surreal cinematic beach performance: a middle-aged man in glasses lies on the sand in close-up while a woman seated behind him gently guides his head through a strange relaxation ritual. Natural coastal daylight, wind moving hair and fabric, subtle facial reactions, handheld documentary framing, realistic skin detail, distant waves and soft beach ambience.',
  'showcase-campaign.mp4':
    'Animated neo-noir opening-title sequence for a film called MIDNIGHT LINE. A blue night train cuts through graphic panels, ticket stubs, clocks, Japanese typography and red route diagrams. Bold screen-print textures, black cobalt and burnt-orange palette, rhythmic editorial cuts, crisp readable lettering, suspenseful rail sounds and pulsing cinematic percussion.',
  'showcase-world.mp4':
    'Extreme beauty close-up of a dark-skinned woman wearing a sculptural mirrored silver visor. The camera glides slowly across the visor edge, eye, nose and lips as soft studio highlights travel over chrome and luminous skin. Minimal white environment, luxury fashion-film lighting, precise reflections, intimate breathing and delicate metallic sound design.',
  'showcase-performance.mp4':
    'A vivid stylized video-game menu comes alive around a rebellious pink-haired fantasy character. The character shifts her weight and reacts with playful attitude while neon green buttons, stickers and hand-drawn interface elements animate cleanly without changing their text. Saturated purple and acid-green palette, punchy game UI sounds, energetic electronic music.',
  'hero.mp4':
    'Cinematic editorial portrait of a young woman with natural curly hair sitting alone at a European sidewalk café. She looks down pensively, then makes a subtle emotional movement as pedestrians drift softly out of focus behind her. Warm afternoon light, shallow depth of field, gentle handheld camera, muted film colors, quiet street ambience and restrained piano.',
  'hf-first-last.mp4':
    'A cozy traditional Japanese family dinner seen across a polished wooden table, with a steaming blue-and-white ramen bowl in the immediate foreground. Begin focused sharply on the noodles, scallions and swirling steam, then perform a slow rack focus to the smiling family conversing in the background. Static cinematic camera, warm shoji-screen daylight, ceramic and chopstick sounds, gentle acoustic guitar and koto.',
  'openart-portrait-1.mp4':
    'High-speed motorsport tracking shot of a professional rider leaning a red racing motorcycle deep into a circuit corner. The camera pans smoothly alongside the bike, wheels spinning with natural motion blur, sponsor graphics remain crisp, asphalt and painted curbs streak past, bright outdoor race-day light, aggressive engine roar and wind.',
  'openart-portrait-3.mp4':
    'A solitary figure moves cautiously through a misty pine forest at dawn. Tall dark trunks pass in layered parallax as the camera follows at shoulder height, cold blue-grey fog drifting between the trees, damp clothing and branches moving naturally, restrained handheld suspense, distant birds, footsteps and low atmospheric tension.',
  'openart-portrait-4.mp4':
    'World War I soldiers advance through a devastated muddy battlefield beneath a heavy blue-grey sky. The camera tracks beside them at ground level as smoke rolls through shattered trees and uniforms react naturally to the wind. Gritty historical realism, desaturated cinematic grade, distant artillery, boots in mud and tense orchestral undertone.',
  'openart-community-1.mp4':
    'Dynamic first-person product-design sequence in a bright studio: hands sketch a flowing multicolor curve on white paper beside a laptop displaying professional design software. Smooth close camera movement, accurate hands and tools, clean desk details, natural daylight, pencil sounds and subtle upbeat creative-work music.',
  'openart-feature-3.mp4':
    'A fearless young woman in a black helmet and streetwear carves rapidly across a sunlit concrete skate bowl. Low-angle tracking camera stays close to the board, hair and clothing respond to speed, wheels grip and slide realistically, crisp midday shadows, energetic urban sports-commercial finish with wheel and wind sound.',
  'h3-direct-2k.mp4':
    'Epic space-opera trailer: a silver-haired female captain stands alone before a colossal curved observation window as the last fleet assembles against a purple nebula. Slow push-in, then cut to her tense close-up as every warship jumps to hyperspace in a blinding blue-white flash and the bridge shakes violently. Native 2K detail, synchronized metallic impacts, sub-bass boom and mournful orchestral score.',
  'r2va-direct-2k.mp4':
    'A stylish young man in a vivid pink suit stands in a windswept green field holding a small black lamb, with white sheep grazing behind him. Preserve his identity, clothing and the animal while he turns naturally and delivers an emotional line to camera. Golden late-afternoon light, gentle handheld framing, realistic lip sync, wind, sheep ambience and soft cinematic music.',
  'openart-h3-4x19.mp4':
    'Elegant Victorian equestrian scene outside a grand stone estate: two aristocratic women in tailored black riding coats and tall top hats sit on white horses. One woman gestures while speaking and the horses shift naturally. Overcast English countryside light, refined period-drama cinematography, subtle camera drift, hoof movement, leather creaks and distant birds.',
  'openart-h3-community-2.mp4':
    'Macro slow-motion shot of an iridescent blue hummingbird hovering beside vivid pink trumpet flowers. Its wings beat in a translucent blur while its beak reaches into a blossom, tiny feathers shimmer from cobalt to turquoise, dark soft-focus garden background, stabilized wildlife camera, natural wing buzz and garden ambience.',
  'openart-h3-community-3.mp4':
    'Dreamlike underwater journey through a richly colored coral reef made of soft blue, lavender and white anemones. Orange clownfish and small yellow reef fish weave naturally between the coral as the camera floats forward, caustic sunlight ripples across every surface, tranquil bubbles and immersive underwater ambience.',
  'openart-h3-community-4.mp4':
    'Sunlit cinematic close-up of a freckled blonde woman wearing a wide woven straw hat, framed behind large pink lilies in a lush summer garden. Dappled bands of sunlight pass through the loose straw weave and paint delicate moving patterns across her green eyes, cheeks, and soft smile. A light breeze gently stirs her hair, the hat brim, and the flower petals as she looks directly into the camera. Slow intimate push-in, very shallow depth of field, warm natural skin tones, crisp floral detail, dreamy luxury beauty-film finish, subtle birdsong and soft garden ambience.',
};

const faqs = [
  [
    'What can I use as input?',
    'H3 is designed for multimodal direction. You can describe a scene in text and combine image, video, and audio references when the generation route is connected.',
  ],
  [
    'How long can a generated video be?',
    'MiniMax states that H3 can generate videos up to 15 seconds, including multi-shot sequences, with native synchronized audio.',
  ],
  [
    'Does H3 generate sound?',
    'Yes. H3 can generate dialogue, sound effects, music, and atmosphere together with video as native stereo audio.',
  ],
  [
    'What resolution does H3 support?',
    'H3 supports native 2K generation. Available output options may vary according to the API provider and generation settings you connect.',
  ],
  [
    'Are my uploads private?',
    'Your production privacy and retention behavior will depend on the storage and model provider configuration. Review the privacy policy before enabling real uploads.',
  ],
  [
    'Is this the official MiniMax website?',
    'No. Minimax H3 is an independent third-party service and is not affiliated with, endorsed by, or operated by MiniMax.',
  ],
];

function SectionTitle({
  eyebrow,
  title,
  copy,
}: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-2xl">
      <p className="bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#8d536f] bg-clip-text text-xs font-semibold uppercase tracking-[.28em] text-transparent">
        {eyebrow}
      </p>
      <h2 className="mt-5 font-serif text-4xl leading-[1.02] tracking-[-.045em] text-white sm:text-6xl">
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/52 sm:text-lg">
        {copy}
      </p>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[820px] overflow-hidden border-b border-white/10">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="MiniMax H3 generated cinematic video"
      >
        <source src={`${videoBase}/hero.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#090709_0%,rgba(9,7,9,.94)_35%,rgba(9,7,9,.28)_72%,rgba(9,7,9,.45)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b090b] to-transparent" />
      <div className="relative mx-auto flex min-h-[820px] max-w-7xl items-center px-6 py-28 lg:px-10">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#EC435B]/40 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#ff94a3] backdrop-blur-xl">
            <Sparkles className="size-3.5" /> Native multimodal video
          </div>
          <h1 className="text-balance font-serif text-6xl leading-[.91] tracking-[-.06em] text-white sm:text-7xl lg:text-[104px]">
            MiniMax H3{' '}
            <span className="bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#9b6a87] bg-clip-text text-transparent">
              AI Video Generator
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/68 sm:text-xl">
            Create cinematic AI videos with MiniMax H3 using text, image, video,
            and audio references—all from one streamlined creative workspace.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#playground"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-7 font-semibold text-white shadow-[0_0_60px_rgba(204,52,110,.3)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Create a video{' '}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#showcase"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-7 font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              <Play className="size-4 fill-white" /> Watch examples
            </a>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[.16em] text-white/45">
            <span>Native 2K</span>
            <span>24 FPS</span>
            <span>Up to 15s</span>
            <span>Stereo audio</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs text-white/55 backdrop-blur lg:block">
        H3-generated footage
      </div>
    </section>
  );
}

function PlaygroundSection({
  prompt,
  setPrompt,
}: {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
}) {
  const [mode, setMode] = useState('Text to video');
  const [resolution, setResolution] = useState<'768P' | '2K'>('2K');
  const [duration, setDuration] = useState(5);
  const [ratio, setRatio] = useState('16:9');
  const [firstFrameUrl, setFirstFrameUrl] = useState('');
  const [lastFrameUrl, setLastFrameUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [referenceVideoUrl, setReferenceVideoUrl] = useState('');
  const [referenceAudioUrl, setReferenceAudioUrl] = useState('');
  const [aigcWatermark, setAigcWatermark] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const referenceVideoCount = referenceVideoUrl
    .split(/[\s,]+/)
    .filter(Boolean).length;
  const referenceImageCount = referenceImageUrl
    .split(/[\s,]+/)
    .filter(Boolean).length;
  const estimatedCredits = getH3ReservedCredits({
    resolution,
    duration,
    referenceVideoCount:
      mode === 'Multimodal reference' ? referenceVideoCount : 0,
    referenceImageCount:
      mode === 'Multimodal reference' ? referenceImageCount : 0,
  });

  const generateVideo = async () => {
    setGenerationError('');
    setGeneratedVideoUrl('');
    setGenerationStatus('Submitting');
    setGenerationProgress(6);
    setActiveTaskId('');
    setIsGenerating(true);
    try {
      const response = await fetch('/api/minimax/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode:
            mode === 'Text to video'
              ? 'text'
              : mode === 'First & last frame'
                ? 'frames'
                : 'reference',
          prompt,
          resolution,
          duration,
          ratio,
          firstFrameUrl,
          lastFrameUrl,
          referenceImageUrls: referenceImageUrl.split(/[\s,]+/).filter(Boolean),
          referenceVideoUrls: referenceVideoUrl.split(/[\s,]+/).filter(Boolean),
          referenceAudioUrls: referenceAudioUrl.split(/[\s,]+/).filter(Boolean),
          aigcWatermark,
        }),
      });
      const created = (await response.json()) as {
        task_id?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(created.error ?? 'Could not create task.');
      if (!created.task_id)
        throw new Error('MiniMax did not return a generation task ID.');
      setActiveTaskId(created.task_id);
      setGenerationStatus('Queued');
      setGenerationProgress(16);
      for (let attempt = 0; attempt < 120; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const queryResponse = await fetch(
          `/api/minimax/video/${created.task_id}`,
          { cache: 'no-store' }
        );
        const query = (await queryResponse.json()) as {
          error?: string;
          task?: {
            status?: string;
            content?: { url?: string };
            error?: { message?: string };
          };
        };
        if (!queryResponse.ok)
          throw new Error(query.error ?? 'Could not query task.');
        const status = query.task?.status ?? 'queued';
        setGenerationStatus(status.charAt(0).toUpperCase() + status.slice(1));
        if (status === 'queued')
          setGenerationProgress(Math.min(28, 16 + attempt));
        if (status === 'running')
          setGenerationProgress(Math.min(92, 32 + attempt * 3));
        if (status === 'succeeded' && query.task?.content?.url) {
          setGenerationStatus('Ready');
          setGenerationProgress(100);
          setGeneratedVideoUrl(query.task.content.url);
          return;
        }
        if (status === 'failed' || status === 'cancelled')
          throw new Error(
            query.task?.error?.message ?? `Generation ${status}.`
          );
      }
      throw new Error('Generation is still running. Please try again shortly.');
    } catch (error) {
      setGenerationProgress(0);
      setGenerationError(
        error instanceof Error ? error.message : 'Generation failed.'
      );
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <section
      id="playground"
      className="relative overflow-hidden px-6 pb-28 pt-20 lg:px-10 lg:pt-28"
    >
      <video
        className="absolute inset-0 size-full object-cover opacity-85"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="MiniMax H3 hero background"
      >
        <source src={`${videoBase}/hero.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,8,.78)_0%,rgba(8,6,8,.58)_50%,rgba(8,6,8,.38)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b090b] to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EC435B]/35 bg-[#EC435B]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#ff91a1]">
            <Sparkles className="size-3.5" /> Native multimodal video
          </div>
          <h1 className="text-balance font-serif text-5xl leading-[.94] tracking-[-.055em] text-white sm:text-7xl lg:text-[88px]">
            MiniMax H3{' '}
            <span className="bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#9b6a87] bg-clip-text text-transparent">
              AI Video Generator
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Create videos up to 2K with synchronized stereo audio from text,
            images, video, and audio references in one online workspace.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-[32px] border border-white/12 bg-[#110e11] shadow-[0_35px_100px_rgba(0,0,0,.5)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4">
            {[
              'Text to video',
              'First & last frame',
              'Multimodal reference',
            ].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setMode(item);
                  if (item === 'First & last frame') setRatio('adaptive');
                  if (item === 'Text to video' && ratio === 'adaptive')
                    setRatio('16:9');
                }}
                className={`rounded-full px-4 py-2 text-sm transition ${mode === item ? 'bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] text-white' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
            <div className="ml-auto rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/35">
              Model: MiniMax H3
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_.72fr]">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <label
                htmlFor="h3-prompt"
                className="text-xs font-semibold uppercase tracking-[.2em] text-white/38"
              >
                Describe your scene
              </label>
              <textarea
                id="h3-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="mt-4 min-h-44 w-full resize-none bg-transparent text-lg leading-8 text-white outline-none placeholder:text-white/25"
              />
              {mode === 'First & last frame' ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input
                    value={firstFrameUrl}
                    onChange={(event) => setFirstFrameUrl(event.target.value)}
                    placeholder="First frame public image URL"
                    className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EC435B]/60"
                  />
                  <input
                    value={lastFrameUrl}
                    onChange={(event) => setLastFrameUrl(event.target.value)}
                    placeholder="Last frame public image URL (optional)"
                    className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EC435B]/60"
                  />
                </div>
              ) : null}
              {mode === 'Multimodal reference' ? (
                <div className="mt-5 grid gap-3">
                  <input
                    value={referenceImageUrl}
                    onChange={(event) =>
                      setReferenceImageUrl(event.target.value)
                    }
                    placeholder="Reference image public URL (up to 9 supported)"
                    className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EC435B]/60"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={referenceVideoUrl}
                      onChange={(event) =>
                        setReferenceVideoUrl(event.target.value)
                      }
                      placeholder="Reference video URL"
                      className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EC435B]/60"
                    />
                    <input
                      value={referenceAudioUrl}
                      onChange={(event) =>
                        setReferenceAudioUrl(event.target.value)
                      }
                      placeholder="Reference audio URL"
                      className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#EC435B]/60"
                    />
                  </div>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/45">
                <select
                  value={ratio}
                  onChange={(event) => setRatio(event.target.value)}
                  disabled={mode === 'First & last frame'}
                  className="rounded-lg border border-white/10 bg-[#191419] px-3 py-2 text-white outline-none disabled:opacity-40"
                >
                  {(mode === 'First & last frame'
                    ? ['adaptive']
                    : [
                        '21:9',
                        '16:9',
                        '4:3',
                        '1:1',
                        '3:4',
                        '9:16',
                        ...(mode === 'Multimodal reference'
                          ? ['adaptive']
                          : []),
                      ]
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  className="rounded-lg border border-white/10 bg-[#191419] px-3 py-2 text-white outline-none"
                >
                  {Array.from({ length: 12 }, (_, index) => index + 4).map(
                    (seconds) => (
                      <option key={seconds} value={seconds}>
                        {seconds} sec
                      </option>
                    )
                  )}
                </select>
                <select
                  value={resolution}
                  onChange={(event) =>
                    setResolution(event.target.value as '768P' | '2K')
                  }
                  className="rounded-lg border border-white/10 bg-[#191419] px-3 py-2 text-white outline-none"
                >
                  <option value="768P">768P</option>
                  <option value="2K">2K</option>
                </select>
                <label className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={aigcWatermark}
                    onChange={(event) => setAigcWatermark(event.target.checked)}
                  />{' '}
                  AIGC watermark
                </label>
                <span
                  className="rounded-lg border border-[#EC435B]/20 bg-[#EC435B]/8 px-3 py-2 font-medium text-[#ff9aaa]"
                  title="Reference-video jobs reserve up to 15 input seconds; unused credits are returned after completion."
                >
                  {estimatedCredits} credits
                </span>
                <button
                  type="button"
                  onClick={generateVideo}
                  disabled={isGenerating || !prompt.trim()}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <WandSparkles className="size-4" />
                  )}{' '}
                  {isGenerating ? generationStatus : 'Generate'}
                </button>
              </div>
              {generationError ? (
                <p className="mt-3 text-sm text-red-300">{generationError}</p>
              ) : null}
              {isGenerating ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium text-white/65">
                      {generationStatus}
                    </span>
                    <span className="tabular-nums text-[#ff91a1]">
                      {generationProgress}%
                    </span>
                  </div>
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8"
                    role="progressbar"
                    aria-label="Video generation progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={generationProgress}
                    tabIndex={0}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#9b6a87] shadow-[0_0_18px_rgba(236,67,91,.55)] transition-[width] duration-700 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  {activeTaskId ? (
                    <p className="mt-2 truncate font-mono text-[10px] text-white/25">
                      Task {activeTaskId}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="relative flex min-h-96 items-center justify-center overflow-hidden bg-[#100d10] p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(236,67,91,.14),transparent_34%),radial-gradient(circle_at_78%_76%,rgba(88,60,80,.28),transparent_38%)]" />
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:40px_40px]" />
              {generatedVideoUrl ? (
                // biome-ignore lint/a11y/useMediaCaption: The generation API does not return a caption track.
                <video
                  src={generatedVideoUrl}
                  className="absolute inset-0 z-10 size-full bg-black object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : null}
              <div className="absolute inset-4 rounded-[24px] border border-white/8" />
              {isGenerating && !generatedVideoUrl ? (
                <div className="relative w-full max-w-xs text-center">
                  <LoaderCircle className="mx-auto size-7 animate-spin text-[#EC435B]" />
                  <p className="mt-4 text-sm text-white/50">
                    {generationStatus}
                  </p>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#9b6a87] transition-[width] duration-700"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs tabular-nums text-white/30">
                    {generationProgress}%
                  </p>
                </div>
              ) : !generatedVideoUrl ? (
                <div className="relative max-w-xs text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#EC435B]/20 bg-gradient-to-br from-[#EC435B]/12 via-[#CC346E]/8 to-[#583C50]/20 shadow-[0_0_50px_rgba(204,52,110,.12)]">
                    <Clapperboard className="size-6 text-[#EC435B]" />
                  </div>
                  <p className="mt-5 text-sm font-medium text-white/65">
                    Your video will appear here
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/30">
                    Describe a scene, choose your settings, and generate.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoShowcase({
  onTryPrompt,
  prompt,
  setPrompt,
}: {
  onTryPrompt: (prompt: string) => void;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
}) {
  const showcaseRef = useRef<HTMLElement>(null);
  const [showCompactPrompt, setShowCompactPrompt] = useState(false);
  useEffect(() => {
    const section = showcaseRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowCompactPrompt(entry.isIntersecting),
      { threshold: 0.02 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  const videos = [
    ['showcase-film.mp4', 'Cinematic storytelling', 'aspect-[4/5]'],
    ['showcase-product.mp4', 'Commercial product film', 'aspect-[4/3]'],
    ['showcase-context.mp4', 'Multimodal direction', 'aspect-video'],
    ['showcase-campaign.mp4', 'Campaign filmmaking', 'aspect-[4/5]'],
    ['showcase-world.mp4', 'Worldbuilding sequence', 'aspect-square'],
    ['showcase-performance.mp4', 'Expressive performance', 'aspect-[3/4]'],
    ['hero.mp4', 'Editorial motion study', 'aspect-video'],
    ['hf-first-last.mp4', 'First and last frame control', 'aspect-square'],
    ['openart-portrait-1.mp4', 'Portrait motion study', 'aspect-[9/16]'],
    ['openart-portrait-3.mp4', 'Vertical campaign story', 'aspect-[9/16]'],
    ['openart-portrait-4.mp4', 'Social film concept', 'aspect-[9/16]'],
    ['openart-community-1.mp4', 'Community H3 creation', 'aspect-[9/16]'],
    ['openart-feature-3.mp4', 'Cinematic character study', 'aspect-[9/16]'],
    ['h3-direct-2k.mp4', 'Direct native 2K output', 'aspect-video'],
    ['r2va-direct-2k.mp4', 'Direct reference transfer in 2K', 'aspect-video'],
    ['openart-h3-4x19.mp4', 'Vertical H3 visual experiment', 'aspect-[9/16]'],
    ['openart-h3-community-2.mp4', 'Community motion concept', 'aspect-[9/16]'],
    [
      'openart-h3-community-3.mp4',
      'Community cinematic scene',
      'aspect-[9/16]',
    ],
    ['openart-h3-community-4.mp4', 'Sunlit floral portrait', 'aspect-[9/16]'],
  ];
  const videoColumns = Array.from({ length: 3 }, (_, columnIndex) =>
    videos
      .map((video, index) => ({ video, index }))
      .filter(({ index }) => index % 3 === columnIndex)
  );
  const middleColumnLast = videoColumns[1].pop();
  if (middleColumnLast) videoColumns[2].push(middleColumnLast);
  return (
    <section
      ref={showcaseRef}
      id="showcase"
      className="relative border-y border-white/10 bg-[#0d0b0d] py-24"
    >
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <SectionTitle
          eyebrow="H3 showcase"
          title="See what MiniMax H3 can create."
          copy="Explore authorized H3 video examples with multimodal direction, character consistency, product motion, native sound, and multi-shot storytelling. Hover to play, then try any prompt."
        />
        <div className="mt-14 grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          {videoColumns.map((column, columnIndex) => (
            <div className="flex min-w-0 flex-col gap-4" key={columnIndex}>
              {column.map(({ video }) => (
                <article
                  key={video[0]}
                  className="group relative overflow-hidden rounded-2xl border border-[#583C50]/45 bg-black shadow-[0_20px_60px_rgba(0,0,0,.3)] transition duration-300 hover:z-10 hover:border-[#CC346E]/80"
                  onMouseEnter={(event) =>
                    void event.currentTarget.querySelector('video')?.play()
                  }
                  onMouseLeave={(event) =>
                    event.currentTarget.querySelector('video')?.pause()
                  }
                >
                  <video
                    src={`${videoBase}/${video[0]}`}
                    className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100810]/90 via-transparent to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#b0839d] bg-clip-text text-[10px] font-semibold uppercase tracking-[.2em] text-transparent">
                      Official H3 example
                    </p>
                    <h3 className="mt-1 text-base font-medium text-white">
                      {video[1]}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onTryPrompt(galleryPrompts[video[0]])}
                      className="mt-3 w-full translate-y-2 rounded-xl bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-4 py-2.5 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:brightness-110"
                    >
                      Try this <ArrowRight className="ml-1 inline size-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
        {showCompactPrompt && (
          <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-white/12 bg-[#17131a]/90 p-2 shadow-[0_20px_80px_rgba(0,0,0,.65)] backdrop-blur-2xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Add reference"
              >
                <Upload className="size-4" />
              </button>
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe your scene..."
                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => onTryPrompt(prompt)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Generate
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ModelSection() {
  const cards = [
    [
      Maximize2,
      'Direct 2K output',
      'Generate at 768P or 2K through the official MiniMax H3 video generation API.',
    ],
    [
      AudioLines,
      'Synchronized stereo audio',
      'Dialogue, sound effects, music, and atmosphere can be generated in sync with the picture.',
    ],
    [
      Layers3,
      'Multimodal context',
      'Combine text, image, video, and audio references in a unified creative instruction.',
    ],
    [
      Film,
      'Multi-shot video',
      'Plan more complete visual beats inside clips up to 15 seconds long.',
    ],
    [
      Gauge,
      '24 FPS motion',
      'Film-standard cadence supports smoother editing and more cinematic movement.',
    ],
    [
      BadgeCheck,
      'First & last frame control',
      'Guide how a shot begins and ends while H3 creates the movement and transition between them.',
    ],
  ];
  return (
    <section
      id="features"
      className="border-y border-white/10 bg-[#100d10] py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionTitle
          eyebrow="MiniMax H3 video model features"
          title="One model. Fewer creative boundaries."
          copy="MiniMax H3 brings generation, multimodal reference, shot control, and synchronized sound into one creative system."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(([Icon, title, text], index) => {
            const CardIcon = Icon as typeof Maximize2;
            return (
              <article
                key={title as string}
                className="min-h-64 bg-[#121012] p-7 transition hover:bg-[#191217]"
              >
                <div className="flex items-center justify-between">
                  <CardIcon className="size-6 text-[#EC435B]" />
                  <span className="font-mono text-xs text-white/20">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-16 text-xl font-semibold">
                  {title as string}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/45">
                  {text as string}
                </p>
              </article>
            );
          })}
        </div>
        <div className="mt-12 grid gap-7 border-t border-white/10 pt-10 sm:grid-cols-4">
          {[
            ['2K', 'direct output'],
            ['24', 'frames per second'],
            ['15s', 'per generation'],
            ['4', 'input modalities'],
          ].map(([value, label]) => (
            <div key={label}>
              <strong className="font-serif text-5xl font-normal">
                {value}
              </strong>
              <p className="mt-2 text-sm text-white/38">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    [
      ShoppingBag,
      'Advertising',
      'Produce complete product moments, campaign concepts, and social cuts.',
    ],
    [
      Clapperboard,
      'Film & previsualization',
      'Explore camera choreography, mood, pacing, and character performance.',
    ],
    [
      Package,
      'E-commerce',
      'Turn product references into polished, high-resolution visual stories.',
    ],
    [
      MonitorPlay,
      'Social & UGC content',
      'Create attention-grabbing social concepts, creator-style scenes, and campaign variations.',
    ],
    [
      Users,
      'Character storytelling',
      'Hold visual identity, wardrobe, movement, and voice across a sequence.',
    ],
    [
      Box,
      'Games & worldbuilding',
      'Prototype environments, cinematic trailers, and narrative atmosphere.',
    ],
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <SectionTitle
        eyebrow="Applications"
        title="Built for real video production."
        copy="Use MiniMax H3 for advertising, product videos, cinematic concepts, social content, character storytelling, and game worldbuilding."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cases.map(([Icon, title, text]) => {
          const CaseIcon = Icon as typeof ShoppingBag;
          return (
            <article
              key={title as string}
              className="rounded-[24px] border border-white/10 p-7"
            >
              <CaseIcon className="size-6 text-[#EC435B]" />
              <h3 className="mt-12 text-xl font-semibold">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-white/45">
                {text as string}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: 'Creator',
      price: '$29',
      note: 'For consistent creation',
      features: [
        '2,500 credits / month',
        'Priority generation',
        '2K downloads',
        'Commercial usage',
      ],
      cta: 'Choose Creator',
    },
    {
      name: 'Pro',
      price: '$59',
      note: 'For growing production',
      features: [
        '5,500 credits / month',
        'About 55 four-second 768P videos',
        'Direct 2K output',
        'Commercial usage',
      ],
      cta: 'Choose Pro',
      popular: true,
    },
    {
      name: 'Studio',
      price: '$99',
      note: 'For production teams',
      features: [
        '10,000 credits / month',
        'Best per-credit value',
        'Priority generation',
        'Priority support',
      ],
      cta: 'Choose Studio',
    },
  ];
  const creditPacks = [
    {
      name: 'Boost',
      price: '$50',
      credits: '4,200',
      videos: '42 videos at 4s 768P',
    },
    {
      name: 'Momentum',
      price: '$70',
      credits: '6,000',
      videos: '60 videos at 4s 768P',
    },
    {
      name: 'Scale',
      price: '$100',
      credits: '9,000',
      videos: '90 videos at 4s 768P',
    },
  ];
  return (
    <section
      id="pricing"
      className="border-y border-white/10 bg-[#100d10] py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionTitle
          eyebrow="Pricing"
          title="Choose your production pace."
          copy="Start with free credits, then move to a plan that fits your creative volume. Final generation costs depend on your connected provider."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-[28px] border p-7 ${plan.popular ? 'border-[#CC346E] bg-[linear-gradient(145deg,#1a1015_0%,#20131c_55%,#583C50_180%)] shadow-[0_20px_80px_rgba(204,52,110,.15)]' : 'border-[#583C50]/55 bg-[#121012]'}`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-3 py-1 text-xs font-semibold">
                  Most popular
                </span>
              )}
              <p className="text-sm font-medium text-white/65">{plan.name}</p>
              <div className="mt-7 flex items-end gap-2">
                <strong className="font-serif text-5xl font-normal">
                  {plan.price}
                </strong>
                <span className="pb-1 text-sm text-white/35">/ month</span>
              </div>
              <p className="mt-3 text-sm text-white/38">{plan.note}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-white/62"
                  >
                    <Check className="size-4 text-[#EC435B]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className={`mt-9 flex h-12 items-center justify-center rounded-full text-sm font-semibold transition ${plan.popular ? 'bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] text-white hover:brightness-110' : 'border border-[#583C50]/60 hover:bg-[#583C50]/15'}`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
        <div className="mb-7 mt-20 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#EC435B]">
              One-time credit packs
            </p>
            <h3 className="mt-3 font-serif text-3xl">
              Top up without a subscription.
            </h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/40">
            Purchased credits remain available for 12 months. Monthly plans
            always offer the better per-credit rate.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {creditPacks.map((pack, index) => (
            <article
              key={pack.price}
              className={`relative overflow-hidden rounded-[24px] border p-6 ${index === 1 ? 'border-[#CC346E]/80 bg-[#CC346E]/8' : 'border-[#583C50]/55 bg-[#121012]'}`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EC435B] to-transparent opacity-70" />
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-white/75">
                    {pack.name}
                  </p>
                  <p className="mt-1 text-sm text-white/42">
                    {pack.credits} credits
                  </p>
                  <p className="mt-2 text-xs text-white/28">{pack.videos}</p>
                </div>
                <strong className="font-serif text-4xl font-normal">
                  {pack.price}
                </strong>
              </div>
              <Link
                href="/settings/credits"
                className="mt-8 flex h-11 items-center justify-center rounded-full border border-[#EC435B]/35 text-sm font-semibold text-white transition hover:border-[#EC435B] hover:bg-[#EC435B]/10"
              >
                Buy credits
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-[.72fr_1fr]">
        <SectionTitle
          eyebrow="FAQ"
          title="Questions, answered clearly."
          copy="The essentials about H3, this independent service, and the workspace you are building."
        />
        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map(([question, answer], index) => (
            <details key={question} className="group py-6" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                <span>{question}</span>
                <span className="text-[#EC435B] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-white/48">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-10">
      <div className="relative mx-auto min-h-[620px] max-w-[1500px] overflow-hidden rounded-[42px] border border-[#CC346E]/45 bg-black">
        <video
          src={`${videoBase}/showcase-context.mp4`}
          className="absolute inset-0 size-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,5,8,.98)_8%,rgba(20,8,16,.78)_48%,rgba(88,60,80,.35)_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(236,67,91,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(204,52,110,.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_right,black,transparent)]" />
        <div className="absolute -right-28 top-1/2 size-[500px] -translate-y-1/2 rounded-full border border-[#EC435B]/25 shadow-[0_0_120px_rgba(204,52,110,.3)] sm:size-[720px]" />
        <div className="absolute -right-12 top-1/2 size-[340px] -translate-y-1/2 animate-pulse rounded-full border border-[#CC346E]/30 sm:size-[520px] [--duration:4s]" />
        <div className="absolute right-16 top-1/2 size-[180px] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#EC435B]/25 via-[#CC346E]/20 to-[#583C50]/40 blur-2xl sm:size-[320px]" />
        <div className="relative flex min-h-[620px] items-center px-7 py-20 sm:px-14 lg:px-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs uppercase tracking-[.23em] text-white/65 backdrop-blur-xl">
              <span className="size-2 rounded-full bg-[#EC435B] shadow-[0_0_16px_#EC435B]" />{' '}
              Ready when you are
            </div>
            <h2 className="mt-8 font-serif text-6xl leading-[.92] tracking-[-.06em] text-white sm:text-8xl lg:text-[112px]">
              Make the frame
              <br />
              <span className="bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#9d718b] bg-clip-text text-transparent">
                move you.
              </span>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/55">
              Bring the subject, camera, sound, and feeling. H3 brings them into
              the same scene.
            </p>
            <Link
              href="/auth/register"
              className="group mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-8 font-semibold text-white shadow-[0_0_70px_rgba(204,52,110,.35)] transition hover:scale-[1.03] hover:brightness-110"
            >
              Enter the studio{' '}
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#3a2031]">
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MinimaxH3Home() {
  const [prompt, setPrompt] = useState('');
  const applyShowcasePrompt = (nextPrompt: string) => {
    setPrompt(nextPrompt);
    window.requestAnimationFrame(() => {
      document
        .getElementById('playground')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(
        () => document.getElementById('h3-prompt')?.focus(),
        650
      );
    });
  };
  return (
    <main className="overflow-hidden bg-[#0b090b] text-white">
      <PlaygroundSection prompt={prompt} setPrompt={setPrompt} />
      <VideoShowcase
        onTryPrompt={applyShowcasePrompt}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <ModelSection />
      <UseCases />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
