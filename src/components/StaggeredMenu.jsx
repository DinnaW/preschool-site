import React, { useState, useEffect } from "react";
import "./StaggeredMenu.css";

const StaggeredMenu = ({
  position = "right",
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  colors = ["#B19EEF", "#5227FF"],
  logoUrl,
  accentColor = "#ff6b6b",
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--sm-accent", accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (open) {
      onMenuOpen && onMenuOpen();
      document.body.style.overflow = "hidden";
    } else {
      onMenuClose && onMenuClose();
      document.body.style.overflow = "";
    }
  }, [open, onMenuOpen, onMenuClose]);

  const handleToggle = () => setOpen((prev) => !prev);

  const currentButtonColor =
    open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  return (
    <div
      className={`staggered-menu-wrapper fixed-wrapper`}
      data-open={open ? "true" : undefined}
      data-position={position}
      style={{
        "--sm-accent": accentColor,
      }}
    >
      <header className="staggered-menu-header">
        <div className="sm-logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="sm-logo-img" />
          )}
        </div>

        <button
          className="sm-toggle"
          type="button"
          onClick={handleToggle}
          aria-expanded={open}
          style={{ color: currentButtonColor }}
        >
          <div className="sm-toggle-textWrap">
            <div className="sm-toggle-textInner">
              <span className="sm-toggle-line">
                {open ? "Close menu" : "Menu"}
              </span>
              <span className="sm-toggle-line">
                {open ? "Close menu" : "Menu"}
              </span>
            </div>
          </div>
          <span className="sm-icon" aria-hidden="true">
            <span className="sm-icon-line" />
            <span className="sm-icon-line" />
          </span>
        </button>
      </header>

      {/* Colored layers behind panel */}
      <div className="sm-prelayers">
        {colors.map((c, i) => (
          <div
            key={i}
            className="sm-prelayer"
            style={{
              background: c,
              opacity: open ? 1 - i * 0.25 : 0,
              transition: "transform 0.45s ease, opacity 0.45s ease",
              transform:
                open && position === "right"
                  ? `translateX(${(-i - 1) * 4}%)`
                  : open && position === "left"
                  ? `translateX(${(i + 1) * 4}%)`
                  : position === "right"
                  ? "translateX(100%)"
                  : "translateX(-100%)",
            }}
          />
        ))}
      </div>

      {/* Main sliding panel */}
      <aside
        className="staggered-menu-panel"
        style={{
          transform:
            open && position === "right"
              ? "translateX(0)"
              : open && position === "left"
              ? "translateX(0)"
              : position === "right"
              ? "translateX(100%)"
              : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="sm-panel-inner">
          <div>
            <h2 className="sm-panel-title">Navigation</h2>
            <ul
              className="sm-panel-list"
              data-numbering={displayItemNumbering ? "true" : undefined}
            >
              {items.map((item, idx) => (
                <li key={item.label} className="sm-panel-itemWrap">
                  <a
                    href={item.link}
                    aria-label={item.ariaLabel}
                    className="sm-panel-item"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sm-panel-itemLabel">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {displaySocials && socialItems?.length > 0 && (
            <div className="sm-socials">
              <h3 className="sm-socials-title">Follow us</h3>
              <ul className="sm-socials-list">
                {socialItems.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.link}
                      className="sm-socials-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
