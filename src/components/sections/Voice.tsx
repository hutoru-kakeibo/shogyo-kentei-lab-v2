import { voice } from "@/lib/content";
import { getVoiceItems } from "@/lib/voice";
import { VoiceCarousel } from "@/components/sections/VoiceCarousel";

export async function Voice() {
  const items = await getVoiceItems();

  return (
    <section id="voice" className="bg-white px-5 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{voice.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {voice.englishTitle}
        </p>
        <p className="mt-4 text-[13px] font-bold leading-relaxed text-ink-muted">{voice.lead}</p>
      </div>

      {items.length > 0 ? (
        <VoiceCarousel items={items} />
      ) : (
        <p className="mt-8 rounded-2xl bg-canvas p-6 text-center text-[13px] font-bold text-ink-muted">
          {voice.emptyMessage}
        </p>
      )}
    </section>
  );
}
