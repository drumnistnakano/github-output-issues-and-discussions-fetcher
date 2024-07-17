# GitHub Issues and Discussions Fetcher

This project is a command-line tool to fetch GitHub issues and related discussions for a given repository. It uses the GitHub API to retrieve the data and saves it to the local filesystem.

## Features

- Fetch issues and their comments from a GitHub repository.
- Fetch discussions and their comments from a GitHub repository.
- Recursively fetch related issues and discussions mentioned in the body of issues and discussions.
- Save the fetched data as markdown files.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/drumnistnakano/github-output-issues-and-related.git
   cd github-output-issues-and-related
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your GitHub token:

   ```env
   GITHUB_TOKEN=your_github_token
   ```

## Usage

Run the CLI tool:

```bash
npm run cli
```

Follow the prompts to enter the repository owner, repository name, and issue numbers to fetch.

## File Structure

- `fetchIssue.ts`: Contains the function to fetch a single issue and its related issues and discussions.
- `fetchDiscussion.ts`: Contains the function to fetch a single discussion and its related issues and discussions.
- `fetchIssueAndRelated.ts`: Contains the function to fetch multiple issues and their related issues and discussions.
- `main.ts`: Entry point for the CLI tool.
- `package.json`: Project configuration and dependencies.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `.env`: Environment variables file (not included in the repository).

## Example

Here is an example of how the fetched data is saved:

- `issues/issue_1.md`: Contains the issue title, body, and comments.
- `issues/discussion_1.md`: Contains the discussion title and body.
- `issues/discussion_1_comments.md`: Contains the comments of the discussion.

## License

This project is licensed under the MIT License.
