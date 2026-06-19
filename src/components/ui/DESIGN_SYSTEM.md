# Editorial Design System — Quick Reference for Page Refactors

> Use this when refactoring page components in `src/pages/`. Always import primitives from `@/components/ui` (barrel).

## Goal

Transform pages from bespoke section/card markup into thin shells composed of
shared primitives. Strip out hardcoded colors, hardcoded fonts, duplicated CSS
that lives in tokens, and inline section wrappers. Preserve **all** behavior,
data fetching, state, computed values, props, emits, and routes. Only the
**view layer + style block** should change.

The page should feel like a museum-quality editorial — bold, colorful, joyful.
Use marquees, eyebrows, blob/dot/squiggle accents, asymmetric corners, ink
offset block-shadows. Vary tones between sections so adjacent sections never
share the same tone.

## Primitives (import from `@/components/ui`)

| Component | Key props / slots |
|---|---|
| `AppContainer` | `size: sm \| md \| lg \| wide` (default `md`), `padded` (default true) |
| `AppSection` | `tone: cream \| cream-2 \| paper \| ink \| cobalt \| marigold \| mint \| fuchsia` (default `cream`); `pattern: none \| dots \| squiggle`; `pad: sm \| md \| lg \| xl \| none` (default `lg`); `divider: top \| bottom \| both \| none`; named slots `eyebrow`, `title`, `lede` (built-in centered heading) |
| `AppHero` | `variant: editorial \| magazine \| compact`; `tone` same as Section minus paper; `align: left \| center`; slots `eyebrow`, `title`, `lede`, `actions`, `meta`, `media` |
| `AppHeading` | `level: 1-6`; `display`; `accent` (Caprasimo); `align`; `highlight: marigold \| mint \| cobalt \| fuchsia \| none` |
| `AppEyebrow` | `tone: marigold \| cobalt \| fuchsia \| mint \| ink` |
| `AppButton` | `variant: primary \| accent \| secondary \| ghost \| ink \| playful`; `size: sm \| md \| lg`; `to`/`href`/`type`; `loading`; `disabled`; `block`; `square`. Click event emits `click`. Slot is label. |
| `AppCard` | `variant: plaque \| ticket \| postcard \| flat`; `tone`; `shadowTone: ink \| cobalt \| marigold \| fuchsia \| mint \| none`; `to`/`href`; `interactive`; `pad: sm \| md \| lg \| none`; slots `media`, `eyebrow`, `title`, default, `footer` |
| `AppBadge` | `tone: ink \| cobalt \| marigold \| fuchsia \| mint \| plum \| cream`; `filled`; `size: sm \| md \| lg` |
| `AppGrid` | `min: number` (px, default 280), `gap: sm \| md \| lg`, `as: tag` |
| `AppQuote` | `tone: marigold \| cobalt \| mint \| fuchsia \| cream`; `cite` prop or slot |
| `AppMarquee` | `items: string[]`; `tone`; `speed: number` seconds; `reverse` |
| `AppSpinner` | `size: sm \| md \| lg`; `tone` |
| `AppEmptyState` | `variant: empty \| error`; `title`; `message`; slots `title`, default (message), `actions` |
| `AppBlob` | `tone: marigold \| cobalt \| fuchsia \| mint \| cream-2`; `size: number` px; `spin` |
| `AppDots` | `tone`; `size: number` px. Absolutely positioned — wrap in `position:relative` parent. |
| `AppSquiggle` | `tone`; `height: number` |
| `AppField` | `label`, `hint`, `error`, `required`, `for`; slot for input |
| `AppInput` | `modelValue` (string/number), `type`, `placeholder`, `required`, `disabled`, `id`, `autocomplete` |
| `AppTextarea` | `modelValue`, `placeholder`, `rows`, `required`, `disabled`, `id` |
| `AppSelect` | `modelValue`, `required`, `disabled`, `id`; slot for `<option>` |
| `AppCheckbox` | `modelValue` (boolean), `disabled`, `id`; slot for label |

## Token CSS variables (use these in scoped style blocks)

**Colors:** `--c-marigold`, `--c-marigold-deep`, `--c-marigold-soft`, `--c-cobalt`, `--c-cobalt-deep`, `--c-cobalt-soft`, `--c-fuchsia`, `--c-fuchsia-deep`, `--c-fuchsia-soft`, `--c-mint`, `--c-mint-deep`, `--c-mint-soft`, `--c-plum`, `--c-ink`, `--c-cream`, `--c-cream-2`, `--c-cream-3`, `--c-paper`, `--c-text`, `--c-text-muted`, `--c-text-subtle`, `--c-text-on-dark`.

**Spacing:** `--s-0` ... `--s-10` (4px → 96px scale).

