<script setup lang="ts">
import type { VendorOrderItem } from '~/composables/api/useVendorOrders'

interface Props {
  items: VendorOrderItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="border border-slate-200 rounded-lg overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="w-12" />
          <th class="text-left px-3 py-2 font-medium">
            Sản phẩm
          </th>
          <th class="text-right px-3 py-2 font-medium w-16">
            SL
          </th>
          <th class="text-right px-3 py-2 font-medium w-28">
            Đơn giá
          </th>
          <th class="text-right px-3 py-2 font-medium w-28">
            Thành tiền
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-t border-slate-100"
        >
          <td class="px-2 py-2">
            <img
              v-if="item.cover_url"
              :src="item.cover_url"
              :alt="item.product_name"
              class="w-10 h-10 object-cover rounded"
            >
            <div
              v-else
              class="w-10 h-10 bg-slate-100 rounded"
            />
          </td>
          <td class="px-3 py-2">
            <p class="font-medium text-slate-900">
              {{ item.product_name }}
            </p>
            <p
              v-if="item.variant_name"
              class="text-xs text-slate-500"
            >
              {{ item.variant_name }}
            </p>
            <p class="text-xs text-slate-400 font-mono">
              {{ item.sku }}
            </p>
          </td>
          <td class="px-3 py-2 text-right">
            {{ item.quantity }}
          </td>
          <td class="px-3 py-2 text-right">
            {{ formatCurrency(item.unit_price) }}
          </td>
          <td class="px-3 py-2 text-right font-medium">
            {{ formatCurrency(item.subtotal) }}
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td
            colspan="5"
            class="text-center text-slate-500 py-6"
          >
            Không có sản phẩm
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
