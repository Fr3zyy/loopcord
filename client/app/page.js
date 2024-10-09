import { BorderBeam } from "@/components/ui/border-beam";

export default function HomeComponent() {
  return (
    <div className="p-24">
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          LoopCord #SOON
        </span>
        <BorderBeam
          colorFrom="#ed0518"
          colorTo="#0de0d9"
          size={250}
          duration={12}
        />
      </div>
    </div>
  );
}
