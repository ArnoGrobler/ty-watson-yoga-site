# Book a Private tab (removed 26 September 2026)

Taken off the homepage at Ty's request, kept here in case it comes back.
Nothing on the site links to this file.

## The copy

> Private sessions are the most direct way to work with Ty on building a personal practice, working toward a specific goal, refining your teaching, or putting the more esoteric theory of yoga to practical use.
>
> Sessions are online or in person. Email for availability.
>
> Button: **BOOK A PRIVATE SESSION** (opens an email to tyrone13watson@gmail.com, subject "Private Session Request")

## To restore

Put both pieces back into `index.html`.

**1. The tab button**, in `<div class="c-tabs__list">`, between TEACHING and ABOUT:

```html
<button class="buttons tab" data-tab="book-a-private">BOOK A PRIVATE</button>
```

**2. The panel**, in `<div class="c-panels">`, between the Teaching and About panels:

```html
<!-- BOOK A PRIVATE -->
<section class="c-panel" id="panel-book-a-private" hidden>
  <div class="c-summer">
    <p>Private sessions are the most direct way to work with Ty on building a personal practice, working toward a specific goal, refining your teaching, or putting the more esoteric theory of yoga to practical use.</p>
    <p>Sessions are online or in person. Email for availability.</p>
    <a href="mailto:tyrone13watson@gmail.com?subject=Private%20Session%20Request" class="buttons c-summer__register w-button">BOOK A PRIVATE SESSION</a>
  </div>
</section>
```

No CSS or JavaScript changes are needed; the tab logic picks panels up by their `panel-<name>` id.
