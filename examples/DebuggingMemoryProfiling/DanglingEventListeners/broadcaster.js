// A real, shared EventEmitter — standing in for anything a real app might
// broadcast on: a chat message, a live price update, a job-finished event.
// Both the buggy and fixed routes below share this ONE real emitter, so
// the difference between them is genuinely only about WHEN listeners get
// added, not about using different objects.
import { EventEmitter } from "node:events";

const broadcaster = new EventEmitter();

export default broadcaster;
