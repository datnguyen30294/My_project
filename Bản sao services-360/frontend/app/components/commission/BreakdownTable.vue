<script setup lang="ts">
import type { CommissionTableRow } from '~/composables/useCommissionMindmap'

defineProps<{
  rows: CommissionTableRow[]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-slate-100 border-b border-slate-200">
          <th class="px-4 py-2 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
            Bên nhận
          </th>
          <th class="px-4 py-2 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
            Công thức
          </th>
          <th class="px-4 py-2 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider whitespace-nowrap">
            Thành tiền
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          :class="[
            row.isSummary
              ? 'bg-slate-50 border-t-2 border-slate-300'
              : 'bg-white',
            idx > 0 && !row.isSummary ? 'border-t border-slate-100' : ''
          ]"
        >
          <!-- Label -->
          <td
            class="px-4 py-2"
            :class="[
              row.isSummary ? 'font-bold text-slate-900' : '',
              row.level === 0 && !row.isSummary ? 'font-medium text-slate-900' : '',
              row.level === 1 ? 'text-slate-700' : '',
              row.level === 2 ? 'text-slate-500 text-xs' : ''
            ]"
          >
            <div
              class="flex items-center gap-1.5"
              :style="{ paddingLeft: row.isSummary ? '0' : `${row.level * 20}px` }"
            >
              <span
                v-if="row.level === 1"
                class="text-slate-300"
              >├</span>
              <span
                v-if="row.level === 2"
                class="text-slate-300"
              >└</span>
              <span>{{ row.label }}</span>
            </div>
          </td>

          <!-- Formula -->
          <td
            class="px-4 py-2 font-mono text-xs text-slate-400"
          >
            {{ row.formula }}
          </td>

          <!-- Amount -->
          <td
            class="px-4 py-2 text-right font-mono whitespace-nowrap tabular-nums"
            :class="[
              row.isSummary ? 'font-bold text-slate-900' : '',
              row.level === 0 && !row.isSummary && !row.isIntermediary ? 'font-semibold text-slate-900' : '',
              row.isIntermediary ? 'text-slate-400' : '',
              row.level === 2 ? 'text-slate-500 text-xs' : ''
            ]"
          >
            <template v-if="row.isIntermediary">
              —
            </template>
            <template v-else>
              {{ formatCurrency(row.amount) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
