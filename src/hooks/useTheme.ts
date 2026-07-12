export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [isDark])

  const onThemeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDark(e.target.checked)
  }, [])

  return { isDark, onThemeChange }
}
