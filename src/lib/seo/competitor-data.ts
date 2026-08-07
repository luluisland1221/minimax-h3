export type CompetitorStatus =
  | 'current'
  | 'current-variant'
  | 'legacy-open'
  | 'discontinued';

export type CompetitorProfile = {
  name: string;
  version: string;
  status: CompetitorStatus;
  verifiedOn: string;
  officialSources: string[];
  note: string;
};

/** Editorial source of truth for versioned comparison content. */
export const competitorProfiles: Record<string, CompetitorProfile> = {
  seedance: {
    name: 'Seedance',
    version: '2.5',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://seed.bytedance.com/en/seedance2_5',
      'https://dreamina.capcut.com/seedance/seedance-2-5',
      'https://seed.bytedance.com/en/seedance2_0',
    ],
    note: "Seedance 2.5 is ByteDance Seed's current official model. Dreamina provides product access, but a public ByteDance API was not documented when verified. Seedance 2.0 and 2.0 Mini remain relevant legacy access points.",
  },
  kling: {
    name: 'Kling Video',
    version: '3.0 / 3.0 Omni',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://home.kling.ai/quickstart/klingai-video-3-model-user-guide',
      'https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be',
    ],
    note: 'Kling 3.0 is the current officially documented series.',
  },
  veo: {
    name: 'Google Veo',
    version: '3.1 / 3.1 Lite',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://deepmind.google/models/veo/',
      'https://deepmind.google/models/model-cards/veo-3-1-lite/',
    ],
    note: 'Use Veo 3.1 as the flagship and name Lite only for that variant.',
  },
  sora: {
    name: 'OpenAI Sora',
    version: '2',
    status: 'discontinued',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://openai.com/index/sora-2/',
      'https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation',
    ],
    note: 'The Sora product ended April 26, 2026; the API is scheduled to end September 24, 2026.',
  },
  wanHosted: {
    name: 'Wan',
    version: '2.7',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://www.alibabacloud.com/help/en/model-studio/newly-released-models',
      'https://www.alibabacloud.com/help/en/model-studio/image-to-video-general-api-reference',
    ],
    note: 'Wan 2.7 is the current hosted Model Studio family.',
  },
  wanOpen: {
    name: 'Wan Open Weights',
    version: '2.2',
    status: 'legacy-open',
    verifiedOn: '2026-08-07',
    officialSources: ['https://github.com/Wan-Video/Wan2.2'],
    note: 'Wan 2.2 remains the relevant official open-weight and local-workflow baseline.',
  },
  runway: {
    name: 'Runway Gen',
    version: '4.5',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://runwayml.com/research/introducing-runway-gen-4.5',
      'https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5',
    ],
    note: 'Gen-4.5 is the current generation model; Aleph is an editing workflow.',
  },
  luma: {
    name: 'Luma Ray',
    version: '3.2',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://lumalabs.ai/ray',
      'https://lumalabs.ai/llm-info',
    ],
    note: 'Use a version-neutral URL because point releases change frequently.',
  },
  ltx: {
    name: 'LTX',
    version: '2.3',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://docs.ltx.io/open-source-model/getting-started/overview',
      'https://docs.ltx.io/models',
    ],
    note: 'LTX-2 API variants are deprecated in favor of LTX-2.3.',
  },
  firefly: {
    name: 'Adobe Firefly Video',
    version: 'Firefly Video',
    status: 'current',
    verifiedOn: '2026-08-07',
    officialSources: [
      'https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-text-prompts.html',
      'https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/use-video-as-composition-reference.html',
    ],
    note: 'Keep the URL version-neutral; Adobe exposes Firefly Video alongside partner models.',
  },
};