**Radii:** `--r-sm` `--r-md` `--r-lg` `--r-xl` `--r-pill`; asymmetrics `--r-asym-a`, `--r-asym-b`, `--r-asym-c`; `--r-blob`.

**Fonts:** `--font-display` (Fraunces), `--font-body` (Inter), `--font-accent` (Caprasimo).

**Type scale:** `--fs-xs` `--fs-sm` `--fs-md` `--fs-lg` `--fs-xl` `--fs-2xl` `--fs-3xl` `--fs-4xl` `--fs-5xl` `--fs-6xl`.

**Other:** `--lh-tight`, `--lh-snug`, `--lh-base`, `--ls-tight`, `--ls-wide`, `--ls-shout`, `--shadow-block`, `--shadow-block-sm`, `--shadow-block-lg`, `--shadow-soft`, `--dur-fast`, `--dur-base`, `--dur-slow`, `--ease-out`, `--ease-in-out`, `--ease-snap`, `--container-narrow`, `--container-max`, `--container-wide`.

## SCSS mixins (`@use '@/assets/scss/shapes' as shape;`)

`shape.dotted(tone, size)`, `shape.asym-corners`, `shape.block-shadow(tone, x, y)`, `shape.squiggle-divider(tone)`, `shape.blob-bg(tone)`, `shape.focus-ring`, `shape.press-feedback`, `shape.hover-lift`, `shape.reduced-motion-safe`.

## Editorial recipes

### Section composition (use this everywhere)

```vue
<AppSection tone="cream" pattern="dots" pad="xl">
  <AppContainer size="lg">
    <header class="my-head">
      <AppEyebrow tone="fuchsia">Section eyebrow</AppEyebrow>
      <h2 class="u-display u-display--md">Section title</h2>
      <p>Lede paragraph.</p>
    </header>
    <AppGrid :min="280" gap="md">
      <AppCard variant="plaque" tone="paper" shadow-tone="cobalt"><!-- ... --></AppCard>
    </AppGrid>
  </AppContainer>
</AppSection>
```

### Tone rotation across a page

`cream` → `mint` → `cream-2` → `marigold` (or `cobalt` for a contrast block) → `cream`.
Insert `<AppMarquee>` or `<AppSquiggle>` between sections for rhythm.

### Hero variants

- `editorial` — split layout (text left, media right). Use for marketing pages with imagery.
- `magazine` — centered with large display title. Use for blog posts, articles.
- `compact` — short header. Use for utility pages (Login, Account, Terms, Privacy).

### Pull-quote

```vue
<AppQuote tone="marigold" cite="— Practitioner Name">
  Editorial-weight pull-quote text.
</AppQuote>
```

### CTA block (centered, ink)

```vue
<AppSection tone="ink" pad="xl">
  <AppContainer size="md">
    <div class="cta">
      <h2>Call to action</h2>
      <AppButton to="/somewhere" variant="primary" size="lg">Do the thing</AppButton>
    </div>
  </AppContainer>
</AppSection>
```

## Page styling rules

1. **Delete every `@import '@/assets/common.scss'` if no longer referenced** — common.scss only matters for legacy pages.
2. **Use `tokens` and `_typography` automatically** — they're in the global `scss/index.scss` chain, no per-component import needed.
3. **Scoped style block should be small** — most layout lives in the primitives. Keep only page-specific composition styles.
4. **Strip duplicated `:root` blocks, hero CSS, button classes, card classes** — they belong in the design system.
5. **Use `var(--c-*)` not hex values** (you can grep `#[0-9a-f]{6}` to find leftovers).
6. **Use `var(--font-display)`/`var(--font-body)`/`var(--font-accent)`** not `'Playfair Display'`/`'Inter'`/etc.
7. **Use `var(--s-*)` for spacing** not raw px or rem.
8. **Section sequence** — wrap every page in `<main>`, each top-level region is an `<AppSection>`.
9. **Preserve aria/accessibility attributes** — alt text, aria-label, role, etc.
10. **Preserve all routes, events, fetches, computed, watch, ref logic** — move only markup and styles.

## Existing card wrappers (re-use, do NOT replace)

- `EventCard`, `FeaturedEventCard`, `BlogCard`, `InfoCard`, `ProductCard`, `ResourceCard`, `ServiceCard`, `VideoCard` — all under `src/components/cards/`. These already use AppCard internally.

## CMS image shape

```ts
interface CmsImage {
  id: number
  url: string
  width: number
  height: number
  alternativeText?: string | null
  formats?: { small?: { url: string }; thumbnail?: { url: string } }
}
```

When passing CMS images from a CMS-typed response to a card prop, coalesce nullable
fields to `undefined`: `:icon="card.icon ?? undefined"`.

## Validation

After every page refactor, run `npm run type-check` from `getting-there-ui/`. The whole project must remain zero-error.
