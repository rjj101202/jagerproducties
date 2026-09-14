# Admin — facturen versturen

Eigen mini-MoneyBird op `jagerproducties.nl/admin`: klanten beheren, facturen
maken en per mail versturen vanaf `info@jagerproducties.nl`, met PDF-bijlage en
een betaal-QR-code (EPC/SEPA — scanbaar met de app van elke Nederlandse bank).

## Eenmalige setup

Er zijn drie omgevingsvariabelen nodig (zie `.env.example`). Lokaal zet je ze in
`.env.local`; op Vercel bij **Project → Settings → Environment Variables**
(daarna redeployen).

### 1. Database (gratis)

1. Ga in het [Vercel-dashboard](https://vercel.com) naar je project →
   tabblad **Storage** → **Create Database** → kies **Neon** (Postgres, gratis plan).
2. Koppel hem aan het project. Vercel zet `DATABASE_URL` dan automatisch klaar.
3. Voor lokaal gebruik: kopieer de `DATABASE_URL` uit Vercel (Storage →
   database → `.env.local`-tabblad) naar je eigen `.env.local`.

De tabellen (`klanten`, `facturen`, `instellingen`) worden bij het eerste
gebruik automatisch aangemaakt.

### 2. Resend (mail versturen, gratis tot 3.000 mails/maand)

1. Maak een account op [resend.com](https://resend.com).
2. Ga naar **Domains** → **Add Domain** → `jagerproducties.nl` en voeg de
   getoonde DNS-records (DKIM/SPF) toe bij je domeinbeheerder. Wacht tot de
   status **Verified** is.
3. Ga naar **API Keys** → maak een key aan → zet hem in `RESEND_API_KEY`.

Zonder geverifieerd domein weigert Resend te versturen vanaf
`info@jagerproducties.nl`.

### 3. Wachtwoord

Zet een lang, uniek wachtwoord in `ADMIN_PASSWORD`. Daarmee log je in op
`/admin`; de sessie blijft 30 dagen geldig.

## Gebruik

1. **Instellingen** → vul eenmalig IBAN, btw-nummer, adres e.d. in. Deze
   gegevens komen op elke factuur.
2. **Klanten** → voeg een klant toe (naam + e-mailadres is genoeg).
3. **Facturen → Nieuwe factuur** → kies de klant, vul de regels in
   (prijzen excl. btw, in euro's — `450` of `450,50`), en maak de factuur aan.
4. Op de factuurpagina: **Bekijk PDF** om te controleren, daarna
   **Verstuur**. De klant krijgt een nette mail met het bedrag, je IBAN, het
   factuurnummer als betaalkenmerk, een QR-code en de PDF als bijlage.
5. Is er betaald? **Markeer als betaald.** Op het overzicht zie je wat er nog
   openstaat.

Factuurnummers lopen automatisch op (`2026-001`, `2026-002`, …). Verstuurde
facturen zijn bewust niet meer te bewerken of te verwijderen — dat hoort zo
voor je administratie. Opnieuw versturen (bijv. als herinnering) kan wel.
