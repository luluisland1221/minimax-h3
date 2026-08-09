// OpenNext's production transform can retain this esbuild helper call in
// next-themes' inline bootstrap without emitting the helper itself.
globalThis.__name ||= (target) => target;
