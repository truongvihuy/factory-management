export default {
  forbidden: [
    // ============================================================
    // 1. SERVICE BOUNDARY
    // ============================================================
    //
    // Cấm service này import SOURCE CODE của service khác.
    //
    // auth-service -> factory-service/src/...      ❌
    // auth-service -> auth-service/src/...         ✅
    //
    // Cross-service communication phải đi qua:
    // - proto / gRPC
    // - events
    //
    {
      name: 'no-cross-service-source-import',
      severity: 'error',
      comment: 'A service must not import source code from another service. Use gRPC contracts or events instead.',
      from: {
        path: '^apps/([^/]+)/src/',
      },
      to: {
        path: '^apps/([^/]+)/src/',
        pathNot: '^apps/$1/src/',
      },
    },

    // ============================================================
    // 2. DOMAIN BOUNDARY
    // ============================================================
    //
    // Domain không được biết Application / Infrastructure /
    // Presentation.
    //
    {
      name: 'no-domain-to-application',
      severity: 'error',
      comment: 'Domain must not depend on Application.',
      from: {
        path: '^apps/[^/]+/src/.*/domain/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/application/',
      },
    },

    {
      name: 'no-domain-to-infrastructure',
      severity: 'error',
      comment: 'Domain must not depend on Infrastructure.',
      from: {
        path: '^apps/[^/]+/src/.*/domain/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/infrastructure/',
      },
    },

    {
      name: 'no-domain-to-presentation',
      severity: 'error',
      comment: 'Domain must not depend on Presentation.',
      from: {
        path: '^apps/[^/]+/src/.*/domain/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/presentation/',
      },
    },

    // ============================================================
    // 3. APPLICATION BOUNDARY
    // ============================================================
    //
    // Application được phép biết Domain.
    // Application không được biết Infrastructure / Presentation.
    //
    {
      name: 'no-application-to-infrastructure',
      severity: 'error',
      comment: 'Application must depend on ports/contracts, not Infrastructure implementations.',
      from: {
        path: '^apps/[^/]+/src/.*/application/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/infrastructure/',
      },
    },

    {
      name: 'no-application-to-presentation',
      severity: 'error',
      comment: 'Application must not depend on Presentation.',
      from: {
        path: '^apps/[^/]+/src/.*/application/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/presentation/',
      },
    },

    // ============================================================
    // 4. INFRASTRUCTURE BOUNDARY
    // ============================================================
    //
    // Infrastructure có thể implement Domain/Application ports.
    // Nhưng không được phụ thuộc Presentation.
    //
    {
      name: 'no-infrastructure-to-presentation',
      severity: 'error',
      comment: 'Infrastructure must not depend on Presentation.',
      from: {
        path: '^apps/[^/]+/src/.*/infrastructure/',
      },
      to: {
        path: '^apps/[^/]+/src/.*/presentation/',
      },
    },

    // ============================================================
    // 5. SHARED LIBRARY BOUNDARY
    // ============================================================
    //
    // libs là shared code.
    // libs không được phụ thuộc application.
    //
    // libs -> apps/...       ❌
    //
    {
      name: 'no-libs-to-apps',
      severity: 'error',
      comment: 'Shared libraries must never depend on deployable applications.',
      from: {
        path: '^libs/',
      },
      to: {
        path: '^apps/',
      },
    },

    {
      name: 'no-library-deep-import',
      severity: 'error',
      comment: 'Libraries must be consumed through their public package API.',
      from: {
        path: '^apps/',
      },
      to: {
        path: '^libs/[^/]+/src/',
      },
    },

    // ============================================================
    // 6. PROTO BOUNDARY
    // ============================================================
    //
    // proto là contract.
    //
    // proto -> apps           ❌
    // proto -> libs           ❌
    //
    {
      name: 'no-proto-to-apps',
      severity: 'error',
      comment: 'Proto contracts must not depend on application implementations.',
      from: {
        path: '^proto/',
      },
      to: {
        path: '^apps/',
      },
    },

    {
      name: 'no-proto-to-libs',
      severity: 'error',
      comment: 'Proto must remain an independent contract boundary.',
      from: {
        path: '^proto/',
      },
      to: {
        path: '^libs/',
      },
    },
  ],

  options: {
    // ============================================================
    // Do not analyze generated / external artifacts
    // ============================================================

    doNotFollow: {
      path: ['node_modules', 'dist', 'coverage', '.*\\.generated\\..*'],
    },

    // ============================================================
    // TypeScript resolution
    // ============================================================

    tsConfig: {
      fileName: 'tsconfig.base.json',
    },

    // ============================================================
    // Ignore tests from architecture graph
    // ============================================================

    exclude: [
      'node_modules',
      'dist',
      'coverage',
      '.*\\.spec\\.ts$',
      '.*\\.test\\.ts$',
      '.*\\.e2e-spec\\.ts$',
      'apps/.*/src/infrastructure/database/prisma/generated/',
    ],

    // ============================================================
    // Reporter
    // ============================================================

    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
    },
  },
};
