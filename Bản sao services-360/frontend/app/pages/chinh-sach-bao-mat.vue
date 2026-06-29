<script setup lang="ts">
definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Chính sách bảo mật - Thần Nông',
  description: 'Chính sách bảo mật thông tin của Thần Nông.'
})
</script>

<template>
  <LandingPolicyPage :policy-type="POLICY_TYPES.PRIVACY_POLICY" />
</template>
