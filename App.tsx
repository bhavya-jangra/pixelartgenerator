
import React, { useState, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { ImageDisplay } from './components/ImageDisplay';
import { LoadingIcon } from './components/LoadingIcon';
import { generatePixelArt } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await generatePixelArt(prompt);
      setGeneratedImage(imageData);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`Failed to generate image: ${err.message}. Ensure your API key is configured correctly.`);
      } else {
        setError('An unknown error occurred while generating the image.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-100 selection:bg-teal-500 selection:text-slate-900">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-teal-400 tracking-wider">
          Pixel Art Generator
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Craft unique pixel masterpieces with AI
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-800 p-6 md:p-8 shadow-2xl border border-teal-500/30 rounded-none">
        <div className="space-y-6">
          <PromptInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <GenerateButton onClick={handleSubmit} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-700 border border-red-500 text-white text-sm rounded-none">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[384px] w-full bg-slate-700 border-2 border-dashed border-slate-500 rounded-none">
              <LoadingIcon />
              <p className="mt-2 text-slate-400">Generating your pixel art...</p>
            </div>
          ) : (
            <ImageDisplay imageData={generatedImage} />
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Pixel Art Generator. Powered by Google Gemini.</p>
        <p>Ensure API_KEY environment variable is set.</p>
      </footer>
    </div>
  );
};

export default App;
