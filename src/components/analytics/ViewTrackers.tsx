"use client";

import { useEffect, useRef } from "react";

function ping(body: object) {
  void fetch("/api/analytics/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export function HomeViewTracker() {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    ping({ target: "home" });
  }, []);
  return null;
}

export function BlogListViewTracker() {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    ping({ target: "blog" });
  }, []);
  return null;
}

export function PostViewTracker({ slug }: { slug: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (!slug || sent.current) return;
    sent.current = true;
    ping({ target: "post", slug });
  }, [slug]);
  return null;
}
