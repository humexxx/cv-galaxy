## [1.4.1](https://github.com/humexxx/cv-galaxy/compare/v1.4.0...v1.4.1) (2025-12-16)

### 🐛 Bug Fixes

* update CI and release workflows to remove unnecessary push triggers and streamline sync process ([35e10c0](https://github.com/humexxx/cv-galaxy/commit/35e10c09bf3ac358cffb6b701ae3d1d09a2e3037))

### ♻️ Code Refactoring

* remove NEXT_PUBLIC_AUTH_RETURN_URL and use getBaseUrl for redirect in AuthService ([69593fc](https://github.com/humexxx/cv-galaxy/commit/69593fc0198bc5010826ce463e19db3710d659f8))

## [1.4.0](https://github.com/humexxx/cv-galaxy/compare/v1.3.0...v1.4.0) (2025-12-09)

### ✨ Features

* add database commands and types for CV management ([a2f64b6](https://github.com/humexxx/cv-galaxy/commit/a2f64b6f5f1f1d42b584c7c031d8e8a4196af77a))
* add initial database schema and user preferences table with relations ([4923963](https://github.com/humexxx/cv-galaxy/commit/49239633965a77bb6d7938ee27e32d249d54cadb))
* add supabaseUserId field during user seeding process ([0531371](https://github.com/humexxx/cv-galaxy/commit/0531371f73cdc80569b3df03f371a2cf919d78d2))
* add user preferences service and schema ([9f1a931](https://github.com/humexxx/cv-galaxy/commit/9f1a93179b7ea65fc6fc782b601e88b71ede1f56))
* enhance user experience with CV management and preferences integration ([7d0b8a3](https://github.com/humexxx/cv-galaxy/commit/7d0b8a380cc9ac9cfeb134e2c940b27e83c3bc14))
* implement search functionality with SearchProvider and update components for search integration ([4c16d17](https://github.com/humexxx/cv-galaxy/commit/4c16d1742421751b477c05987ab23c1a29741c02))
* implement user preferences management and integrate with CV generation ([1824cc5](https://github.com/humexxx/cv-galaxy/commit/1824cc5c18fb2a808f6ca2fa644e62448328dd8a))
* improve search handling in AppBar component with local state and URL synchronization ([4a0ca61](https://github.com/humexxx/cv-galaxy/commit/4a0ca614baa5c5ae98cb39cfa6f395bb772de7c0))
* refactor authentication flow and integrate server-side Supabase client ([b332565](https://github.com/humexxx/cv-galaxy/commit/b33256512b276a0056d68e154653d07eefa8a690))
* refactor environment variable handling by simplifying validation and removing unused schemas ([a6ceb6c](https://github.com/humexxx/cv-galaxy/commit/a6ceb6c4c9405a5655eb8081267e22317ca4b0a3))
* remove unused ChatResponse type import in chat-service.ts ([9362869](https://github.com/humexxx/cv-galaxy/commit/936286952be0669883c674266b38d72a6becbfe6))
* update Next.js to version 16.0.8 in package.json and package-lock.json ([503736a](https://github.com/humexxx/cv-galaxy/commit/503736aa6769dc067a60d0103c3e712ec7925da3))
* wrap SearchProvider in Suspense for improved loading state handling ([fd8ef0a](https://github.com/humexxx/cv-galaxy/commit/fd8ef0aa07d94e9531d7fe11e1c73bb3e4cc7c36))

### 🐛 Bug Fixes

* add padding to loading animation for improved visibility ([4edd83e](https://github.com/humexxx/cv-galaxy/commit/4edd83e6ed79106bdb9994c6e76e87019e9977a9))
* enforce DATABASE_URL as a required field in environment configuration ([d755948](https://github.com/humexxx/cv-galaxy/commit/d7559480f8a9397aaacbb21a45c126b288c12d77))
* ensure DATABASE_URL defaults to an empty string if not set ([439943e](https://github.com/humexxx/cv-galaxy/commit/439943ed1fb7b4b751b5c392e722b251bcbdc4cf))

### ♻️ Code Refactoring

* centralize environment variable handling and improve base URL retrieval ([7146084](https://github.com/humexxx/cv-galaxy/commit/7146084ddf720fb2deb0cde047529b269697b0cb))
* enhance CV assistant prompt for clarity and detail in responses ([111477e](https://github.com/humexxx/cv-galaxy/commit/111477e3ead6e3b6f9b5c4d3b5565f13296a1094))

## [1.3.0](https://github.com/humexxx/cv-galaxy/compare/v1.2.0...v1.3.0) (2025-12-04)

### ✨ Features

* implement postinstall script to create Chromium tar archive and update dependencies ([f783342](https://github.com/humexxx/cv-galaxy/commit/f783342dc5810a5b5c9c1d741c2b8f4b36f311af))

### 🐛 Bug Fixes

* display version number in AppBar component ([781c3ff](https://github.com/humexxx/cv-galaxy/commit/781c3ff1d862f77eda8cab2f23b2a5185eaa809d))
* improve filename handling for PDF downloads to support non-ASCII characters ([26b99a8](https://github.com/humexxx/cv-galaxy/commit/26b99a8c760328ebfda5efb7290793dcf5aab103))

### ♻️ Code Refactoring

* adjust Vercel function settings for PDF generation ([bc1e5e0](https://github.com/humexxx/cv-galaxy/commit/bc1e5e0dbe78762d07cce812505bccf5a31dd613))
* enhance logging in postinstall script and update chromium pack URL handling ([35be23c](https://github.com/humexxx/cv-galaxy/commit/35be23c70d4670cedaec5d66782a1d634ebbb511))
* streamline logging in postinstall script and improve clarity in getChromiumPath function ([f692b9e](https://github.com/humexxx/cv-galaxy/commit/f692b9eccbc277c07c223a6a2773a318a87ce1f7))
* switch to @sparticuz/chromium-min for improved compatibility ([a56a297](https://github.com/humexxx/cv-galaxy/commit/a56a2972281ce47e75ba855c3fccccaf1dbfa425))
* switch to local Chromium pack path and improve logging in getChromiumPath function ([05b18e2](https://github.com/humexxx/cv-galaxy/commit/05b18e214b3a9dadaae7887fc462a55c3f8d8d27))
* update Chromium pack handling and enhance logging in PDF route ([c693bf8](https://github.com/humexxx/cv-galaxy/commit/c693bf8f0957632e92941e510f1ceaa4b2e6954e))
* update Chromium pack handling and improve logging in getChromiumPath function ([06c19fb](https://github.com/humexxx/cv-galaxy/commit/06c19fbfac13a0a504ca9c307a34744510809509))
* update chromium version and enhance PDF generation logging ([3bee085](https://github.com/humexxx/cv-galaxy/commit/3bee08528364290df6b697f0285dc1966f76fcaf))

## [1.2.0](https://github.com/humexxx/cv-galaxy/compare/v1.1.0...v1.2.0) (2025-12-04)

### ✨ Features

* add education section to CV and update related data structures ([89afd7a](https://github.com/humexxx/cv-galaxy/commit/89afd7a1c37460746c011407b81b130eb989a056))
* enhance project link handling with tooltip for upcoming projects and add comingSoon flag to project type ([a300d66](https://github.com/humexxx/cv-galaxy/commit/a300d666ef5ab87aa2cd5564c14ef3b7a9bdb6e5))
* improve CV page layout for better mobile responsiveness and enhance contact information display ([8faf594](https://github.com/humexxx/cv-galaxy/commit/8faf594fdf24d86f81552ba5af406d39a6fc92f0))
* update CV user details from 'humexxx' to 'jason_hume' and adjust related references ([9fa35cd](https://github.com/humexxx/cv-galaxy/commit/9fa35cd5d0bbddf07e1f4530435ceeead302bacc))
* update dependencies and add CV PDF generation template ([ed57778](https://github.com/humexxx/cv-galaxy/commit/ed57778cef9bf8e4ec3f13b96a9253bc1e23a6ba))
* update metadata type to 'website' and enhance Open Graph tags for better social sharing ([15eeb85](https://github.com/humexxx/cv-galaxy/commit/15eeb853a068f16e37df7d5b665fe8cf643bb3aa))

### ♻️ Code Refactoring

* remove personal values section from CV display and PDF generation ([87c3bd2](https://github.com/humexxx/cv-galaxy/commit/87c3bd2f8fc7b5fdd8665a568f5af98a6409efeb))
* update CV assistant prompt for clarity and structure ([306e248](https://github.com/humexxx/cv-galaxy/commit/306e248acdeac4fb05255e99c9c9cb7067fc4856))

## [1.1.0](https://github.com/humexxx/cv-galaxy/compare/v1.0.0...v1.1.0) (2025-12-03)

### ✨ Features

* add description to AI Assistant in chat layout for improved accessibility ([32ed1e2](https://github.com/humexxx/cv-galaxy/commit/32ed1e2ef57b8ea2b858073dc164e8c9c3f8c9d1))
* add Gigster company details and update CV entries for improved representation ([e279054](https://github.com/humexxx/cv-galaxy/commit/e279054ca3e0b55711784d9968241df4a5a3d85e))
* add Storybook and NestJS to CV database skills ([08658e9](https://github.com/humexxx/cv-galaxy/commit/08658e9921c38d0a6039de302480eaceb5f3777f))
* enhance mobile responsiveness of CV page and AppBar layout ([5c02b6a](https://github.com/humexxx/cv-galaxy/commit/5c02b6a791ed26d332b92b7f5b4991aada4d978d))
* enhance mobile support with responsive chat layout and new hooks ([ec860a0](https://github.com/humexxx/cv-galaxy/commit/ec860a09e3f30e8dbfcb89142438c56152c531e0))
* enhance Open Graph image generation with dynamic base URL and improved response handling ([b24f8d6](https://github.com/humexxx/cv-galaxy/commit/b24f8d61d746f0b683f1d322d007ffb52e7b6dfd))
* implement useSessionStorage hook for managing session storage state ([0aa61cb](https://github.com/humexxx/cv-galaxy/commit/0aa61cb832f241b66396f5ed3a47d7c151c09f64))

### 🐛 Bug Fixes

* update AppBar logo styling for improved visibility ([df89dde](https://github.com/humexxx/cv-galaxy/commit/df89dde442c9cad385b0b5cce0f8bc4da81c2795))

## 1.0.0 (2025-12-02)

### ✨ Features

* add AI model selection and chat functionality with UI components ([174b17e](https://github.com/humexxx/cv-galaxy/commit/174b17e27e6146250a20dc195331a8ebe5c4854c))
* add CI/CD workflows for GitHub Actions and update README with deployment instructions ([7bbd551](https://github.com/humexxx/cv-galaxy/commit/7bbd5515e083982136d28fbada6eb47e3e1435b6))
* add CVHighlightProvider and HighlightedText components for enhanced text highlighting in CV sections ([af17aa7](https://github.com/humexxx/cv-galaxy/commit/af17aa7575d5bd602a076e5cd09619286f4d97a4))
* add example environment configuration and update .gitignore to include .env.local ([9f44fbb](https://github.com/humexxx/cv-galaxy/commit/9f44fbbe0a94979d51482633c6d06f9c330d6a6d))
* add MessageContent component for enhanced message rendering and update prompts for CV highlighting ([dee8143](https://github.com/humexxx/cv-galaxy/commit/dee8143a6496fa2a6dbef4ce0014a2a711f96b42))
* add NotFound and CVPage components, implement SettingsPage, and create UI components for badges, cards, dialogs, labels, and popovers ([8f200e1](https://github.com/humexxx/cv-galaxy/commit/8f200e1e73114d21a32df949bb8ba72c6cb48f54))
* add NotFound component, implement suspense for loading states, and enhance search results display with avatars ([95d5d43](https://github.com/humexxx/cv-galaxy/commit/95d5d43a3bbbdb38f33241bf179c91549343074d))
* add permissions section to preview deployment workflow ([3fac82d](https://github.com/humexxx/cv-galaxy/commit/3fac82dd4c4606e6ec4f16d801e190821ff66ab2))
* add Prestige logo SVG and update Tech9 logo SVG to white fill ([805ae66](https://github.com/humexxx/cv-galaxy/commit/805ae6686d1f2d1d11a025d622d7ee77c9c68e89))
* add reset functionality to AI chat and integrate with CvWithChatLayout ([d09239b](https://github.com/humexxx/cv-galaxy/commit/d09239be7138829176f151a287a07d9031625958))
* add vercel deployment scripts and update lint command ([6b1d02d](https://github.com/humexxx/cv-galaxy/commit/6b1d02de15acf9011c7845122342ea0ac45d6823))
* enhance AI chat layout with new icon and improved close button styling ([ce01f4c](https://github.com/humexxx/cv-galaxy/commit/ce01f4cd82ffa25355cdc5f9fff98ecc4fce9f12))
* enhance CV interaction by adding cvData support in chat components and improving highlight functionality ([051c200](https://github.com/humexxx/cv-galaxy/commit/051c200bfb611857ff9a416b29473b697fc14199))
* enhance metadata generation for CV pages and update layout metadata structure ([de64cdb](https://github.com/humexxx/cv-galaxy/commit/de64cdb2c3c6f3e47d20e6b2748a36a5eaf8e3e9))
* enhance metadata generation with authors and additional Open Graph properties ([d0f938a](https://github.com/humexxx/cv-galaxy/commit/d0f938aa143ccc9fe68f0af1b8bc0a0f72490fee))
* implement accordion component for work experience section and update dependencies ([bdcaa61](https://github.com/humexxx/cv-galaxy/commit/bdcaa61403fcec0a0d3530570ff1ec9177b7cbdd))
* implement AI chat functionality with Zod validation and refactor components ([dba818d](https://github.com/humexxx/cv-galaxy/commit/dba818d664723735fdbc4fe83a4e034da8739eca))
* implement CvWithChatLayout component for AI chat functionality ([6eb829a](https://github.com/humexxx/cv-galaxy/commit/6eb829a455783e43110c3126d263e414b55bfc15))
* implement search functionality with results display, add search bar component, and enhance app layout ([2f01393](https://github.com/humexxx/cv-galaxy/commit/2f01393247744285ce64e17c6ab6b2ea1787ed33))
* implement sidebar layout and components ([4ccb92c](https://github.com/humexxx/cv-galaxy/commit/4ccb92cc86daa9ee2466e7ec9fa6797d028d8f95))
* integrate HighlightedText component for enhanced project and personal values display in CVPage ([d03b1fd](https://github.com/humexxx/cv-galaxy/commit/d03b1fd9fadd36b3ff0672eff0803611bad66032))
* integrate highlights functionality in AiChat and update chat service to handle highlight chunks ([e6305f2](https://github.com/humexxx/cv-galaxy/commit/e6305f2d1a93489cc9cf4c5c038d2c83716743c5))
* integrate OpenAI chat functionality with user ID support and streaming responses ([8cc1128](https://github.com/humexxx/cv-galaxy/commit/8cc11285b46c97d3d7a1b78341b60b5d60d8d38b))
* integrate react-hook-form for message input handling and add chat input validation schema ([d17abaf](https://github.com/humexxx/cv-galaxy/commit/d17abafb7e9acd04897a244ab8a047357d8bca60))
* optimize highlight matching logic in HighlightedText component ([1da37f1](https://github.com/humexxx/cv-galaxy/commit/1da37f1360a0130d159b1da88d8c277936c80cff))
* optimize metadata generation for CV pages and add Open Graph image support ([722ed95](https://github.com/humexxx/cv-galaxy/commit/722ed95e97a94b35a2cfcfe5a9e5c9e85c9f65ff))
* optimize SidebarMenuSkeleton width calculation using useState ([1a12a7b](https://github.com/humexxx/cv-galaxy/commit/1a12a7b93005ba0fc5813469f32a783817e59dc2))
* refactor base URL handling for metadata generation and layout ([cf2b3fd](https://github.com/humexxx/cv-galaxy/commit/cf2b3fd0822c587f6cc8250bce0020b28331f9e6))
* refactor typography components and update usage across the application ([421a46a](https://github.com/humexxx/cv-galaxy/commit/421a46a76d9002603743495273bf9d1d6f11cdf5))
* remove unused setFocus from useForm and adjust textarea focus handling in AiChat ([50d9e13](https://github.com/humexxx/cv-galaxy/commit/50d9e13943b65f33b7a98d8b622438d4ded5fc01))
* remove unused watch from useForm and adjust chat UI layout ([0948421](https://github.com/humexxx/cv-galaxy/commit/0948421f9a906a01b090101478facccf56ceda90))
* translate comments in WorkExperienceSection to English for consistency ([a288092](https://github.com/humexxx/cv-galaxy/commit/a288092ee616323005523cbeabdc06ed6b7f3504))
* update .gitignore to include .vercel and .env*.local ([776070b](https://github.com/humexxx/cv-galaxy/commit/776070bf0a9de32530a37d55ebd5fecbcb30d75e))
* update AI model configurations and default selection in chat layout ([3ae18cf](https://github.com/humexxx/cv-galaxy/commit/3ae18cf1c503d42b624cc6bcf3bb07ff36f4c955))
* update CompanyAvatar styles, add Smash company data, and refine CV descriptions ([34e050e](https://github.com/humexxx/cv-galaxy/commit/34e050ee077c7ff36eddd1e62ecbf161e2e0f9de))
* update CV data and add new company logos ([1526f57](https://github.com/humexxx/cv-galaxy/commit/1526f57abdae5245db29508d66bec2024e0aac95))
* update tsparticles packages to version 3.9.1 and add tsparticles/react as a dependency and add ai button ([6f30b67](https://github.com/humexxx/cv-galaxy/commit/6f30b6732a5f44884e2a9b440d87bb7b755a3ced))
