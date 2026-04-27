type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <p className="rounded-full border border-lime-200/15 bg-lime-200/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.28em] text-lime-200/70">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-white/58 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
