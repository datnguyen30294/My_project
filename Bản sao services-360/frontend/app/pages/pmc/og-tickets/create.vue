<script setup lang="ts">
import type { CreateOgTicketPayload } from '~/composables/api/useOgTickets'
import type { CustomerListResource, CustomersIndexParams } from '~/composables/api/useCustomers'
import type { OgTicketCategoryResource } from '#api/generated/laravel'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Tạo OG Ticket - Thần Nông' })

const toast = useToast()

// ─── Form state ───
const form = reactive<CreateOgTicketPayload>({
  requester_name: '',
  requester_phone: '',
  subject: '',
  description: null,
  address: null,
  apartment_name: null,
  latitude: null,
  longitude: null,
  channel: 'website' as CreateOgTicketPayload['channel'],
  project_id: null,
  priority: 'normal' as CreateOgTicketPayload['priority'],
  internal_note: null,
  received_by_id: null,
  assigned_to_ids: [],
  category_ids: []
})

const files = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// ─── Options ───
const priorityOptions = OG_TICKET_PRIORITY_OPTIONS
const channelOptions = [
  { label: 'Website', value: 'website' },
  { label: 'Ứng dụng', value: 'app' },
  { label: 'Điện thoại', value: 'phone' },
  { label: 'Trực tiếp', value: 'direct' }
]

// ─── Customer picker ───
type CustomerMode = 'picker' | 'selected' | 'manual'

interface CustomerPickerItem {
  id: number
  label: string
  customer: CustomerListResource
}

const customerMode = ref<CustomerMode>('picker')
const selectedCustomer = ref<CustomerListResource | null>(null)
const customerPickerValue = ref<CustomerPickerItem | undefined>(undefined)
const customerSearchTerm = ref('')
const customerSearchParams = ref<CustomersIndexParams & { page?: number }>({ per_page: 10 })

const { data: customerListData, status: customerListStatus } = useCustomerList(customerSearchParams)

const customerPickerItems = computed<CustomerPickerItem[]>(() =>
  (customerListData.value?.data ?? []).map(c => ({
    id: c.id,
    label: `${c.full_name} — ${c.phone}`,
    customer: c
  }))
)

const isSearchingCustomer = computed(() => customerListStatus.value === 'pending')

let customerSearchTimeout: ReturnType<typeof setTimeout> | null = null
function onCustomerSearchTerm(term: string) {
  customerSearchTerm.value = term
  if (customerSearchTimeout) clearTimeout(customerSearchTimeout)
  customerSearchTimeout = setTimeout(() => {
    customerSearchParams.value = { ...customerSearchParams.value, search: term || undefined }
  }, 300)
}

watch(customerPickerValue, (item) => {
  if (item) {
    selectedCustomer.value = item.customer
    form.requester_phone = item.customer.phone
    form.requester_name = item.customer.full_name
    customerMode.value = 'selected'
  }
})

function switchToManual() {
  customerMode.value = 'manual'
  selectedCustomer.value = null
  customerPickerValue.value = undefined

  // Pre-fill phone/name từ search term (nếu giống SĐT thì vào field SĐT, ngược lại vào tên)
  const term = customerSearchTerm.value.trim()
  if (term) {
    if (/^[0-9+\-\s]+$/.test(term)) {
      form.requester_phone = stripPhone(term)
    } else {
      form.requester_name = term
    }
  }
}

function resetCustomerPicker() {
  customerMode.value = 'picker'
  selectedCustomer.value = null
  customerPickerValue.value = undefined
  customerSearchTerm.value = ''
  customerSearchParams.value = { per_page: 10 }
  form.requester_phone = ''
  form.requester_name = ''
}

// ─── Accounts (for received_by + assignees) ───
const { data: accountsData } = useAccountList(computed(() => ({ per_page: SELECT_ALL_PER_PAGE })))
const accountOptions = computed(() => (accountsData.value?.data ?? []).map(acc => ({
  label: acc.name,
  value: acc.id
})))

