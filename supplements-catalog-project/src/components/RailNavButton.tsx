interface Props {
  direction: -1 | 1
  onClick: () => void
  disabled: boolean
  ariaLabel: string
  ink: string
  bg: string
}

/** Botón circular ← / → para riles con scroll horizontal (Categorías, Combina bien con). */
export function RailNavButton({ direction, onClick, disabled, ariaLabel, ink, bg }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex items-center justify-center rounded-full transition-colors duration-200 disabled:cursor-default disabled:opacity-30"
      style={{ width: 34, height: 34, border: `1px solid ${ink}2e`, background: 'transparent', color: ink }}
      onMouseEnter={(e) => {
        if (e.currentTarget.disabled) return
        e.currentTarget.style.background = ink
        e.currentTarget.style.color = bg
        e.currentTarget.style.borderColor = ink
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = ink
        e.currentTarget.style.borderColor = `${ink}2e`
      }}
    >
      {direction === -1 ? '←' : '→'}
    </button>
  )
}
