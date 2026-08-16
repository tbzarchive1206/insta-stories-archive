# INSTA STORIES ARCHIVE

Samodzielne, statyczne archiwum Instagram Stories THE BOYZ, gotowe do publikacji jako GitHub Pages. Dane są synchronizowane z publicznym folderem Google Drive i dzielone według profilu, roku oraz miesiąca odczytanego z początku nazwy pliku w formacie `YYMMDD`.

## Funkcje

- profile: Sangyeon, Jacob, Younghoon, Hyunjae, Juyeon, Kevin, Q, Sunwoo i Eric,
- dodatkowa kolekcja `TBZ on Other People’s Profiles (다른 사람 프로필 속 TBZ)`,
- folder `CHANHEE (NEW)` jest pomijany,
- filtrowanie według roku i miesiąca,
- domyślny widok bieżącego miesiąca,
- sortowanie od najnowszej daty, z zachowaniem kolejności plików z tego samego dnia,
- wyszukiwanie według `YYMMDD` lub fragmentu nazwy pliku,
- nazwy plików wyświetlane w kolekcji dodatkowej,
- automatyczna synchronizacja Google Drive dwa razy dziennie.

## Uruchomienie lokalne

Wymagany jest Node.js 22 oraz pnpm.

```bash
pnpm install
pnpm dev
```

Test i kompilacja:

```bash
pnpm test
```

## Publikacja GitHub Pages

1. Utwórz puste repozytorium GitHub `INSTA-STORIES-ARCHIVE`.
2. W folderze projektu wykonaj:

   ```bash
   git remote add origin https://github.com/TWOJ_LOGIN/INSTA-STORIES-ARCHIVE.git
   git push -u origin main
   ```

3. W GitHub otwórz `Settings → Pages`.
4. Ustaw `Build and deployment → Source → GitHub Actions`.

Strona będzie dostępna pod adresem:

```text
https://TWOJ_LOGIN.github.io/INSTA-STORIES-ARCHIVE/
```

## Automatyczna synchronizacja

1. Udostępnij główny folder Drive jako `Każda osoba mająca link → Wyświetlający`.
2. W Google Cloud włącz `Google Drive API` i utwórz klucz API.
3. W GitHub otwórz `Settings → Secrets and variables → Actions`.
4. Dodaj sekret `GOOGLE_DRIVE_API_KEY`.
5. W zakładce `Actions` uruchom workflow `Sync Instagram Stories`.

Workflow działa codziennie o `05:17` i `17:17` UTC. Zmiana indeksu automatycznie uruchamia ponowną publikację GitHub Pages.

## Źródło

[Folder INSTA STORIES ARCHIVE na Google Drive](https://drive.google.com/drive/folders/1jxa6AG4HFQjW9EdgYjb3jutsJvE2nDlT)
