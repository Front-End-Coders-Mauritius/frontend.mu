interface Project {
    title: string
    icon: string
    project_url: string
    description: string
    author_github_username: string
    categories: string[]
}

export const projects: Project[] = [
    {
        title: 'git-cz',
        icon: 'openmoji:windows',
        project_url: 'https://github.com/k3ii/git-cz',
        author_github_username: 'k3ii',
        categories: ['git', 'cli'],
        description: 'A simple git commitizen cli tool'
    },
    {
        title: 'zourer',
        icon: 'game-icons:shouting',
        project_url: 'https://github.com/nicolasstrands/zourer',
        author_github_username: 'nicolasstrands',
        categories: ['dictionary', 'open-data'],
        description: 'A dictionary of profanity words in the Mauritian Kreol language.'
    },
    {
        title: 'Mauritius Tax Calculator',
        icon: 'tdesign:money',
        project_url: 'https://github.com/n-d-r-d-g/redesigned/tree/main/mauritius_tax_calculator',
        author_github_username: 'n-d-r-d-g',
        categories: ['taxation', 'calculator', 'mauritius'],
        description: 'A simple tax calculator for Mauritius',
    },
    {
        title: 'CSS Clock',
        icon: 'mdi:clock-time-eight',
        project_url: 'https://clock-css.netlify.app/',
        author_github_username: 'MrSunshyne',
        categories: ['css', 'clock'],
        description: 'A simple clock made with CSS',
    },
    {
        title: 'Le Pop Quiz',
        icon: 'material-symbols-light:question-exchange-rounded',
        project_url: 'https://lepopquiz.com/',
        author_github_username: 'cedpoilly',
        categories: ['quiz', 'game', 'real-time', 'ai'],
        description: 'A real-time quiz game with AI',
    }

]