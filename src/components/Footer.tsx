export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <p className="footer__copy">© {year} AI Evolution. Built with React.</p>
          <p className="footer__sub">
            This site's color palette and aesthetic are autonomously updated daily
            by <span className="footer__highlight">GitHub Copilot</span> based on current design trends.
          </p>
        </div>

        <div className="footer__links">
          <a
            href="https://github.com/features/copilot"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub Copilot
          </a>
          <a
            href="https://github.com/marketplace/models"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub Models
          </a>
          <a
            href="https://pages.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Cloudflare Pages
          </a>
        </div>
      </div>

      <div className="footer__bar" />
    </footer>
  )
}
