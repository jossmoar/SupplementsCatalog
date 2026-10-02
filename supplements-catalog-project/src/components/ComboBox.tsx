import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

interface Props {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

/** Input de texto libre que, al tocarlo, abre de una vez la lista completa de opciones (y se filtra al escribir). */
export function ComboBox({ options, value, onChange, placeholder, className, onKeyDown }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const filtered = value.trim()
    ? options.filter((o) => o.toLowerCase().includes(value.trim().toLowerCase()))
    : options

  return (
    <div className="relative" ref={containerRef}>
      <input
        className={className}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute top-full right-0 left-0 z-10 mt-1 max-h-52 overflow-auto border border-beige-dark bg-cream shadow-lg">
          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                className="block w-full px-3.5 py-2.5 text-left text-sm text-ink hover:bg-beige"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
