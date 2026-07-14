import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
