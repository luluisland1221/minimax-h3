export type BlogFaq = { question: string; answer: string };

export const blogFaqs: Record<string, BlogFaq[]> = {
  'what-is-minimax-h3': [
    { question: 'What is MiniMax H3?', answer: 'MiniMax H3 is a multimodal AI video model that generates synchronized video and stereo audio from text, images, video, and audio references.' },
    { question: 'How long can a MiniMax H3 video be?', answer: 'The documented V2 generation workflow supports integer durations from 4 to 15 seconds.' },
    { question: 'Can MiniMax H3 generate 2K video?', answer: 'Yes. The documented resolution options include 768P and direct 2K output.' },
    { question: 'Does MiniMax H3 generate audio?', answer: 'Yes. MiniMax H3 can generate synchronized stereo audio, including dialogue, ambience, sound effects, and music direction.' },
  ],
  'minimax-h3-cost': [
    { question: 'How many credits does a four-second MiniMax H3 video use?', answer: 'On minimaxh3.pro, a four-second output uses 100 credits at 768P or 160 credits at 2K before billable reference-input adjustments.' },
    { question: 'How is MiniMax H3 video cost calculated?', answer: 'The base output cost is generated duration multiplied by 25 credits per second for 768P or 40 credits per second for 2K.' },
    { question: 'Can reference media increase the cost?', answer: 'Yes. Billable reference-video seconds and additional reference images can increase the final charge.' },
    { question: 'Where can I see the final credit charge?', answer: 'Check the live Playground estimate before generation and the credit transaction recorded in your account after reconciliation.' },
  ],
  'minimax-h3-comfyui': [
    { question: 'Can MiniMax H3 run in ComfyUI?', answer: 'MiniMax H3 can be used through community and ecosystem ComfyUI workflows when compatible nodes, model files, and sufficient hardware are available.' },
    { question: 'Is ComfyUI required to use MiniMax H3?', answer: 'No. ComfyUI is a local workflow option; the online workspace can run generation without a local node graph or model download.' },
    { question: 'What should I verify before downloading a workflow?', answer: 'Verify the node repository, model revision, file hashes when provided, license terms, VRAM assumptions, and whether the workflow targets the same H3 release.' },
    { question: 'When is an online workflow more practical?', answer: 'An online workflow is usually more practical when local VRAM, storage, setup time, or maintenance is more costly than usage-based generation.' },
  ],
  'minimax-h3-native-audio': [
    { question: 'Does MiniMax H3 generate native audio?', answer: 'Yes. MiniMax H3 can generate synchronized stereo audio as part of the video result rather than requiring a separate post-production audio pass.' },
    { question: 'Can MiniMax H3 generate dialogue and lip sync?', answer: 'It can generate dialogue with synchronized mouth movement, but accuracy still depends on prompt clarity, shot design, language, face visibility, and scene complexity.' },
    { question: 'How should sound be described in a prompt?', answer: 'Specify the speaker, exact dialogue, voice quality, ambience, sound effects, music, timing, and any sounds that must be excluded.' },
    { question: 'How can audio continuity improve across shots?', answer: 'Keep voice identity, room tone, music, acoustic space, and transition instructions consistent, then evaluate with headphones before final delivery.' },
  ],
  'minimax-h3-vram-requirements': [
    { question: 'How much VRAM does MiniMax H3 require?', answer: 'There is no single universal VRAM figure because requirements depend on model revision, precision, quantization, resolution, frame count, offloading, and the selected workflow.' },
    { question: 'Can an RTX 5090 run MiniMax H3 locally?', answer: 'An RTX 5090 is a strong local option, but successful runs still depend on the exact checkpoint, precision, node implementation, system RAM, and workflow settings.' },
    { question: 'Does quantization reduce VRAM usage?', answer: 'Quantization can reduce memory use, but compatibility, speed, and output quality may change and should be tested with the exact workflow.' },
    { question: 'Is system RAM important for local generation?', answer: 'Yes. Model loading and CPU or RAM offloading can require substantial system memory even when the GPU has enough VRAM for active computation.' },
  ],
  'minimax-h3-open-source': [
    { question: 'Is MiniMax H3 open source?', answer: 'MiniMax H3 has official open-weight resources, but open weights do not automatically mean that every service component, training asset, or hosted feature is open source.' },
    { question: 'What does open weight mean?', answer: 'Open weight means downloadable trained model parameters are available under stated terms; it does not by itself guarantee open training data, training code, or unrestricted commercial use.' },
    { question: 'Can MiniMax H3 be used commercially?', answer: 'Commercial use depends on the license attached to the exact model files and on any separate platform or service terms, so users should verify the current primary documents.' },
    { question: 'Is the hosted API the same as local weights?', answer: 'Not necessarily. Hosted services can include orchestration, preprocessing, optimized inference, moderation, or output stages that are not identical to a local checkpoint workflow.' },
  ],
  'minimax-h3-reference-to-video-guide': [
    { question: 'What is MiniMax H3 reference-to-video?', answer: 'Reference-to-video uses supplied images, video, or audio to guide identity, appearance, motion, camera rhythm, voice, ambience, or style in a generated result.' },
    { question: 'How many references should I use?', answer: 'Use the smallest set that clearly defines the required identity, motion, sound, and visual direction; redundant or conflicting references can make control less predictable.' },
    { question: 'Can reference video control camera movement?', answer: 'Yes. A reference video can guide movement and camera rhythm when the prompt explicitly states what should be transferred and what should not be copied.' },
    { question: 'How do I prevent unwanted reference details?', answer: 'Assign a clear role to every reference and state exclusions for background, clothing, identity, text, sound, or motion details that should not transfer.' },
  ],
  'minimax-h3-vs-seedance': [
    { question: 'Is MiniMax H3 better than Seedance 2.0?', answer: 'Neither model is universally better. The result depends on whether the task prioritizes material detail, reference control, audio, motion choreography, text, cost, or local workflow options.' },
    { question: 'Which comparison method is fairest?', answer: 'Use the same prompt, reference files, duration, aspect ratio, output tier, retry limit, and evaluation criteria, then disclose the platforms and test date.' },
    { question: 'Which model is cheaper?', answer: 'Cost depends on provider, resolution, duration, subscription discounts, reference inputs, and retries, so compare the actual charge for the same test configuration.' },
    { question: 'Should I test both models before production?', answer: 'Yes. A matched test using your real subject, motion, text, and audio requirements is more reliable than selecting a model from showcase clips alone.' },
  ],
};

export function faqPageSchema(faqs: BlogFaq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
