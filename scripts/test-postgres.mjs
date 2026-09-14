// Tijdelijke lokale Postgres voor handmatige verificatie van de admin.
// Vereist eenmalig: npm i --no-save embedded-postgres
// Gebruik: node scripts/test-postgres.mjs  (blijft draaien tot Ctrl+C)
// Zet dan in .env.local: DATABASE_URL=postgres://postgres:testwachtwoord@localhost:5433/jager
import EmbeddedPostgres from "embedded-postgres";

const pg = new EmbeddedPostgres({
  databaseDir: "./.pgdata-test",
  user: "postgres",
  password: "testwachtwoord",
  port: 5433,
  persistent: true,
});

await pg.initialise();
await pg.start();
try {
  await pg.createDatabase("jager");
} catch {
  // bestaat al
}
console.log("Postgres draait op poort 5433 (database: jager). Ctrl+C om te stoppen.");

process.on("SIGINT", async () => {
  await pg.stop();
  process.exit(0);
});
