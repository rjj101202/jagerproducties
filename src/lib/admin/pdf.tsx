import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { epcQrDataUrl } from "./epc";
import {
  aantalNL,
  berekenTotalen,
  datumNL,
  euro,
  Factuur,
  Instellingen,
  Klant,
} from "./types";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#1a1a1a",
    paddingTop: 48,
    paddingHorizontal: 48,
    paddingBottom: 90,
  },
  kop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 36 },
  merk: { fontSize: 20, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  titel: { fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "right" },
  label: { color: "#777777", marginBottom: 2 },
  blokken: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  meta: { alignItems: "flex-end" },
  metaRij: { flexDirection: "row", marginBottom: 2 },
  metaLabel: { color: "#777777", width: 90 },
  tabelKop: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  rij: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dddddd",
    paddingVertical: 6,
  },
  colOmschrijving: { flex: 1, paddingRight: 8 },
  colAantal: { width: 50, textAlign: "right" },
  colPrijs: { width: 75, textAlign: "right" },
  colBtw: { width: 45, textAlign: "right" },
  colBedrag: { width: 80, textAlign: "right" },
  totalen: { alignItems: "flex-end", marginTop: 10 },
  totaalRij: { flexDirection: "row", paddingVertical: 2 },
  totaalLabel: { width: 130, textAlign: "right", paddingRight: 12, color: "#555555" },
  totaalBedrag: { width: 80, textAlign: "right" },
  eindbedrag: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    borderTopWidth: 1.5,
    borderTopColor: "#1a1a1a",
    paddingTop: 5,
    marginTop: 3,
  },
  betaalblok: {
    marginTop: 34,
    flexDirection: "row",
    backgroundColor: "#f5f3ef",
    borderRadius: 6,
    padding: 16,
    alignItems: "center",
  },
  qr: { width: 92, height: 92, marginRight: 16 },
  betaalKop: { fontFamily: "Helvetica-Bold", fontSize: 10.5, marginBottom: 5 },
  betaalRegel: { marginBottom: 2, lineHeight: 1.4 },
  voet: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#bbbbbb",
    paddingTop: 8,
    color: "#777777",
    fontSize: 8,
    textAlign: "center",
  },
});

