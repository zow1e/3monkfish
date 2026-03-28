import "dotenv/config";
import { runRagAnswer } from "@petcare/rag-answer";
import { parsePetIdAndQuery } from "./parseArgs.js";

async function main() {
  const defaultQuestion = "How much hay should my Holland Lop get each day?";
  const { petId, query: question } = parsePetIdAndQuery(process.argv.slice(2), defaultQuestion);

  const text = await runRagAnswer(question, petId);
  console.log(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
