// Real input validation with zod — a schema library that checks a
// request body's ACTUAL shape at runtime (types, required fields,
// formats) before any application code touches it. TypeScript's types
// only exist at compile time and vanish once the code actually runs —
// they can't stop a real network request from sending garbage. zod is
// what closes that gap for real, live requests.
import express from "express";
import { z } from "zod";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

// The real schema: every field's actual required shape, in one place.
const createUserSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.email("must be a valid email address"),
  age: z.number().int().positive("age must be a positive whole number"),
});

app.post("/users", (req, res) => {
  // safeParse never throws — it returns a real result object you check,
  // instead of needing a try/catch around every validation.
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    // z.flattenError turns zod's detailed internal issue list into a
    // simple { field: [messages] } shape — genuinely useful for a
    // frontend to show next to the right form field, not just a vague
    // "invalid input" string.
    return res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
  }

  // result.data is the validated, real data — safe to use as-is.
  res.status(201).json({ id: 1, ...result.data });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4043;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
