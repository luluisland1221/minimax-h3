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
  'minimax-h3-vs-kling-3': [
    { question: 'Is MiniMax H3 better than Kling 3.0?', answer: 'Neither model is universally better. MiniMax H3 is compelling for its unified reference workflow and open-weight path, while Kling 3.0 is a hosted multimodal system with native audio and strong production controls.' },
    { question: 'Which supports native audio?', answer: 'Both MiniMax H3 and Kling 3.0 document native or synchronized audio generation. Test dialogue, ambience, effects, and lip sync with the same prompt before choosing.' },
    { question: 'Which is better for local deployment?', answer: 'MiniMax H3 has official open-weight resources and a clearer path to local experimentation. Kling 3.0 is primarily accessed through Kuaishou products and partner platforms.' },
    { question: 'Which is cheaper?', answer: 'The cheaper option depends on provider pricing, resolution, duration, reference inputs, retries, and subscription discounts. Compare the final cost of matched outputs rather than headline prices.' },
  ],
  'minimax-h3-vs-veo-3': [
    { question: 'Is Veo 3.1 better than MiniMax H3?', answer: 'Not for every workflow. Veo 3.1 and MiniMax H3 have different access models and control systems, so the best choice depends on references, audio, output requirements, budget, and production tooling.' },
    { question: 'Do both generate audio?', answer: 'Yes. Both systems document synchronized or native audio capabilities, but dialogue quality, ambience, effects, and consistency should be evaluated with matched prompts.' },
    { question: 'Which supports local deployment?', answer: 'MiniMax H3 provides official open-weight resources for local experimentation. Veo 3.1 is offered through Google products and APIs rather than downloadable model weights.' },
    { question: 'Which costs less?', answer: 'Cost varies by access route, duration, resolution, retries, and discounts. Record the actual charge for an identical production brief instead of comparing incompatible advertised rates.' },
  ],
  'minimax-h3-vs-sora-2': [
    { question: 'Is MiniMax H3 better than Sora 2?', answer: 'Neither is best for every use case. Compare them using your actual references, audio needs, shot type, safety constraints, duration, and budget.' },
    { question: 'Do both generate synchronized audio?', answer: 'Both MiniMax H3 and Sora 2 describe synchronized video and audio generation. Results still need testing for speech, sound effects, ambience, and temporal alignment.' },
    { question: 'Which can run locally?', answer: 'MiniMax H3 has official open-weight resources that support local experimentation. Sora 2 is accessed through OpenAI products and APIs.' },
    { question: 'Why do safety rules matter in the comparison?', answer: 'Safety and likeness rules affect which people, references, and scenes a system will accept, so they can materially change a real production workflow.' },
  ],
  'minimax-h3-vs-wan': [
    { question: 'Is Wan 2.2 more open than MiniMax H3?', answer: 'Wan 2.2 publishes model resources and code through its official repository, while MiniMax H3 also offers official open-weight resources. Compare the exact licenses and released components rather than relying on the word open.' },
    { question: 'Which needs less VRAM?', answer: 'There is no universal answer because VRAM depends on checkpoint size, precision, quantization, frame count, resolution, and offloading. Test the exact workflow you intend to use.' },
    { question: 'Does Wan 2.2 generate audio?', answer: 'The official Wan 2.2 repository focuses on video generation models. Audio may require a separate workflow, whereas synchronized audio is a core MiniMax H3 capability.' },
    { question: 'Which is cheaper?', answer: 'Local Wan cost depends on hardware, energy, setup time, and retries; hosted MiniMax H3 cost depends on credits and references. Compare total production cost for the same accepted output.' },
  ],
  'minimax-h3-product-video-prompts': [
    { question: 'Can MiniMax H3 preserve a real product?', answer: 'Reference images can improve product consistency, but packaging, geometry, labels, and small details must still be checked frame by frame before commercial use.' },
    { question: 'Should product videos be generated directly in 2K?', answer: 'Use 768P for inexpensive prompt and motion tests, then switch to 2K after the shot direction is stable and worth the higher credit cost.' },
    { question: 'Can MiniMax H3 render exact brand text?', answer: 'It can attempt text and branding, but exact spelling and legal brand assets should be verified and may be safer to add during editing.' },
    { question: 'Which mode is best for e-commerce video?', answer: 'Text to video suits concepts, while first-last-frame or multimodal reference is usually more useful when the real product, packaging, or final composition must be preserved.' },
  ],
  'minimax-h3-ugc-video-prompts': [
    { question: 'Can MiniMax H3 make vertical UGC videos?', answer: 'Yes. Choose a vertical aspect ratio and describe phone-camera framing, natural performance, environment, dialogue, and sound explicitly.' },
    { question: 'How long should UGC dialogue be?', answer: 'Keep dialogue short enough to fit the selected clip duration without rushed speech, then test pronunciation and lip sync before producing variants.' },
    { question: 'Can I use a real creator as a reference?', answer: 'Only use a person likeness or voice when you have the necessary consent and rights, and comply with the platform rules that apply to the generation.' },
    { question: 'Should captions be generated inside the video?', answer: 'For dependable spelling, timing, localization, and accessibility, add final captions during editing rather than relying on generated text.' },
  ],
  'minimax-h3-music-video-workflow': [
    { question: 'Can MiniMax H3 generate a full music video?', answer: 'MiniMax H3 generates short clips, so a full music video should be planned as a sequence of shots that are generated, selected, and assembled in an editor.' },
    { question: 'Can I upload a commercial song as audio reference?', answer: 'Only upload music you own or are licensed to use for this purpose, and verify the applicable generation and distribution rights.' },
    { question: 'Should I keep MiniMax H3 generated music?', answer: 'Keep generated music when it suits the project and rights requirements; otherwise use it as timing guidance and replace it with cleared audio during editing.' },
    { question: 'How do I keep the performer consistent?', answer: 'Use stable identity references, repeat wardrobe and lighting details, limit conflicting instructions, and build the sequence from a controlled shot list.' },
  ],
  'minimax-h3-game-cinematic-prompts': [
    { question: 'Can MiniMax H3 create a complete game trailer?', answer: 'It can generate individual cinematic shots, but a complete trailer still requires shot planning, selection, editing, titles, audio mixing, and quality review.' },
    { question: 'How do I keep armor and weapons consistent?', answer: 'Provide clear reference images, describe invariant design details, keep angles readable, and reject shots where silhouettes, materials, or attachments drift.' },
    { question: 'Is MiniMax H3 suitable for combat scenes?', answer: 'It can produce combat concepts, but complex contact, fast choreography, weapons, and anatomy require short actions, strong references, and careful frame review.' },
    { question: 'Should game UI text be generated in the model?', answer: 'For exact copy and interface fidelity, add UI and typography in post-production. Generated UI is better treated as a visual concept than final functional artwork.' },
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
