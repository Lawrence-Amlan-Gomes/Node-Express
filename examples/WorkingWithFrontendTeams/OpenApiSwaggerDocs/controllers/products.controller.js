// The real logic for the Products resource — matches openapi.yaml's own
// Product/NewProduct schemas exactly, one folder over.

// A plain in-memory array stands in for a real database — this section is
// about the SPEC and the docs it produces, not about persistence.
const products = [
  { id: 1, name: "Mechanical Keyboard", price: 89.99 },
  { id: 2, name: "Ultrawide Monitor", price: 429.0 },
];
// The next real id a created product will get.
let nextId = 3;

// Handles GET /products.
export function listProducts(req, res) {
  // Send back the real, current in-memory list.
  res.status(200).json(products);
}

// Handles GET /products/:id.
export function getProduct(req, res) {
  // req.params.id always arrives as a string — Number() converts it for
  // a real comparison against the stored, numeric id.
  const id = Number(req.params.id);
  // .find() returns the real matching product, or undefined if none exists.
  const product = products.find((p) => p.id === id);

  // A missing resource is a real 404, matching the spec's documented response.
  if (!product) {
    res.status(404).json({ error: `No product with id ${id}` });
    return;
  }

  // Found it — send the real product back.
  res.status(200).json(product);
}

// Handles POST /products.
export function createProduct(req, res) {
  // Real, basic checks matching the spec's NewProduct schema — full
  // spec-driven request validation is this topic's own later section.
  const { name, price } = req.body ?? {};
  if (typeof name !== "string" || name.length === 0 || typeof price !== "number") {
    res.status(400).json({ error: "name (string) and price (number) are required" });
    return;
  }

  // Build the real product, using the real next id.
  const product = { id: nextId, name, price };
  // Bump the counter so the NEXT product gets a genuinely unique id.
  nextId += 1;
  // Actually add it to the real in-memory store.
  products.push(product);
  // 201 — this request created a new real resource, matching the spec.
  res.status(201).json(product);
}
