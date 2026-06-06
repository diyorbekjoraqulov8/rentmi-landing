/**
 * Shared "Ilovani bepul yuklab oling" modal state.
 *
 * The header download button (and any other CTA) flips `open` to true; the
 * modal itself is rendered once in the default layout. Keeping the flag in a
 * single `useState` instance means any trigger anywhere on the page opens the
 * same dialog.
 */
export const useAppDownloadModal = () => {
  const open = useState('app-download-modal', () => false)

  return {
    open,
    show: () => {
      open.value = true
    },
    hide: () => {
      open.value = false
    }
  }
}
