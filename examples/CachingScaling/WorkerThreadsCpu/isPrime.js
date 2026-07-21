// A real, deliberately naive (trial division) primality check — genuinely
// CPU-bound, no I/O anywhere, exactly the kind of work worker_threads is
// actually for (unlike cluster, which is for I/O-bound HTTP load).
export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

export function countPrimesInRange(start, end) {
  let count = 0;
  for (let n = start; n < end; n++) {
    if (isPrime(n)) count++;
  }
  return count;
}
