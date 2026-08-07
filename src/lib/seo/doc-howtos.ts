type HowToDefinition = {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
};

export const docHowTos: Record<string, HowToDefinition> = {
  'getting-started': {
    name: 'How to create your first MiniMax H3 video',
    description: 'Choose a MiniMax H3 generation mode, write a focused direction, select settings, generate, and save the result.',
    steps: [
      { name: 'Explore the workspace', text: 'Review the public examples and generation modes before signing in.' },
      { name: 'Sign in with Google', text: 'Sign in to access credits, generation, and saved video history.' },
      { name: 'Choose the correct mode', text: 'Select text to video, first and last frame, or multimodal reference.' },
      { name: 'Write a focused direction', text: 'Describe the subject, action, camera, look, sound, and constraints.' },
      { name: 'Select output settings', text: 'Choose duration, resolution, and aspect ratio and review the credit estimate.' },
      { name: 'Generate and monitor progress', text: 'Submit the job and monitor its asynchronous progress.' },
      { name: 'Review and save the result', text: 'Open the completed video and confirm it appears in Video History.' },
    ],
  },
  'text-to-video': {
    name: 'How to generate a MiniMax H3 text-to-video clip',
    description: 'Plan one shot, write a structured prompt, choose output settings, direct audio, and iterate efficiently.',
    steps: [
      { name: 'Design the shot', text: 'Define the subject, action, setting, camera, visual treatment, and sound before writing prose.' },
      { name: 'Write the prompt', text: 'Use a structured directing brief with clear action beats and constraints.' },
      { name: 'Choose the aspect ratio', text: 'Select the ratio that matches the final delivery format.' },
      { name: 'Choose resolution and duration', text: 'Start with an economical test and use 2K for a justified final pass.' },
      { name: 'Direct synchronized audio', text: 'Specify dialogue, effects, ambience, music, and timing.' },
      { name: 'Generate and iterate', text: 'Submit the job and change one prompt dimension at a time between tests.' },
    ],
  },
  'first-last-frame': {
    name: 'How to use MiniMax H3 first and last frames',
    description: 'Prepare compatible endpoint images, direct the transition, choose settings, and test motion in stages.',
    steps: [
      { name: 'Prepare source images', text: 'Use clear, compatible images with the intended composition and subject identity.' },
      { name: 'Choose frame control', text: 'Upload a first frame alone or supply both first and last frames.' },
      { name: 'Check endpoint compatibility', text: 'Reduce unexplained changes in identity, geometry, lighting, and composition.' },
      { name: 'Direct the motion', text: 'Describe movement and camera behavior between the endpoints.' },
      { name: 'Choose duration and resolution', text: 'Use a short economical test before increasing duration or resolution.' },
      { name: 'Generate and review', text: 'Submit the job and inspect the full transition for continuity and artifacts.' },
    ],
  },
  'multimodal-reference': {
    name: 'How to use MiniMax H3 multimodal references',
    description: 'Assign roles to image, video, and audio references and state the desired relationships in the prompt.',
    steps: [
      { name: 'Choose reference mode', text: 'Use multimodal reference without mixing it with first or last frame mode.' },
      { name: 'Assign one job to every asset', text: 'Choose whether each file controls identity, design, motion, camera, voice, ambience, or music.' },
      { name: 'Write the relationships', text: 'State what each reference should transfer and what it should not copy.' },
      { name: 'Choose output settings', text: 'Select ratio, duration, and resolution and review the credit estimate.' },
      { name: 'Generate a controlled test', text: 'Begin with the smallest useful reference set and add assets one at a time.' },
      { name: 'Diagnose unwanted transfer', text: 'Remove conflicts and strengthen exclusions when unwanted details appear.' },
    ],
  },
  prompting: {
    name: 'How to write a MiniMax H3 prompt',
    description: 'Build a directing brief from format, subject, action, camera, visual treatment, sound, and constraints.',
    steps: [
      { name: 'Set the objective', text: 'Define the purpose, duration, and intended output format.' },
      { name: 'Describe subject and setting', text: 'Identify the important subject attributes and environment.' },
      { name: 'Write action beats', text: 'State what happens first, next, and last.' },
      { name: 'Direct the camera', text: 'Specify shot size, angle, movement, focus, and cuts.' },
      { name: 'Define the look', text: 'Describe lighting, palette, texture, and realism.' },
      { name: 'Direct dialogue and sound', text: 'Specify speech, voice, effects, ambience, music, and timing.' },
      { name: 'Add constraints and iterate', text: 'State consistency requirements and change one layer at a time.' },
    ],
  },
  'video-history': {
    name: 'How to find and manage a MiniMax H3 generated video',
    description: 'Open Video History, read task and storage status, copy the durable link, and diagnose missing results.',
    steps: [
      { name: 'Open My Videos', text: 'Open the account video-history page after signing in.' },
      { name: 'Check task status', text: 'Identify whether the generation is queued, processing, completed, or failed.' },
      { name: 'Check storage status', text: 'Confirm whether the result still uses a provider link or has been stored durably.' },
      { name: 'Copy the video link', text: 'Use the available stored result link for viewing or downstream work.' },
      { name: 'Refresh long-running work', text: 'Refresh the record when an asynchronous provider task is still processing.' },
      { name: 'Contact support if needed', text: 'Provide the account email and generation or task identifier when requesting help.' },
    ],
  },
};

export function howToSchema(definition: HowToDefinition, url: string) {
  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: definition.name,
    description: definition.description,
    url,
    step: definition.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
