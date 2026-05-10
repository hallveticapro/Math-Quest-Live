const modules = import.meta.glob("../assets/music/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

export type MusicTrack = {
  id: string;
  title: string;
  url: string;
};

function titleFromPath(path: string) {
  const fileName = path.split("/").pop() ?? "Background Music";
  return decodeURIComponent(fileName)
    .replace(/\.mp3$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const MUSIC_LIBRARY: MusicTrack[] = Object.entries(modules)
  .map(([path, url]) => ({
    id: path,
    title: titleFromPath(path),
    url: String(url),
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

