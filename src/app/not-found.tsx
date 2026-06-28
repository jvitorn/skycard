import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className="flex min-h-dvh flex-col items-center justify-center bg-[#050b18] px-4 text-center"
        style={{
          background:
            "radial-gradient(circle at 16% 12%, rgba(86, 214, 255, 0.14), transparent 24rem), radial-gradient(circle at 84% 10%, rgba(233, 196, 106, 0.12), transparent 22rem), #050b18",
          color: "#f7faff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(86, 214, 255, 0.14)",
            background: "linear-gradient(180deg, rgba(11, 20, 40, 0.92), rgba(9, 16, 34, 0.88))",
            boxShadow: "0 20px 60px rgba(0, 3, 12, 0.5)",
            borderRadius: 18,
            padding: "2.5rem 2rem",
            maxWidth: 480,
            width: "100%",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              border: "1px solid rgba(86, 214, 255, 0.35)",
              background: "rgba(86, 214, 255, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: 26,
            }}
          >
            🔭
          </div>
          <h1
            style={{
              marginTop: "1.5rem",
              fontSize: "2rem",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#56d6ff",
            }}
          >
            404
          </h1>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#f7faff",
            }}
          >
            Page not found
          </p>
          <p
            style={{
              marginTop: "0.75rem",
              color: "#9aa9c1",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            This page doesn't exist. Head back home to look up a Bluesky profile.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: "2rem",
              padding: "0.6rem 1.5rem",
              borderRadius: 10,
              background: "#168aff",
              color: "#06101f",
              fontWeight: 800,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Back home
          </Link>
        </div>
      </body>
    </html>
  );
}
