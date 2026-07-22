// A "controller" holds the ACTUAL logic for each request — the routes file
// (one folder over) only decides WHICH path+method reaches which function
// here. This is the exact same routes/controllers split every topic since
// "Project Structure & Config" has used — reused here on purpose, not
// reinvented, because that's the whole point of a live-coding round: you
// should already know this shape cold.

// Real input validation with zod — the same library and pattern already
// mastered in "REST Conventions & Validation." Under interview time
// pressure you don't invent a new validation approach, you reach for the
// one you already know works.
import { z } from "zod";

// The real schema for creating a bookmark: a real URL, and a non-empty title.
const createBookmarkSchema = z.object({
  url: z.url("url must be a real, valid URL"),
  title: z.string().min(1, "title is required"),
});

// A plain in-memory array stands in for a database here — a live-coding
// round almost never gives you real database time, so an in-memory store
// with the SAME shape a real DB row would have is the standard move.
let bookmarks = [];
// A simple auto-incrementing counter — a real DB would do this with a
// SERIAL/AUTOINCREMENT column, this just imitates the same behavior.
let nextId = 1;

// Handles POST /bookmarks.
export function createBookmark(req, res) {
  // safeParse never throws — check the real result object it returns.
  const result = createBookmarkSchema.safeParse(req.body);

  // Bad input never reaches the code below this check.
  if (!result.success) {
    // The real, per-field error list, same shape zod produced elsewhere.
    res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
    return;
  }

  // Build the real bookmark object using the validated, safe data.
  const bookmark = { id: nextId, ...result.data, createdAt: new Date().toISOString() };
  // Bump the counter so the NEXT bookmark gets a genuinely unique id.
  nextId += 1;
  // Actually add it to the real in-memory store.
  bookmarks.push(bookmark);
  // 201, not 200 — this request created a new real resource.
  res.status(201).json(bookmark);
}

// Handles GET /bookmarks?limit=&cursor= — cursor pagination, the pattern
// already measured (~300x faster than offset at scale) in "REST
// Conventions & Validation." The cursor here is just the last real id
// already seen — "give me everything with an id greater than this one."
export function listBookmarks(req, res) {
  // Read the real limit from the query string, defaulting to 2 so this
  // demo can actually show a second page without needing hundreds of rows.
  const limit = Number(req.query.limit) || 2;
  // A cursor of 0 (the default) means "start from the very beginning."
  const cursor = Number(req.query.cursor) || 0;

  // Only keep real bookmarks whose id is past the cursor — this is the
  // one WHERE-style filter that makes cursor pagination fast: it never
  // has to scan and discard rows the way OFFSET does.
  const page = bookmarks.filter((bookmark) => bookmark.id > cursor).slice(0, limit);
  // If a full page came back, there might be more — the next real cursor
  // is simply the last item's own id. null means "no more pages."
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;

  // Send back the real page, plus the real cursor a client would use next.
  res.status(200).json({ items: page, nextCursor });
}

// Handles GET /bookmarks/:id.
export function getBookmark(req, res) {
  // req.params.id always arrives as a string — Number() converts it for
  // a real comparison against the stored, numeric id.
  const id = Number(req.params.id);
  // .find() returns the real matching bookmark, or undefined if none exists.
  const bookmark = bookmarks.find((b) => b.id === id);

  // A missing resource is a real 404, not a 200 with an empty body.
  if (!bookmark) {
    res.status(404).json({ error: `No bookmark with id ${id}` });
    return;
  }

  // Found it — send the real bookmark back.
  res.status(200).json(bookmark);
}

// Handles DELETE /bookmarks/:id.
export function deleteBookmark(req, res) {
  const id = Number(req.params.id);
  // The real length before removal, so a missing id can be detected below.
  const lengthBefore = bookmarks.length;
  // Keep every bookmark EXCEPT the one being deleted — this rebuilds the
  // real array without that one entry.
  bookmarks = bookmarks.filter((b) => b.id !== id);

  // If the length didn't change, that id never existed — a real 404.
  if (bookmarks.length === lengthBefore) {
    res.status(404).json({ error: `No bookmark with id ${id}` });
    return;
  }

  // 204 — deleted successfully, and there's genuinely no body to send back.
  res.status(204).send();
}
