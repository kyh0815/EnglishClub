type FooterProps = {
  applyHref?: string;
  inquiryHref?: string;
};

export default function Footer({ applyHref = "/apply", inquiryHref = "/inquiry" }: FooterProps) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">The Round</div>
            <div className="foot-tag">떠들다 보면, 영어가 트입니다.</div>
          </div>
          <div className="foot-links">
            <a href={applyHref}>무료 신청</a>
            <span aria-hidden="true">|</span>
            <a href={inquiryHref}>문의</a>
          </div>
        </div>
        <div className="foot-copy">© 2026 The Round — English Social Club.</div>
      </div>
    </footer>
  );
}