// ─── Categories ───
const categoryOptions = ref<{ label: string, value: number }[]>([])
onMounted(async () => {
  try {
    const res = await apiListOgTicketCategories({ per_page: 200, sort_by: 'sort_order', sort_direction: 'asc' })
    categoryOptions.value = res.data.map((c: OgTicketCategoryResource) => ({ label: c.name, value: c.id }))
  } catch {
    categoryOptions.value = []
  }
})

// ─── Attachments ───
const totalFileCount = computed(() => files.value.length)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  for (const file of Array.from(input.files)) {
    if (totalFileCount.value >= ATTACHMENT_MAX_FILES) break
    if (file.size > ATTACHMENT_MAX_FILE_SIZE || !ATTACHMENT_ALLOWED_TYPES.includes(file.type)) continue
    files.value.push(file)
  }
  input.value = ''
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

// ─── Submit ───
const isSubmitting = ref(false)
const errors = reactive<{ requester_name?: string, requester_phone?: string, subject?: string }>({})

watch(() => form.requester_name, () => {
  errors.requester_name = undefined
})
watch(() => form.requester_phone, () => {
  errors.requester_phone = undefined
})
watch(() => form.subject, () => {
  errors.subject = undefined
})

function validate(): boolean {
  errors.requester_name = form.requester_name.trim() ? undefined : 'Vui lòng nhập tên khách hàng.'
  errors.requester_phone = form.requester_phone.trim() ? undefined : 'Vui lòng nhập số điện thoại.'
  errors.subject = form.subject.trim() ? undefined : 'Vui lòng nhập tiêu đề.'
  return !errors.requester_name && !errors.requester_phone && !errors.subject
}

