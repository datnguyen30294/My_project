import type {
  CreateContractDraftPayload,
  ContractDetail
} from '~/composables/api/usePartnerCommissionContracts'
import {
  defaultPerOrderTerms
} from '~/composables/api/usePartnerCommissionContracts'

/**
 * Build an empty draft payload (used by Create page).
 */
export function emptyContractDraft(): CreateContractDraftPayload {
  return {
    partner_id: 0,
    tenant_id: '',
    project_id: 0,
    commission_mode: 'per_order',
    revenue_recipient: 'platform',
    starts_at: new Date().toISOString().substring(0, 10),
    ends_at: null,
    notes: null,
    contract_code: null,
    terms: defaultPerOrderTerms()
  }
}

/**
 * Build a draft payload from an existing detail (used by Edit page).
 */
export function contractDraftFromDetail(c: ContractDetail): CreateContractDraftPayload {
  return {
    partner_id: c.partner_id,
    tenant_id: c.tenant_id,
    project_id: c.project_id,
    commission_mode: c.commission_mode.value,
    revenue_recipient: c.revenue_recipient.value,
    starts_at: c.starts_at ? c.starts_at.substring(0, 10) : '',
    ends_at: c.ends_at ? c.ends_at.substring(0, 10) : null,
    notes: c.notes,
    contract_code: c.contract_code,
    terms: c.terms
  }
}
