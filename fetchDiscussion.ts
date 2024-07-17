import type { Octokit } from "@octokit/rest";
import * as fs from "fs-extra";
import * as path from "node:path";
import { fetchIssue } from "./fetchIssue";
import { exactRelatedIssueNumbers } from "./util/exactRelatedIssueNumbers";
import { extractDiscussionNumbers } from "./util/extractDiscussionNumbers";

interface DiscussionResponse {
  repository: {
    discussion: {
      id: string;
      title: string;
      body: string;
      comments: {
        nodes: {
          author: {
            login: string;
          };
          body: string;
        }[];
      };
    };
  };
}

export async function fetchDiscussion(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  outputDir: string,
  fetchedIssues: Set<number>,
  fetchedDiscussions: Set<number>,
  discussionNumber: number,
) {
  if (fetchedDiscussions.has(discussionNumber)) return;

  const query = `
    query {
      repository(owner: "${repoOwner}", name: "${repoName}") {
        discussion(number: ${discussionNumber}) {
          id
          title
          body
          comments(first: 100) {
            nodes {
              author {
                login
              }
              body
            }
          }
        }
      }
    }
  `;

  const data = await octokit.graphql<DiscussionResponse>(query);

  const discussion = data.repository.discussion;
  const discussionContent = `# ${discussion.title}\n\n${discussion.body}`;
  await fs.writeFile(
    path.join(outputDir, `discussion_${discussionNumber}.md`),
    discussionContent,
  );

  const commentsContent = discussion.comments.nodes
    .map((comment) => `## ${comment.author.login}\n\n${comment.body}`)
    .join("\n\n");
  await fs.writeFile(
    path.join(outputDir, `discussion_${discussionNumber}_comments.md`),
    commentsContent,
  );

  fetchedDiscussions.add(discussionNumber);

  const relatedIssues = exactRelatedIssueNumbers(discussion.body);
  const relatedDiscussions = extractDiscussionNumbers(discussion.body);

  for (const relatedIssue of relatedIssues) {
    await fetchIssue(
      octokit,
      repoOwner,
      repoName,
      outputDir,
      fetchedIssues,
      fetchedDiscussions,
      relatedIssue,
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
      relatedDiscussion,
    );
  }
}
