export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  icon,
  iconRight,
  full     = false,
  disabled = false,
  onClick,
  type     = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      className={[
        'btn',
        `btn-${variant}`,
        size !== 'md' ? `btn-${size}` : '',
        full ? 'btn-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && icon}
      {children}
      {iconRight && iconRight}
    </button>
  )
}
