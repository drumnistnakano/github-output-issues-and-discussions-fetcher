import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import { input, confirm, select } from "@inquirer/prompts";
import { fetchIssueAndRelated } from "./fetchIssueAndRelated";

const controllersChoices = [
  { name: "Fetch Issue and Related", value: "fetchIssueAndRelated" },
] as const;

async function getRepoDetails() {
  const repoOwner = await input({
    message: "Enter the repository owner:",
    default: process.env.REPO_OWNER || "default-owner",
  });

  const repoName = await input({
    message: "Enter the repository name:",
    default: process.env.REPO_NAME || "default-repo",
  });

  return { repoOwner, repoName };
}

async function main() {
  const { repoOwner, repoName } = await getRepoDetails();
  const outputDir = "./issues";

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const controllerAnswers = await select({
    message: "Select the task to execute:",
    choices: controllersChoices,
  });
  const controller = controllerAnswers;

  const isConfirmed = await confirm({
    message: `Do you want to execute the task? controller=${controller}`,
  });

  if (!isConfirmed) {
    return;
  }

  switch (controller) {
    case "fetchIssueAndRelated": {
      const issueNumbersInput = await input({
        message: "Enter the issue numbers to fetch (comma-separated):",
        required: true,
      });
      const issueNumbers = issueNumbersInput
        .split(",")
        .map((num) => parseInt(num.trim()));
      await fetchIssueAndRelated({
        repoOwner,
        repoName,
        issueNumbers,
        outputDir,
        octokit,
      });
      break;
    }
    default: {
      throw new Error(`Invalid controller. controller=${controller}`);
    }
  }
}

dotenv.config();
main();
