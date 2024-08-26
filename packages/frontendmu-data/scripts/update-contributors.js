import fs from "fs";
import { execSync } from "child_process";

const owner = "Front-End-Coders-Mauritius";
const repo = "frontend.mu";
const branch = "main"; // Replace with the default branch of your repository

const contributorsFile = "./data/contributors.json";

async function updateContributors() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`
    );

    const result = await response.json();
    const contributors = result
      .map((contributor) => {
        return {
          username: contributor.login,
          contributions: contributor.contributions,
        };
      })
      .filter((contributor) => {
        // Exclude the following contributors from the list
        const excludedContributors = ["actions-user", "github-actions[bot]"];
        return !excludedContributors.includes(contributor.username);
      });

    const updatedContributors = [...new Set(contributors)];

    if (
      JSON.stringify(updatedContributors) !==
      JSON.stringify(getExistingContributors())
    ) {
      fs.writeFileSync(
        contributorsFile,
        JSON.stringify(updatedContributors, null, 2)
      );
      console.log("Contributors file updated.");

      // Configure Git user and email for the commit
      execSync('git config --global user.name "GitHub Action"');
      execSync('git config --global user.email "action@github.com"');

      // Stage the changes
      execSync("git add .");

      // Create the commit
      execSync(`git commit -m "Update contributors.json [skip ci]"`);

      // Push the changes to the repository
      execSync(`git push origin ${branch}`);

      console.log("Changes committed and pushed to the repository.");
    } else {
      console.log(
        "No changes detected in contributors. Skipping commit and push."
      );
    }
  } catch (error) {
    console.error("Error updating contributors:", error);
  }
}

function getExistingContributors() {
  if (fs.existsSync(contributorsFile)) {
    return JSON.parse(fs.readFileSync(contributorsFile));
  }
  return [];
}

updateContributors();
