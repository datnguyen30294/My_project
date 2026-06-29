<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resi_mart marketplace
    |--------------------------------------------------------------------------
    | After a platform admin creates a Partner in PMC, we call resi_mart's
    | internal API to provision the corresponding Tenant (schema + migrations).
    |
    | Auth: raw token in `Authorization: Bearer <token>` header. The same
    | token (sha256 hashed) must be set as INTERNAL_TOKEN_RESIDENTIAL_HASH on
    | the resi_mart side.
    |
    | Setting `url` to null disables the eager-provision call — partners
    | will still get provisioned lazily on first traffic at resi_mart side.
    */
    'resi_mart' => [
        'url' => env('RESI_MART_INTERNAL_URL'),
        'token' => env('RESI_MART_INTERNAL_TOKEN'),
        'timeout' => (int) env('RESI_MART_INTERNAL_TIMEOUT', 15),
        // Base host PMC uses to derive a partner subdomain from the slug.
        // E.g. base="tnp.com" → partner "hoaqua" gets domain "hoaqua.tnp.com".
        // Use "localhost" for local dev so "hoaqua.localhost:3004" resolves.
        'tenant_base_host' => env('RESI_MART_TENANT_BASE_HOST', 'localhost'),
    ],

];
