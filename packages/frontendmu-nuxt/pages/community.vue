<template>
  <ContentBlock>
    <BaseHeading :level="1">
      Community
    </BaseHeading>
    <div class="text-verse-600 dark:text-verse-300 pt-4 pb-16 text-center md:text-left flex flex-col gap-8">
      <div class="text-xl font-bold">
        Featured Github Issues
      </div>

      <CommunityGithubIssuesSection />

      <div class="text-xl font-bold">
        Projects
      </div>
      <CommunityProjectsSection />
    </div>
  </ContentBlock>
</template>
