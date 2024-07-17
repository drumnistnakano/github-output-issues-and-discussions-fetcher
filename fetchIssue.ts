import { Octokit } from "@octokit/rest";
import * as fs from "fs-extra";
import * as path from "path";
import { fetchDiscussion } from "./fetchDiscussion";

export async function fetchIssue(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  outputDir: string,
  fetchedIssues: Set<number>,
  fetchedDiscussions: Set<number>,
  issueNumber: number
) {
  if (fetchedIssues.has(issueNumber)) return;

  try {
    const { data: issue } = await octokit.issues.get({
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
    });

    const { data: comments } = await octokit.issues.listComments({
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
    });

    const commentsContent = comments
      .map(
        (comment) => `### Comment by ${comment.user?.login}\n\n${comment.body}`
      )
      .join("\n\n");

    const issueContent = `# ${issue.title}\n\n${issue.body}\n\n${commentsContent}`;
    await fs.writeFile(
      path.join(outputDir, `issue_${issueNumber}.md`),
      issueContent
    );

    fetchedIssues.add(issueNumber);

    const relatedIssues = extractRelatedIssues(issue.body ?? null);
    const relatedDiscussions = extractRelatedDiscussions(issue.body ?? null);

    for (const relatedIssue of relatedIssues) {
      await fetchIssue(
        octokit,
        repoOwner,
        repoName,
        outputDir,
        fetchedIssues,
        fetchedDiscussions,
        relatedIssue
      );
    }

    for (const relatedDiscussion of relatedDiscussions) {
      await fetchDiscussion(
        octokit,
        repoOwner,
        repoName,
        outputDir,
        fetchedIssues,
        fetchedDiscussions,
        relatedDiscussion
      );
    }
  } catch (error) {
    if (error.status === 404) {
      console.error(`Issue #${issueNumber} not found.`);
    } else {
      throw error;
    }
  }
}

function extractRelatedIssues(body: string | null): number[] {
  return (body?.match(/#[0-9]+/g) || []).map((str) => parseInt(str.slice(1)));
}

function extractRelatedDiscussions(body: string | null): number[] {
  return (
    body?.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/discussions\/[0-9]+/g) ||
    []
  ).map((url) => parseInt(url.split("/").pop()!));
}
