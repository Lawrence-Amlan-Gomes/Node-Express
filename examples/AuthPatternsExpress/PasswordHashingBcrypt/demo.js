// Real password hashing with bcrypt. NEVER store a real password as
// plaintext — if the database ever leaks, every user's real password
// leaks with it. bcrypt turns a password into a one-way hash: easy to
// verify a guess against, practically impossible to reverse.
import bcrypt from "bcrypt";

const password = "correct-horse-battery-staple";

// SALT ROUNDS: how many times bcrypt runs its internal hashing work.
// Higher = slower to compute = harder to brute-force guess at scale.
// 10 is a real, common production default (bcrypt's own recommended
// starting point) — deliberately slow enough to make guessing millions
// of passwords per second impractical, fast enough for one real login.
const SALT_ROUNDS = 10;

// hash() generates a real, random SALT internally, then mixes it into
// the hash — that's why the SAME password produces a DIFFERENT hash
// every single time. This is what stops two users with the same
// password from having identical, and thus guessable-by-comparison,
// rows in a real database.
const hash1 = await bcrypt.hash(password, SALT_ROUNDS);
const hash2 = await bcrypt.hash(password, SALT_ROUNDS);
console.log(`Same password "${password}", hashed twice:`);
console.log(`hash 1: ${hash1}`);
console.log(`hash 2: ${hash2}`);
console.log(`Identical hashes? ${hash1 === hash2} (this is expected and correct — a real random salt is baked into each hash)`);

// compare() re-derives the hash using the SAME salt already embedded in
// the stored hash, then checks if it matches — this is the real
// verification step a login route runs, never a plain === comparison.
const correctMatch = await bcrypt.compare(password, hash1);
const wrongMatch = await bcrypt.compare("totally-wrong-guess", hash1);
console.log(`\nDoes the REAL password match hash1? ${correctMatch}`);
console.log(`Does a WRONG guess match hash1? ${wrongMatch}`);

console.log("\nWhat actually gets stored in a real database: only the hash (e.g. the string above) — the real plaintext password is never written anywhere, not even temporarily.");
