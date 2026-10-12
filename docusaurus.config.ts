
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

const year = new Date().getFullYear();

const GITHUB_REPO = 'https://github.com/SprintAfrica1/sprint-docs';

const config: Config = {
  title: 'Sprint Connect API',
  tagline: 'Move anything across Nigeria with one API.',
  favicon: 'img/favicon.ico',

  url: 'https://docs.sprintafrica.com.ng',
  baseUrl: '/',

  organizationName: 'SprintAfrica1',
  projectName: 'sprint-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${GITHUB_REPO}/tree/main/`,
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          sprint: {
            specPath: 'openapi.yaml',
            outputDir: 'docs/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
            proxy: 'https://api.sprintafrica.com.ng',
            hideSendButton: false,
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/social-card.png',

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: '',
      logo: {
        alt: 'Sprint Africa',
        src: 'img/sprint-logo.png',
        srcDark: 'img/sprint-logo.png',
        height: 36,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guides',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sandbox',
          position: 'left',
          label: 'Sandbox',
        },
        {
          to: '/docs/api/rates-create',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://sprintafrica.com.ng/merchant',
          position: 'right',
          label: 'Merchant Portal',
        },
        {
          href: GITHUB_REPO,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'Sprint Connect API documentation GitHub repository',
        },
        {
          href: 'https://sprintafrica.com.ng/merchant/signup',
          position: 'right',
          label: 'Get Started',
          className: 'navbar-cta',
        },
      ],
    },

    footer: {
      style: 'dark',
      logo: {
        alt: 'Sprint Africa',
        src: 'img/logo-dark.png',
        height: 40,
      },
      links: [
        {
          title: 'Product',
          items: [
            { label: 'Rate quotes', to: '/docs/api/rates-create' },
            { label: 'Shipments', to: '/docs/api/shipments-create' },
            { label: 'Tracking', to: '/docs/api/tracking-read' },
            {
              label: 'Bulk deliveries',
              to: '/docs/guides/send-a-bulk-batch',
            },
          ],
        },
        {
          title: 'Developers',
          items: [
            { label: 'Documentation', to: '/docs/intro' },
            { label: 'Quickstart', to: '/docs/quickstart' },
            { label: 'API Reference', to: '/docs/api/rates-create' },
            { label: 'Authentication', to: '/docs/authentication' },
            { label: 'Error handling', to: '/docs/guides/errors' },
            { label: 'Sandbox', to: '/docs/sandbox/get-a-sandbox-key' },
            {
              label: 'GitHub Repository',
              href: GITHUB_REPO,
            },
          ],
        },
        {
          title: 'Sprint Africa',
          items: [
            { label: 'Home', href: 'https://sprintafrica.com.ng' },
            {
              label: 'Merchant Portal',
              href: 'https://sprintafrica.com.ng/merchant',
            },
            {
              label: 'Track a parcel',
              href: 'https://sprintafrica.com.ng/track',
            },
            {
              label: 'Rate card',
              href: 'https://sprintafrica.com.ng/rate-card',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Contact',
              href: 'https://sprintafrica.com.ng/contact',
            },
            {
              label: 'Terms',
              href: 'https://sprintafrica.com.ng/terms',
            },
            {
              label: 'Privacy',
              href: 'https://sprintafrica.com.ng/privacy',
            },
          ],
        },
      ],
      copyright: `
        <p class="sc-foot-tag">Sprint Connect by Sprint Africa. One API to simplify logistics integration across Nigeria.</p>
        <ul class="sc-foot-chips">
          <li>REST API</li>
          <li>Sandbox &amp; live</li>
          <li>Developer-first</li>
        </ul>
        <p class="sc-foot-legal">© ${year} Sprint Africa Limited. All rights reserved.</p>
      `,
    },

    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: [
        'bash',
        'json',
        'python',
        'php',
        'ruby',
        'go',
        'java',
        'csharp',
      ],
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
