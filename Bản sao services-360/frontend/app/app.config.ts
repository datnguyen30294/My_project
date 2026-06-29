export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'slate'
    },
    input: {
      slots: {
        base: [
          'w-full rounded-lg border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-slate-100 disabled:text-slate-500',
          'transition-colors'
        ]
      },
      variants: {
        size: {
          md: {
            base: 'px-3 py-2 text-sm gap-1.5',
            leading: 'ps-3',
            trailing: 'pe-3',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          }
        }
      }
    },
    select: {
      slots: {
        base: [
          'relative group rounded-lg inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-slate-100 disabled:text-slate-500',
          'transition-colors'
        ],
        content: 'max-h-60 w-(--reka-select-trigger-width) bg-white shadow-lg rounded-lg ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col'
      },
      variants: {
        size: {
          md: {
            base: 'px-3 py-2 text-sm gap-1.5',
            leading: 'ps-3',
            trailing: 'pe-3'
          }
        }
      }
    },
    selectMenu: {
      slots: {
        base: [
          'relative group rounded-lg inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-slate-100 disabled:text-slate-500',
          'transition-colors'
        ],
        content: [
          'max-h-60 w-(--reka-select-trigger-width) bg-white shadow-lg rounded-lg ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col',
          'origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)'
        ]
      },
      variants: {
        size: {
          md: {
            base: 'px-3 py-2 text-sm gap-1.5',
            leading: 'ps-3',
            trailing: 'pe-3'
          }
        }
      }
    },
    textarea: {
      slots: {
        base: [
          'w-full rounded-lg border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-slate-100 disabled:text-slate-500',
          'transition-colors'
        ]
      },
      variants: {
        size: {
          md: {
            base: 'px-3 py-2 text-sm gap-1.5',
            leading: 'ps-3 inset-y-2',
            trailing: 'pe-3 inset-y-2'
          }
        }
      }
    },
    modal: {
      slots: {
        content: 'bg-default divide-y divide-default flex flex-col focus:outline-none'
      },
      variants: {
        fullscreen: {
          false: {
            content: 'w-[calc(100vw-2rem)] max-w-lg rounded-xl shadow-lg ring ring-default'
          }
        },
        overlay: {
          true: {
            overlay: 'bg-black/50'
          }
        }
      }
    },
    button: {
      slots: {
        base: 'rounded-lg font-semibold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0'
      },
      variants: {
        size: {
          sm: {
            base: 'text-sm px-3 py-1.5 gap-1.5',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4'
          },
          md: {
            base: 'text-sm px-4 py-2 gap-2',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          }
        }
      },
      compoundVariants: [
        {
          color: 'primary' as const,
          variant: 'solid' as const,
          class: 'text-white bg-slate-900 shadow-sm hover:bg-slate-800 active:bg-slate-800 disabled:bg-slate-900 aria-disabled:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900'
        },
        {
          color: 'error' as const,
          variant: 'solid' as const,
          class: 'text-white bg-red-600 shadow-sm hover:bg-red-700 active:bg-red-700 disabled:bg-red-600 aria-disabled:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
        },
        {
          color: 'neutral' as const,
          variant: 'outline' as const,
          class: 'ring ring-inset ring-border-gray text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100'
        },
        {
          color: 'neutral' as const,
          variant: 'ghost' as const,
          class: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        },
        {
          color: 'neutral' as const,
          variant: 'link' as const,
          class: 'text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline'
        }
      ]
    },
    checkbox: {},
    alert: {
      compoundVariants: [
        { color: 'warning' as const, variant: 'subtle' as const, class: { root: 'bg-amber-50 text-amber-800 ring ring-inset ring-amber-300' } },
        { color: 'error' as const, variant: 'subtle' as const, class: { root: 'bg-red-50 text-red-700 ring ring-inset ring-red-200' } },
        { color: 'info' as const, variant: 'subtle' as const, class: { root: 'bg-blue-50 text-blue-700 ring ring-inset ring-blue-200' } },
        { color: 'success' as const, variant: 'subtle' as const, class: { root: 'bg-green-50 text-green-700 ring ring-inset ring-green-200' } }
      ]
    },
    badge: {
      slots: {
        base: 'font-semibold inline-flex items-center w-fit'
      },
      compoundVariants: [
        { color: 'primary' as const, variant: 'subtle' as const, class: 'bg-primary-50 text-primary-700 ring ring-inset ring-primary-200' },
        { color: 'success' as const, variant: 'subtle' as const, class: 'bg-green-50 text-green-700 ring ring-inset ring-green-200' },
        { color: 'warning' as const, variant: 'subtle' as const, class: 'bg-amber-50 text-amber-700 ring ring-inset ring-amber-200' },
        { color: 'error' as const, variant: 'subtle' as const, class: 'bg-red-50 text-red-700 ring ring-inset ring-red-200' },
        { color: 'info' as const, variant: 'subtle' as const, class: 'bg-blue-50 text-blue-700 ring ring-inset ring-blue-200' },
        { color: 'neutral' as const, variant: 'subtle' as const, class: 'bg-slate-50 text-slate-700 ring ring-inset ring-slate-200' },
        { color: 'secondary' as const, variant: 'subtle' as const, class: 'bg-violet-50 text-violet-700 ring ring-inset ring-violet-200' },
        { color: 'primary' as const, variant: 'soft' as const, class: 'bg-primary-100 text-primary-800' },
        { color: 'success' as const, variant: 'soft' as const, class: 'bg-green-100 text-green-800' },
        { color: 'warning' as const, variant: 'soft' as const, class: 'bg-amber-100 text-amber-800' },
        { color: 'error' as const, variant: 'soft' as const, class: 'bg-red-100 text-red-800' },
        { color: 'info' as const, variant: 'soft' as const, class: 'bg-blue-100 text-blue-800' },
        { color: 'neutral' as const, variant: 'soft' as const, class: 'bg-slate-100 text-slate-800' }
      ]
    },
    tabs: {
      slots: {
        list: 'overflow-x-auto',
        trigger: 'shrink-0 cursor-pointer'
      },
      compoundVariants: [
        { variant: 'link' as const, class: { indicator: 'bottom-0' } }
      ]
    },
    table: {
      slots: {
        root: 'relative overflow-auto',
        base: 'min-w-full overflow-clip',
        thead: 'relative bg-[#fafafa]',
        tbody: 'divide-y divide-border-gray/50 [&>tr]:hover:bg-gray-50/50 [&>tr]:transition-colors',
        th: 'px-4 py-3 text-[13px] text-nav-text-secondary text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0',
        td: 'px-4 py-4 text-sm text-slate-800 whitespace-nowrap [&:has([role=checkbox])]:pe-0',
        separator: 'absolute z-[1] left-0 w-full h-px bg-border-gray',
        empty: 'py-6 text-center text-sm text-nav-text-secondary'
      }
    }
  }
})
