import { FFmpeg } from '@ffmpeg/ffmpeg';
import { create } from 'zustand';
import { get, set } from 'idb-keyval';

// Check if we can use multi-threading
const canUseMT = 'SharedArrayBuffer' in window;
const ffmpegVersion = '0.12.15';
const ffmpegName = canUseMT ? 'core-mt' : 'core';
const ffmpegWorker = canUseMT ? 'ffmpeg-core.worker.js' : undefined;

// Use local files from the public directory with Vite's base URL
const ffmpegBaseURL = `${import.meta.env.BASE_URL}ffmpeg`;

// Helper function to retrieve and cache blobs
async function retrieveBlob(
  url: string,
  type: string,
  onProgress?: (progress: number) => void,
) {
  let buffer = await get(url);
  if (!buffer) {
    const response = await fetch(url);
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error(`Unable to fetch: ${url}`);
    }

    const contentLength = +response.headers.get('Content-Length')!;
    let receivedLength = 0;
    const chunks = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;
      onProgress?.(receivedLength / contentLength);
    }

    buffer = await new Blob(chunks).arrayBuffer();

    try {
      set(url, buffer);
      console.log(`Saved to IndexedDB: ${url}`);
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error);
    }
  } else {
    console.log(`Loaded from IndexedDB: ${url}`);
  }

  const blob = new Blob([buffer], { type });
  return URL.createObjectURL(blob);
}

interface FFmpegState {
  loaded: boolean;
  loadProgress: number;
  running: boolean;
  execProgress: number;
  output: string;
  log: string;
  ffmpeg: FFmpeg;
  load: () => Promise<void>;
  exec: (inputData: Uint8Array, args: string[]) => Promise<Uint8Array | null>;
  cancel: () => void;
}

const useFFmpegStore = create<FFmpegState>((set, get) => {
  const ffmpeg = new FFmpeg();

  // Add event listeners
  ffmpeg.on('log', (e) => {
    console.log(e);
    set((state) => ({
      ...state,
      output: e.message,
      log: state.log + `${e.message}\n`,
    }));
  });

  ffmpeg.on('progress', (e) => {
    set((state) => ({
      ...state,
      execProgress: e.progress,
    }));
  });

  return {
    loaded: false,
    loadProgress: 0,
    running: false,
    execProgress: 0,
    output: '',
    log: '',
    ffmpeg,

    load: async () => {
      const state = get();
      if (state.loaded) return;

      try {
        // Load FFmpeg with cached files
        await ffmpeg.load({
          coreURL: await retrieveBlob(
            `${ffmpegBaseURL}/ffmpeg-core.js`,
            'text/javascript',
          ),
          wasmURL: await retrieveBlob(
            `${ffmpegBaseURL}/ffmpeg-core.wasm`,
            'application/wasm',
            (progress) => {
              set((state) => ({
                ...state,
                loadProgress: progress,
              }));
            },
          ),
          workerURL: ffmpegWorker
            ? await retrieveBlob(
                `${ffmpegBaseURL}/${ffmpegWorker}`,
                'text/javascript',
              )
            : undefined,
        });

        set((state) => ({
          ...state,
          loadProgress: 1,
          loaded: true,
        }));
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      }
    },

    exec: async (inputData: Uint8Array, args: string[]) => {
      set((state) => ({
        ...state,
        running: true,
        execProgress: 0,
        output: '',
      }));

      try {
        const ffmpeg = get().ffmpeg;
        await ffmpeg.writeFile('input', inputData);
        await ffmpeg.exec(['-i', 'input', ...args, 'output.mp4']);

        const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array;
        return data;
      } catch (error) {
        console.error('FFmpeg execution failed:', error);
        return null;
      } finally {
        try {
          const ffmpeg = get().ffmpeg;
          await ffmpeg.deleteFile('input');
          await ffmpeg.deleteFile('output.mp4');
        } catch {
          // Ignore deletion errors
        }

        set((state) => ({
          ...state,
          running: false,
        }));
      }
    },

    cancel: () => {
      const state = get();
      state.ffmpeg.terminate();
      state.load(); // Reload FFmpeg after termination
    },
  };
});

export default useFFmpegStore; 