async function handleSubmit() {
  if (!validate()) {
    toast.add({ title: 'Vui lòng kiểm tra lại các trường bắt buộc.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    const res = await apiCreateOgTicket({
      ...form,
      attachments: files.value.length > 0 ? files.value : undefined
    })
    toast.add({ title: 'Đã tạo OG Ticket', color: 'success' })
    navigateTo(`/pmc/og-tickets/${res.data.id}`)
  } catch (err) {
    toast.add({ title: getApiErrorMessage(err, 'Tạo ticket thất bại'), color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  navigateTo('/pmc/og-tickets')
}
</script>

<template>
  <div>
    <!-- ═══ HEADER ═══ -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          to="/pmc/og-tickets"
        />
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Tạo OG Ticket
          </h1>
          <p class="text-slate-500 text-sm mt-0.5">
            Tạo ticket mới cho khách hàng (gồm ticket gốc ở hệ thống)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        />
        <UButton
          label="Tạo ticket"
          icon="i-lucide-plus"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Forms -->
      <!-- ─── Khách hàng ─── -->
      <SharedSectionCard title="Khách hàng">
        <!-- Mode 1: Picker — tìm khách hàng trong danh bạ -->
        <div v-if="customerMode === 'picker'">
          <p class="text-sm font-medium text-slate-700 mb-1.5">
            Tìm khách hàng <span class="text-red-500">*</span>
          </p>
          <USelectMenu
            v-model="customerPickerValue"
            :items="customerPickerItems"
            :loading="isSearchingCustomer"
            :ignore-filter="true"
            :search-input="{ placeholder: 'Nhập số điện thoại hoặc tên khách hàng...' }"
            placeholder="Nhập SĐT hoặc tên để tìm trong danh bạ"
            class="w-full"
            @update:search-term="onCustomerSearchTerm"
          >
            <template #empty>
              <div class="px-2 py-3 text-center">
                <p class="text-sm text-slate-500 mb-2">
                  {{ customerSearchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Nhập SĐT hoặc tên để tìm kiếm' }}
                </p>
                <UButton
                  v-if="customerSearchTerm"
                  label="Tạo khách hàng mới"
                  icon="i-lucide-user-plus"
                  color="primary"
                  variant="soft"
                  size="xs"
                  @click="switchToManual"
                />
              </div>
            </template>
          </USelectMenu>
          <p class="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
            <span>Không có khách hàng trong danh bạ?</span>
            <button
              type="button"
              class="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              @click="switchToManual"
            >
              Tạo mới
            </button>
          </p>
          <p
            v-if="errors.requester_phone || errors.requester_name"
            class="text-xs text-red-500 mt-1"
          >
            Vui lòng chọn khách hàng hoặc nhập thông tin mới.
          </p>
        </div>

        <!-- Mode 2: Đã chọn khách hàng — hiển thị thông tin cơ bản -->
        <div v-else-if="customerMode === 'selected' && selectedCustomer">
          <div class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
            <div class="size-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-user-check"
                class="size-5 text-emerald-600"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-slate-900">
                  {{ selectedCustomer.full_name }}
                </p>
                <UBadge
                  color="success"
                  variant="subtle"
                  size="xs"
                >
                  Đã có trong danh bạ
                </UBadge>
              </div>
              <div class="mt-1 flex items-center gap-4 flex-wrap text-xs text-slate-500">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-lucide-phone"
                    class="size-3.5"
                  />
                  {{ selectedCustomer.phone }}
                </span>
                <span
                  v-if="selectedCustomer.email"
                  class="flex items-center gap-1"
                >
                  <UIcon
                    name="i-lucide-mail"
                    class="size-3.5"
                  />
                  {{ selectedCustomer.email }}
                </span>
                <span
                  v-if="selectedCustomer.code"
                  class="font-mono"
                >
                  {{ selectedCustomer.code }}
                </span>
              </div>
            </div>
            <UButton
              label="Đổi"
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="resetCustomerPicker"
            />
          </div>
        </div>

        <!-- Mode 3: Manual — form điền khách hàng mới -->
        <div v-else>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-user-plus"
                class="size-4 text-indigo-500"
              />
              <span class="text-sm font-semibold text-slate-700">Khách hàng mới</span>
              <UBadge
                color="info"
                variant="subtle"
                size="xs"
              >
                Sẽ thêm vào danh bạ khi lưu
              </UBadge>
            </div>
            <UButton
              label="Tìm trong danh bạ"
              icon="i-lucide-search"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="resetCustomerPicker"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Số điện thoại <span class="text-red-500">*</span>
              </p>
              <UInput
                v-model="form.requester_phone"
                placeholder="VD: 0901234567"
                class="w-full"
                :color="errors.requester_phone ? 'error' : undefined"
              />
              <p
                v-if="errors.requester_phone"
                class="text-xs text-red-500 mt-1"
              >
                {{ errors.requester_phone }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1.5">
                Tên khách hàng <span class="text-red-500">*</span>
              </p>
              <UInput
                v-model="form.requester_name"
                placeholder="Nhập họ tên"
                class="w-full"
                :color="errors.requester_name ? 'error' : undefined"
              />
              <p
                v-if="errors.requester_name"
                class="text-xs text-red-500 mt-1"
              >
                {{ errors.requester_name }}
              </p>
            </div>
          </div>
        </div>
      </SharedSectionCard>

      <!-- ─── Nội dung ticket ─── -->
      <SharedSectionCard title="Nội dung ticket">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Tiêu đề <span class="text-red-500">*</span>
            </p>
            <UInput
              v-model="form.subject"
              placeholder="VD: Sửa điện phòng 101"
              class="w-full"
              :color="errors.subject ? 'error' : undefined"
            />
            <p
              v-if="errors.subject"
              class="text-xs text-red-500 mt-1"
            >
              {{ errors.subject }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Mô tả
            </p>
            <UTextarea
              v-model="form.description"
              :rows="3"
              class="w-full"
              placeholder="Mô tả chi tiết..."
            />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Kênh tiếp nhận <span class="text-red-500">*</span>
            </p>
            <USelect
              v-model="form.channel"
              :items="channelOptions"
              class="w-full"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Căn hộ
            </p>
            <UInput
              v-model="form.apartment_name"
              placeholder="VD: A-101"
              class="w-full"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Dự án
            </p>
            <SharedProjectSelect v-model="form.project_id" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Phân loại
            </p>
            <USelectMenu
              :model-value="form.category_ids ?? []"
              :items="categoryOptions"
              value-key="value"
              multiple
              placeholder="Chọn phân loại"
              class="w-full"
              @update:model-value="form.category_ids = $event"
            />
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="border-t border-slate-100 pt-5 mt-5">
          <SharedAddressMapPicker
            :model-value="form.address ?? ''"
            :latitude="form.latitude ?? null"
            :longitude="form.longitude ?? null"
            collapsible
            @update:model-value="form.address = $event"
            @update:latitude="form.latitude = $event"
            @update:longitude="form.longitude = $event"
          />
        </div>

        <!-- Tệp đính kèm -->
        <div class="border-t border-slate-100 pt-5 mt-5">
          <div class="flex items-center gap-2 mb-3">
            <UIcon
              name="i-lucide-paperclip"
              class="size-4 text-slate-400"
            />
            <span class="text-sm font-semibold text-slate-700">Tệp đính kèm</span>
            <span class="text-xs text-slate-400">({{ totalFileCount }}/{{ ATTACHMENT_MAX_FILES }})</span>
          </div>

          <div
            v-if="files.length > 0"
            class="flex flex-col gap-2 mb-3"
          >
            <div
              v-for="(file, idx) in files"
              :key="idx"
              class="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
            >
              <div
                class="size-8 rounded-lg flex items-center justify-center shrink-0"
                :class="isImageMime(file.type) ? 'bg-violet-100' : 'bg-amber-100'"
              >
                <UIcon
                  :name="isImageMime(file.type) ? 'i-lucide-image' : 'i-lucide-file-text'"
                  class="size-4"
                  :class="isImageMime(file.type) ? 'text-violet-500' : 'text-amber-600'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-slate-700 truncate">
                  {{ file.name }}
                </p>
                <p class="text-[10px] text-slate-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
              <button
                type="button"
                class="size-6 rounded-md hover:bg-red-50 flex items-center justify-center cursor-pointer"
                @click="removeFile(idx)"
              >
                <UIcon
                  name="i-lucide-x"
                  class="size-3.5 text-slate-400 hover:text-red-500"
                />
              </button>
            </div>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx"
            class="hidden"
            @change="handleFileSelect"
          >
          <button
            v-if="totalFileCount < ATTACHMENT_MAX_FILES"
            type="button"
            class="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer w-full justify-center"
            @click="fileInputRef?.click()"
          >
            <UIcon
              name="i-lucide-upload"
              class="size-4"
            />
            Thêm tệp đính kèm
          </button>
        </div>
      </SharedSectionCard>

      <!-- ─── Xử lý ─── -->
      <SharedSectionCard title="Phân công & xử lý">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Ưu tiên <span class="text-red-500">*</span>
            </p>
            <USelect
              v-model="form.priority"
              :items="priorityOptions"
              class="w-full"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Người tiếp nhận
            </p>
            <USelect
              :model-value="form.received_by_id ?? undefined"
              :items="accountOptions"
              placeholder="Chọn người tiếp nhận"
              class="w-full"
              @update:model-value="form.received_by_id = $event ?? null"
            />
          </div>
          <div class="sm:col-span-2">
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Người thi công
            </p>
            <USelectMenu
              :model-value="form.assigned_to_ids ?? []"
              :items="accountOptions"
              value-key="value"
              multiple
              placeholder="Chọn người thi công"
              class="w-full"
              @update:model-value="form.assigned_to_ids = $event"
            />
            <p class="text-xs text-slate-400 mt-1">
              Gán người thi công sẽ tự chuyển trạng thái sang <strong>Đã phân công</strong>.
            </p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-sm font-medium text-slate-700 mb-1.5">
              Ghi chú nội bộ
            </p>
            <UTextarea
              v-model="form.internal_note"
              placeholder="Nhập ghi chú nội bộ..."
              :rows="3"
              class="w-full"
            />
          </div>
        </div>
      </SharedSectionCard>

      <!-- Mobile actions -->
      <div class="flex items-center gap-3 lg:hidden">
        <UButton
          label="Tạo ticket"
          icon="i-lucide-plus"
          color="primary"
          :loading="isSubmitting"
          class="flex-1"
          @click="handleSubmit"
        />
        <UButton
          label="Hủy"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
