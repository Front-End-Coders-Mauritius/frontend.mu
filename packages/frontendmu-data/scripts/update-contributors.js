import fs from "fs";
import { execSync } from "child_process";

const owner = "frontendmu";
const repo = "frontend.mu";
const branch = "main"; // Replace with the default branch of your repository

const contributorsFile = "./data/contributors.json";

async function updateContributors() {
  try {
    const allPublicRepositoriesList = await fetch(
      `https://api.github.com/users/${owner}/repos`
    ).then((response) => response.json());

    const allPublicRepositories = allPublicRepositoriesList.map(
      (repo) => repo.name
    );

    // console.log("All public repositories:", allPublicRepositories);
    // [                          
    //   '.github',                                        
    //   'branding',                                       
    //   'conference-2024',                                
    //   'events',                                         
    //   'frontend.mu',                                    
    //   'frontendmu-daisy',                               
    //   'frontendmu-nuxt',                                
    //   'frontendmu-ticket',                              
    //   'google-photos-sync',                             
    //   'hacktoberfestmu-2019',
    //   'meetupFEC',                                 
    //   'nuxt-workshop-devcon2024',
    //   'nuxt-workshop-devcon2024-preparations',
    //   'playground',                                
    //   'vercel-og-next',                            
    //   'video'                                      
    // ]                                              

    // const contributors = [];
    const contributorsMap = {};

    const excludedContributors = ["actions-user", "github-actions[bot]"];
    const excludedRepositories = [".github", "google-photos-sync", "branding"];

    for (const repo of allPublicRepositories) {
      if (excludedRepositories.includes(repo)) {
        continue;
      }
      const contributorsList = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors`
      ).then((response) => response.json());

      //   const contributorsListFiltered = contributorsList
      //     .map((contributor) => {
      //       return {
      //         username: contributor.login,
      //         contributions: contributor.contributions,
      //       };
      //     })
      //     .filter((contributor) => {
      //       return !excludedContributors.includes(contributor.username);
      //     });
      //   contributors.push(...contributorsListFiltered);
      //   console.log(`Contributors for ${repo}:`, contributorsListFiltered);
      // }
      // const updatedContributors = [...new Set(contributors)];

      contributorsList.forEach((contributor) => {
        if (!excludedContributors.includes(contributor.login)) {
          if (contributorsMap[contributor.login]) {
            contributorsMap[contributor.login] += contributor.contributions;
          } else {
            contributorsMap[contributor.login] = contributor.contributions;
          }
        }
      });
    }
    const updatedContributors = Object.entries(contributorsMap).map(([username, contributions]) => ({
      username,
      contributions
    }));
    const contributorsData = JSON.stringify(updatedContributors, null, 2);

    console.log(contributorsData)

    if (
      JSON.stringify(updatedContributors) !==
      JSON.stringify(getExistingContributors())
    ) {
      fs.writeFileSync(
        contributorsFile,
        contributorsData
      );
      // console.log("Contributors file updated.");

      // Configure Git user and email for the commit
      execSync('git config user.name "GitHub Action"');
      execSync('git config user.email "action@github.com"');

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
