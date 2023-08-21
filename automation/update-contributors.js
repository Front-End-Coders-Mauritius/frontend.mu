const axios = require("axios");
const fs = require("fs");

const owner = "Front-End-Coders-Mauritius";
const repo = "frontendmu-astro";
const branch = "main"; // Replace with the default branch of your repository

const contributorsFile = "./src/data/contributors.json";

async function updateContributors() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contributors`
    );
    const contributors = response.data.map((contributor) => {
      return {
        username: contributor.login,
        contributions: contributor.contributions,
      };
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

      // Add the commit and push logic
      const { execSync } = require("child_process");

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
