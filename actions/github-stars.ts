'use server'
export async function getStars() {
    const owner = 'cygnuxxs'
    const repo = 'prepflow'
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        // revalidate every 1 hour
        next: { revalidate: 3600 },
    })
    const data = await res.json()
    return data.stargazers_count
}