function FactuurDocument({
  factuur,
  klant,
  instellingen,
  qrDataUrl,
}: {
  factuur: Factuur;
  klant: Klant;
  instellingen: Instellingen;
  qrDataUrl: string | null;
}) {
  const t = berekenTotalen(factuur.regels);
  const i = instellingen;
  return (
    <Document
      title={`Factuur ${factuur.nummer}`}
      author={i.bedrijfsnaam}
      language="nl"
    >
      <Page size="A4" style={s.page}>
        <View style={s.kop}>
          <View>
            <Text style={s.merk}>{i.bedrijfsnaam.toUpperCase()}</Text>
            <Text style={{ color: "#777777", marginTop: 3 }}>
              Videoproductie — {i.plaats || "Nederland"}
            </Text>
          </View>
          <Text style={s.titel}>FACTUUR</Text>
        </View>

        <View style={s.blokken}>
          <View>
            <Text style={s.label}>Factuur aan</Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{klant.naam}</Text>
            {klant.contactpersoon ? <Text>t.a.v. {klant.contactpersoon}</Text> : null}
            {klant.adres ? <Text>{klant.adres}</Text> : null}
            {klant.postcode || klant.plaats ? (
              <Text>
                {[klant.postcode, klant.plaats].filter(Boolean).join("  ")}
              </Text>
            ) : null}
            {klant.btw_nummer ? <Text>Btw-nr: {klant.btw_nummer}</Text> : null}
          </View>
          <View style={s.meta}>
            <View style={s.metaRij}>
              <Text style={s.metaLabel}>Factuurnummer</Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{factuur.nummer}</Text>
            </View>
            <View style={s.metaRij}>
              <Text style={s.metaLabel}>Factuurdatum</Text>
              <Text>{datumNL(factuur.datum)}</Text>
            </View>
            <View style={s.metaRij}>
              <Text style={s.metaLabel}>Vervaldatum</Text>
              <Text>{datumNL(factuur.vervaldatum)}</Text>
            </View>
            <View style={s.metaRij}>
              <Text style={s.metaLabel}>KvK</Text>
              <Text>{i.kvk}</Text>
            </View>
            {i.btw_nummer ? (
              <View style={s.metaRij}>
                <Text style={s.metaLabel}>Btw-nummer</Text>
                <Text>{i.btw_nummer}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={s.tabelKop}>
          <Text style={s.colOmschrijving}>Omschrijving</Text>
          <Text style={s.colAantal}>Aantal</Text>
          <Text style={s.colPrijs}>Prijs</Text>
          <Text style={s.colBtw}>Btw</Text>
          <Text style={s.colBedrag}>Bedrag</Text>
        </View>
        {factuur.regels.map((r, idx) => (
          <View style={s.rij} key={idx} wrap={false}>
            <Text style={s.colOmschrijving}>{r.omschrijving}</Text>
            <Text style={s.colAantal}>{aantalNL(r.aantal)}</Text>
            <Text style={s.colPrijs}>{euro(r.prijs_cent)}</Text>
            <Text style={s.colBtw}>{r.btw}%</Text>
            <Text style={s.colBedrag}>{euro(Math.round(r.aantal * r.prijs_cent))}</Text>
          </View>
        ))}

        <View style={s.totalen}>
          <View style={s.totaalRij}>
            <Text style={s.totaalLabel}>Subtotaal excl. btw</Text>
            <Text style={s.totaalBedrag}>{euro(t.subtotaal_cent)}</Text>
          </View>
          {Object.entries(t.btw_per_tarief).map(([tarief, cent]) => (
            <View style={s.totaalRij} key={tarief}>
              <Text style={s.totaalLabel}>Btw {tarief}%</Text>
              <Text style={s.totaalBedrag}>{euro(cent)}</Text>
            </View>
          ))}
          <View style={[s.totaalRij, s.eindbedrag]}>
            <Text style={[s.totaalLabel, { color: "#1a1a1a", fontFamily: "Helvetica-Bold" }]}>
              Te betalen
            </Text>
            <Text style={s.totaalBedrag}>{euro(t.totaal_cent)}</Text>
          </View>
        </View>

        <View style={s.betaalblok} wrap={false}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image kent geen alt */}
          {qrDataUrl ? <Image src={qrDataUrl} style={s.qr} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.betaalKop}>
              {`Betaal ${euro(t.totaal_cent)} vóór ${datumNL(factuur.vervaldatum)}`}
            </Text>
            <Text style={s.betaalRegel}>
              Maak het bedrag over op {i.iban} t.n.v. {i.naam_rekeninghouder} onder
              vermelding van factuurnummer {factuur.nummer}.
            </Text>
            {qrDataUrl ? (
              <Text style={{ color: "#777777", marginTop: 3 }}>
                Of scan de QR-code met de app van je bank — bedrag en kenmerk staan er
                al in.
              </Text>
            ) : null}
          </View>
        </View>

        {factuur.opmerking ? (
          <Text style={{ marginTop: 16, color: "#555555" }}>{factuur.opmerking}</Text>
        ) : null}

        <View style={s.voet} fixed>
          <Text>
            {[
              i.bedrijfsnaam,
              [i.adres, [i.postcode, i.plaats].filter(Boolean).join(" ")]
                .filter(Boolean)
                .join(", "),
              i.email,
              i.telefoon,
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </Text>
          <Text style={{ marginTop: 2 }}>
            {[
              `KvK ${i.kvk}`,
              i.btw_nummer ? `Btw ${i.btw_nummer}` : "",
              i.iban ? `IBAN ${i.iban}` : "",
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </Text>
          {i.voettekst ? <Text style={{ marginTop: 2 }}>{i.voettekst}</Text> : null}
        </View>
      </Page>
    </Document>
  );
}

export async function maakFactuurPdf(
  factuur: Factuur,
  klant: Klant,
  instellingen: Instellingen
): Promise<Buffer> {
  const t = berekenTotalen(factuur.regels);
  const qrDataUrl = instellingen.iban
    ? await epcQrDataUrl({
        naam: instellingen.naam_rekeninghouder,
        iban: instellingen.iban,
        bedragCent: t.totaal_cent,
        omschrijving: `Factuur ${factuur.nummer}`,
      })
    : null;
  return renderToBuffer(
    <FactuurDocument
      factuur={factuur}
      klant={klant}
      instellingen={instellingen}
      qrDataUrl={qrDataUrl}
    />
  );
}
