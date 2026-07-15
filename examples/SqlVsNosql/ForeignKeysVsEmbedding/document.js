// A document model has no separate "users" table to check against — the
// author's name is just a plain string field, embedded directly. Nothing
// about the document model itself stops that string from being wrong,
// inconsistent with any other post, or referring to someone who doesn't
// "exist" anywhere else in the data. There's no built-in relationship to
// enforce, because there's no separate table to relate it to.
export function buildDocumentPost() {
  return {
    id: 1,
    title: "Orphan post",
    // Nothing validates this against a real list of known authors —
    // it's just a string, and any string is equally "valid" to the
    // document model itself.
    authorName: "Someone Who Doesn't Exist Anywhere Else",
  };
}
