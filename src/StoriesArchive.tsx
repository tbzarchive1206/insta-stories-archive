import { useMemo, useState } from "react";

type Media = {
  id: string;
  kind: "image" | "audio" | "video" | "other";
  mimeType: string;
  date: number;
  year: number;
  month: number;
  name: string;
};

type Collection = { id: string; name: string; media: Media[] };

export type Archive = {
  generatedAt: string;
  sourceFolderId: string;
  members: Collection[];
  other: Collection;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pageSize = 28;
const thumbnail = (id: string, size = "w1200") => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${size}`;
const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${encodeURIComponent(id)}`;
const fileUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
const previewUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
const directUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

function MediaActions({ media, showName }: { media: Media; showName: boolean }) {
  return (
    <div className="image-actions">
      {showName && <span className="file-name" title={media.name}>{media.name}</span>}
      <span className="file-action-links">
        <a href={fileUrl(media.id)} target="_blank" rel="noreferrer">VIEW ↗</a>
        <a href={directUrl(media.id)} target="_blank" rel="noreferrer">DOWNLOAD ↓</a>
      </span>
    </div>
  );
}

function MediaTile({ media, showName = false }: { media: Media; showName?: boolean }) {
  if (media.kind === "video") {
    return (
      <figure className="media-tile video-tile">
        <iframe src={previewUrl(media.id)} title="Instagram video" allow="autoplay; fullscreen" loading="lazy" />
        <MediaActions media={media} showName={showName} />
      </figure>
    );
  }

  if (media.kind === "audio") {
    return (
      <figure className="media-tile audio-tile">
        <div className="audio-mark" aria-hidden="true">AUDIO / INSTAGRAM</div>
        <iframe src={previewUrl(media.id)} title="Instagram audio" allow="autoplay" loading="lazy" />
        <MediaActions media={media} showName={showName} />
      </figure>
    );
  }

  if (media.kind !== "image") {
    return <figure className="media-tile unsupported-media"><a className="unsupported-tile" href={fileUrl(media.id)} target="_blank" rel="noreferrer">OPEN FILE IN DRIVE ↗</a><MediaActions media={media} showName={showName} /></figure>;
  }

  return (
    <figure className="media-tile">
      <a href={fileUrl(media.id)} target="_blank" rel="noreferrer" aria-label="Open original image in Google Drive">
        <img src={thumbnail(media.id)} alt="" loading="lazy" />
      </a>
      <MediaActions media={media} showName={showName} />
    </figure>
  );
}

const newestFirst = (a: Media, b: Media) => b.date - a.date || a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });

