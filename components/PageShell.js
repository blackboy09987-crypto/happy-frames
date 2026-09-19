export default function PageShell({ title, subtitle, children }) {
  return (
    <>
      <header className="header">
        <div className="wrap nav">
          <a className="logo" href="/"><img className="logo-img" src="/logo.jpg" alt="Happy Frames" /></a>
          <a className="btn btn--ghost btn--sm" href="/">← Back to shop</a>
        </div>
      </header>

      <main className="legal wrap">
        <h1>{title}</h1>
        {subtitle ? <p className="legal-sub">{subtitle}</p> : null}
        {children}
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="foot__bar">
            <span>© 2026 Happy Frames. All rights reserved.</span>
            <span className="foot__links">
              <a href="/about">About</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/refund">Refund</a> · <a href="/contact">Contact</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
