export function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`.trim()}>
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">{children}</div>
      <div className="phone-shine" aria-hidden="true" />
    </div>
  );
}
