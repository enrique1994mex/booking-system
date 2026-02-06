"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div>
      <h2>Payment error</h2>
      <p>{error.message}</p>
    </div>
  );
}
