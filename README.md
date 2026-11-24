# Prosafety – nový web (návrh A)

Statický web prosafety.sk. Čisté HTML, CSS a JavaScript, nepotrebuje server ani databázu. Funguje na GitHub Pages aj na bežnom webhostingu.

## Štruktúra

| Priečinok / súbor | Čo obsahuje |
|---|---|
| `index.html` | Domovská stránka |
| `o-nas/`, `sluzby/`, `kurzy/`, `opravnenia/`, `cennik/`, `kontakt/` | Hlavné stránky |
| `bts/`, `koordinacia-na-stavenisku/`, `skolenia/`, `ochrana-pred-poziarmi/` | Služby |
| `bezpecnostny-technik-bt/`, `kurz-obsluhy-motorovych-vozikov/`, … | 10 stránok kurzov |
| `404.html` | Stránka „neexistuje“ |
| `css/style.css` | Celý vzhľad webu |
| `js/main.js` | Mobilné menu a kontaktný formulár |
| `img/` | Logo a fotky |

Adresy podstránok sú rovnaké ako na súčasnom webe (napr. `/bts/`, `/cennik/`).

## Výmena obrázkov

Všetky fotky sú v `img/` (domovská stránka `A1`–`A6`, hlavné stránky `img/stranky/`, kurzy `img/kurzy/`).
Obrázok vymeníte tak, že nový uložíte pod **rovnakým názvom** do toho istého priečinka (JPG, 4:3, ideálne 1600 × 1200 px) a nahráte na GitHub. Kód netreba meniť.

## Kontaktný formulár

Formulár posiela správy cez bezplatnú službu [FormSubmit.co](https://formsubmit.co) na adresu nastavenú v `js/main.js` (riadok `var FORM_EMAIL = 'info@prosafety.sk';`).

1. Po prvom odoslaní formulára príde na túto adresu e-mail od FormSubmit s tlačidlom **Activate Form** – treba ho potvrdiť.
2. Od tej chvíle chodia všetky správy z formulára do schránky. Odpoveď (Reply) ide priamo odosielateľovi.
3. Na testovanie môžete dočasne zmeniť adresu v `js/main.js` na vlastnú.

Ak by služba nebola dostupná, formulár ponúkne odoslanie cez e-mailového klienta.

Tlačidlá „Prihlásiť sa na kurz“ otvárajú kontaktný formulár s vopred vyplneným predmetom.

## Vyhľadávače

Všetky stránky majú `<meta name="robots" content="noindex, nofollow">`, aby testovacia verzia nekonkurovala súčasnému webu v Google. Pri spustení ostrého webu tento riadok odstráňte.

## Oprávnenia

Skeny oprávnení sa zatiaľ načítavajú zo súčasného webu (`prosafety.sk/wp-content/...`). Pred vypnutím starého webu ich treba stiahnuť do `img/opravnenia/` a upraviť odkazy.
