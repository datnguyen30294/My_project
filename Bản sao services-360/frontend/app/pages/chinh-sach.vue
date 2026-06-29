<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Điều khoản sử dụng - Thần Nông',
  description: 'Điều khoản sử dụng dịch vụ của Thần Nông.'
})
</script>

<template>
  <LandingPolicyPage :policy-type="POLICY_TYPES.TERMS_OF_SERVICE" />
</template>
