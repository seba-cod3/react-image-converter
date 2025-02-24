import "./App.css";
import InputFile from "./components/InputFile";
import Output from "./components/Output";

function App() {
  return (
    <main className="flex flex-col items-start justify-center p-4">
      <header className="flex flex-col items-center gap-9">
        <h1 className="text-4xl p-4">Image converter</h1>
      </header>
      <Divider />
      <InputSection />
      <Divider />
      <Gallery />
    </main>
  );
}

export default App;

function Divider() {
  return <div className="w-full h-1 bg-gray-200 dark:bg-gray-600 my-8" />;
}

function LYCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-600 w-[90%] space-y-6 px-4">
      {children}
    </div>
  );
}

function InputSection() {
  return (
    <LYCard>
      <InputFile />
    </LYCard>
  );
}

function Gallery() {
  return (
    <LYCard>
      <div className="flex flex-col gap-8 align-center">
        <h2 className="text-2xl">Gallery</h2>
      </div>
      <Output />
    </LYCard>
  );
}
