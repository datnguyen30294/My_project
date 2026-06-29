import type { TableColumn } from '@nuxt/ui'

const STICKY_TH_BG = 'bg-[#fafafa]'
const STICKY_TD_BG = 'bg-white'
const STICKY_SHADOW = 'shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.08)]'

interface StickyRightOptions {
  right?: string
  width?: string
  shadow?: boolean
}

/**
 * Pin a UTable column to the right edge so it stays visible while the table
 * scrolls horizontally. Typical use: CRUD action column (view/edit/delete).
 *
 * For multiple sticky columns, pass increasing `right` offsets from right-to-left
 * (e.g. actions at `right-0`, second pinned column at `right-[120px]`).
 */
export function stickyRight<T>(
  column: TableColumn<T>,
  options: StickyRightOptions = {}
): TableColumn<T> {
  const {
    right = 'right-0',
    width = 'w-[120px] min-w-[120px]',
    shadow = true
  } = options

  const base = ['sticky', right, width, shadow ? STICKY_SHADOW : '']
    .filter(Boolean)
    .join(' ')

  const existingTh = column.meta?.class?.th
  const existingTd = column.meta?.class?.td

  return {
    ...column,
    meta: {
      ...column.meta,
      class: {
        ...column.meta?.class,
        th: [base, 'z-20', STICKY_TH_BG, existingTh].filter(Boolean).join(' '),
        td: [base, 'z-10', STICKY_TD_BG, existingTd].filter(Boolean).join(' ')
      }
    }
  }
}
