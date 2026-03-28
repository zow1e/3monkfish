export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-outline-variant/15 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center gap-3">
        <nav className="flex items-center gap-6 flex-wrap justify-center">
          {['Privacy', 'Terms', 'Support', 'Editorial Guidelines'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-secondary text-xs font-medium uppercase tracking-widest hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              {link}
            </a>
          ))}
        </nav>
        <p className="text-secondary/50 text-xs">
          © 2024 3rabbits · Designed for pure companionship
        </p>
      </div>
    </footer>
  );
}
