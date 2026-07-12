import { useTheme } from '@/hooks/useTheme'
import { Icon } from '@iconify/react'

export default function ThemeToggle() {
  const { isDark, onThemeChange } = useTheme()

  return (
    <label className="tw:toggle tw:text-base-content">
      <input
        type="checkbox"
        checked={isDark}
        onChange={onThemeChange}
        value="dark"
        className="theme-controller"
      />
      <Icon icon="mdi:weather-sunny" className="tw:w-5 tw:h-5" />
      <Icon icon="mdi:weather-night" className="tw:w-5 tw:h-5" />
    </label>
  )
}
