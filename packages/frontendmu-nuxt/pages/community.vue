<template>
    <ContentBlock>
        <BaseHeading :level="1">
            Community
        </BaseHeading>
        <div class="text-verse-600 dark:text-verse-300 pt-4 pb-16 text-center md:text-left flex flex-col gap-4">
            <div class="text-xl font-bold">
                Featured Github Issues
            </div>

            <CommunityGithubIssuesSection />

            <div>
                Projects
            </div>
        </div>
    </ContentBlock>
</template>
