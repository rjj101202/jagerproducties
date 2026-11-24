"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { vereisAdminOfGooi } from "@/lib/admin/auth";
import {
  getProspect,
  markeerFout,
  markeerVerzonden,
  updateMailtekst,
  zetConfig,
  zetStatus,
} from "@/lib/outreach/db";
import { verstuurOutreachMail } from "@/lib/outreach/mail";

const PAD = "/admin/outreach";

function terug(status: string, extra = ""): never {
  revalidatePath(PAD);
  redirect(`${PAD}?status=${encodeURIComponent(status)}${extra}`);
}

export async function outreachConfigActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const perDag = Math.round(Number(formData.get("per_dag")));
  await zetConfig({
    aan: formData.get("aan") === "on",
    per_dag: Number.isFinite(perDag) ? Math.min(Math.max(perDag, 0), 80) : 10,
  });
  terug(String(formData.get("status") ?? "klaar"), "&opgeslagen=1");
}

function mailUitForm(formData: FormData) {
  return {
    id: Number(formData.get("id")),
    onderwerp: String(formData.get("onderwerp") ?? "").trim(),
    tekst: String(formData.get("tekst") ?? "").replace(/\r\n/g, "\n").trim(),
  };
}

export async function prospectOpslaanActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const { id, onderwerp, tekst } = mailUitForm(formData);
  if (onderwerp && tekst) await updateMailtekst(id, onderwerp, tekst);
  terug("klaar", "&opgeslagen=1");
}

export async function prospectNuVersturenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const { id, onderwerp, tekst } = mailUitForm(formData);
  if (onderwerp && tekst) await updateMailtekst(id, onderwerp, tekst);
  const p = await getProspect(id);
  if (!p || (p.status !== "klaar" && p.status !== "fout")) terug("klaar");
  try {
    await verstuurOutreachMail(p);
    await markeerVerzonden(id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await markeerFout(id, msg);
    terug("fout", `&fout=${encodeURIComponent(msg)}`);
  }
  terug("verzonden", "&verstuurd=1");
}

export async function prospectAfwijzenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  await zetStatus(Number(formData.get("id")), "afgewezen");
  terug(String(formData.get("status") ?? "klaar"));
}

export async function prospectTerugzettenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  await zetStatus(Number(formData.get("id")), "klaar");
  terug("klaar");
}