export function StoriesArchive({ data }: { data: Archive }) {
  const now = new Date();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [shown, setShown] = useState(pageSize);
  const [query, setQuery] = useState("");

  const totalMedia = data.members.reduce((sum, item) => sum + item.media.length, 0) + data.other.media.length;
  const years = useMemo(
    () => collection ? [...new Set(collection.media.map((item) => item.year))].sort((a, b) => b - a) : [],
    [collection],
  );
  const months = useMemo(
    () => collection ? [...new Set(collection.media.filter((item) => item.year === year).map((item) => item.month))].sort((a, b) => b - a) : [],
    [collection, year],
  );
  const media = useMemo(
    () => {
      if (!collection) return [];
      const search = query.trim().toLocaleLowerCase();
      return collection.media
        .filter((item) => item.year === year && item.month === month)
        .filter((item) => !search || item.name.toLocaleLowerCase().includes(search) || String(item.date).slice(2).includes(search))
        .sort(newestFirst);
    },
    [collection, month, query, year],
  );

  const chooseCollection = (next: Collection) => {
    const availableYears = [...new Set(next.media.map((item) => item.year))].sort((a, b) => b - a);
    const selectedYear = availableYears.includes(now.getFullYear()) ? now.getFullYear() : availableYears[0] || now.getFullYear();
    const availableMonths = [...new Set(next.media.filter((item) => item.year === selectedYear).map((item) => item.month))].sort((a, b) => b - a);
    const selectedMonth = selectedYear === now.getFullYear() && availableMonths.includes(now.getMonth() + 1) ? now.getMonth() + 1 : availableMonths[0] || now.getMonth() + 1;
    setCollection(next);
    setYear(selectedYear);
    setMonth(selectedMonth);
    setShown(pageSize);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main id="top">
      <header className="masthead">
        <div className="utility">
          <a className="brand" href="https://tbzarchive.com/">THE BOYZ / FAN ARCHIVE</a>
          <nav><span>INSTAGRAM STORIES</span><span>/</span><a href="https://x.com/tbzarchive1206_" target="_blank" rel="noreferrer">TWITTER ↗</a></nav>
        </div>
        <h1><span className="solid">INSTA STORIES</span><span className="outline">ARCHIVE</span></h1>
        <div className="stats">
          <p><strong>{data.members.length + 1}</strong> COLLECTIONS</p><i />
          <p><strong>{totalMedia.toLocaleString("en-US")}</strong> MEDIA FILES</p><i />
          <p>UPDATED <strong>{new Date(data.generatedAt).toLocaleDateString("en-GB")}</strong></p>
        </div>
      </header>

      {!collection ? (
        <section className="member-picker insta-picker">
          <div className="picker-head">
            <p>SELECT A PROFILE · {data.members.length} MEMBERS</p>
            <a href={folderUrl(data.sourceFolderId)} target="_blank" rel="noreferrer">OPEN SOURCE FOLDER ↗</a>
          </div>
          <div className="member-grid">
            {data.members.map((item, index) => (
              <button key={item.id} onClick={() => chooseCollection(item)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name.toUpperCase()}</strong>
                <small>{item.media.length.toLocaleString("en-US")} MEDIA FILES →</small>
              </button>
            ))}
          </div>
          <button className="other-profile-tile" onClick={() => chooseCollection(data.other)}>
            <span>{String(data.members.length + 1).padStart(2, "0")} / SPECIAL COLLECTION</span>
            <strong>TBZ ON OTHER PEOPLE’S PROFILES</strong>
            <em>다른 사람 프로필 속 TBZ</em>
            <small>{data.other.media.length.toLocaleString("en-US")} MEDIA FILES →</small>
          </button>
        </section>
      ) : (
        <section className="member-gallery insta-gallery">
          <header className="member-gallery-head">
            <button onClick={() => { setCollection(null); setQuery(""); }}>← ALL PROFILES</button>
            <div><span>INSTAGRAM STORIES / PROFILE</span><h2>{collection.name.toUpperCase()}</h2></div>
            <a href={folderUrl(collection.id)} target="_blank" rel="noreferrer">OPEN FOLDER ↗</a>
          </header>
          <label className="search gallery-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setShown(pageSize); }} type="search" placeholder="SEARCH BY YYMMDD OR TITLE..." /></label>
          <div className="member-filters">
            <label>YEAR
              <select value={year} onChange={(event) => { setYear(Number(event.target.value)); setShown(pageSize); }}>
                {years.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>MONTH
              <select value={month} onChange={(event) => { setMonth(Number(event.target.value)); setShown(pageSize); }}>
                {monthNames.map((name, index) => <option key={name} value={index + 1}>{String(index + 1).padStart(2, "0")} · {name.toUpperCase()}</option>)}
              </select>
            </label>
            <p>{media.length} RESULTS</p>
          </div>
          <div className="member-period">
            <p>{monthNames[month - 1]} {year}</p>
            <span>NEWEST FIRST</span>
          </div>
          {media.length ? (
            <div className="media-grid">{media.slice(0, shown).map((item) => <MediaTile key={item.id} media={item} showName={collection.id === data.other.id} />)}</div>
          ) : (
            <div className="empty member-empty"><strong>{query ? "NO MATCHES" : "NO MEDIA"}</strong>{query ? "TRY A DIFFERENT DATE OR TITLE." : "THERE ARE NO UPLOADS FOR THIS MONTH."}</div>
          )}
          {shown < media.length && <button className="load-more" onClick={() => setShown((value) => value + pageSize)}>LOAD MORE MEDIA ↓</button>}
        </section>
      )}

      <footer><span>© THE BOYZ FAN ARCHIVE</span><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
