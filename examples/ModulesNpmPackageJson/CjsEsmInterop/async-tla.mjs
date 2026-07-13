await new Promise((resolve) => setTimeout(resolve, 1));

export const value = "loaded after a real top-level await";
