import { Octokit } from "@octokit/rest";
import * as fs from "fs-extra";
import * as path from "path";
import { fetchIssue } from "./fetchIssue";

export const fetchIssueAndRelated = async ({
  repoOwner,
  repoName,
  issueNumbers,
  outputDir,
  octokit,
}: {
  repoOwner: string;
  repoName: string;
  issueNumbers: number[];
  outputDir: string;
  octokit: Octokit;
}): Promise<void> => {
  const fetchedIssues = new Set<number>();
  const fetchedDiscussions = new Set<number>();

  fs.ensureDirSync(outputDir);

  for (const issueNumber of issueNumbers) {
    await fetchIssue(
      octokit,
      repoOwner,
      repoName,
      outputDir,
      fetchedIssues,
      fetchedDiscussions,
      issueNumber
    );
  }
};
