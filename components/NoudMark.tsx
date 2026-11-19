type Props = {
  size?: number;
  /** Colores; por defecto siguen el tema (variables --mark-arc / --mark-top). */
  arc?: string;
  feet?: string;
  top?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** El arco de noud con sus tres nodos. Decorativo (aria-hidden). */
export function NoudMark({
  size = 36,
  arc = "var(--mark-arc)",
  feet = "#80BFA2",
  top = "var(--mark-top)",
  strokeWidth = 7,
  className,
  style,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="2 2 60 60"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M14 50V32A18 18 0 0 1 50 32V50"
        fill="none"
        stroke={arc}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="14" cy="50" r="9.5" fill={feet} />
      <circle cx="50" cy="50" r="9.5" fill={feet} />
      <circle cx="32" cy="14" r="10" fill={top} />
    </svg>
  );
}
