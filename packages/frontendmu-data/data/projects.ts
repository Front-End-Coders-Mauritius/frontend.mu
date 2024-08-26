interface Project {
    title: string
    icon: string
    project_url: string
    author_github_username: string
    categories: string[]
}

const projects: Project[] = [
    {
        title: 'git-cz',
        icon: '',
        project_url: 'https://github.com/k3ii/git-cz',
        author_github_username: 'k3ii',
        categories: ['git', 'cli']
    },
    {
        title: 'zourer',
        icon: '',
        project_url: 'https://github.com/nicolasstrands/zourer',
        author_github_username: 'nicolasstrands',
        categories: ['git', 'cli']
    },
]