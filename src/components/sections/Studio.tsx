import Image from "next/image";

export default function Studio() {
  return (
    <section style={{ width: "100%", position: "relative", zIndex: 2 }}>
      <Image
        src="/Studio BG.png"
        alt="Studio"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto", display: "block" }}
        priority
      />
    </section>
  );
}
