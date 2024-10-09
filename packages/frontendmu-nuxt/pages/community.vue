<template>
  <ContentBlock>
    <BaseHeading :level="1">
      Community
    </BaseHeading>
    <div class="text-verse-600 dark:text-verse-300 pt-4 text-center md:text-left flex flex-col gap-6">
      <div class="text-xl font-bold mt-8">
        Featured Github Issues
      </div>

      <CommunityGithubIssuesSection />

      <div class="text-xl font-bold mt-8">
        Projects
      </div>
      <CommunityProjectsSection />
    </div>
  </ContentBlock>
</template>
