export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: 'Politics' | 'Economy' | 'Technology' | 'Sports' | 'Culture';
    imageUrl: string;
    date: string;
    author: string;
    isBreaking?: boolean;
    source?: string;
    sourceUrl?: string;
}

export const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Global Summit 2024: Leaders Address Climate Crisis',
        excerpt: 'World leaders gather in Geneva to discuss urgent measures for combating global warming and achieving net-zero emissions.',
        content: `
            <p className="mb-4">World leaders from over 190 nations have gathered in Geneva for the Global Summit 2024, focusing exclusively on the accelerating climate crisis. The opening session began with a stark warning from climate scientists about the irreversible tipping points approaching faster than previously estimated.</p>
            <p className="mb-4">Key discussions include the implementation of more aggressive carbon tax systems and the acceleration of renewable energy infrastructure in developing nations. "We no longer have the luxury of time," stated the Summit chair during the keynote address. "The decisions made here over the next three days will determine the legacy we leave for generations to come."</p>
            <h3 className="text-2xl font-bold my-4">A Unified Front?</h3>
            <p className="mb-4">Despite the urgency, tensions remain between industrial powers and developing countries regarding the "Loss and Damage" fund established in previous summits. While some progress has been made, the funding levels remain well below what scientists say is necessary to protect the most vulnerable regions.</p>
        `,
        category: 'Politics',
        imageUrl: 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80',
        date: '2024-03-12',
        author: 'Sarah Jenkins',
        isBreaking: true
    },
    {
        id: '2',
        title: 'Tech Giants Unveil Revolutionary AI Chips',
        excerpt: 'The new generation of processors promises to increase machine learning speeds by 300% while reducing energy consumption.',
        content: `
            <p className="mb-4">A consortium of leading technology firms today unveiled a breakthrough in semiconductor design: the "Aether" AI processing unit. These chips utilize a novel neuromorphic architecture that mimics the human brain's efficiency in signal processing.</p>
            <p className="mb-4">Industry experts predict that these processors will fundamentally change the landscape of edge computing, allowing powerful AI models to run locally on mobile devices without exhausting battery life. The chips are expected to enter mass production by the third quarter of this year.</p>
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-xl">"This is not just an incremental improvement; it's a paradigm shift in how we think about computing power and energy efficiency," said Dr. Elena Vance, CTO of Neurix Systems.</blockquote>
            <p className="mb-4">The implications for autonomous vehicles, medical diagnostics, and personal assistants are profound, as real-time processing becomes cheaper and more accessible than ever before.</p>
        `,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
        date: '2024-03-11',
        author: 'Ahmed Hassan'
    },
    {
        id: '3',
        title: 'Market Rally Continues as Inflation Cools',
        excerpt: 'Global stock markets reached new highs today as the latest economic data suggests inflation is finally under control.',
        content: `
            <p className="mb-4">Investors are cheering today as the latest Consumer Price Index (CPI) data showed a significant slowdown in price increases across major economies. This cooling trend has sparked a renewed rally in the stock markets, with the S&P 500 and FTSE 100 both hitting record intraday highs.</p>
            <p className="mb-4">Central bank officials have hinted at a potential pause in interest rate hikes if the trend continues. However, some analysts warn that the labor market remains tight, which could maintain upward pressure on wages.</p>
            <p className="mb-4">"While we are seeing the light at the end of the tunnel, we must remain cautious about the housing sector, which continues to show resilience even in the face of high borrowing costs," noted market analyst Mark Thompson.</p>
        `,
        category: 'Economy',
        imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258822981?auto=format&fit=crop&q=80',
        date: '2024-03-11',
        author: 'Maria Garcia'
    },
    {
        id: '4',
        title: 'Championship Finals: Underdog Team Makes History',
        excerpt: 'In a stunning upset, the city\u2019s local team defeated the defending champions to secure their first-ever league title.',
        content: `
            <p className="mb-4">The atmosphere was electric at the Olympic Stadium as the "Starlight City" underdogs completed an improbable journey to the league title. Trailing by two goals at halftime, the team rallied in the second half to score three unanswered goals against the heavily favored Titans.</p>
            <p className="mb-4">The winning goal came in the 92nd minute from a brilliant bicycle kick by the team's youngest player. Fans took to the streets in celebration, marking the first time in the club's 50-year history that they have claimed the top prize.</p>
            <p className="mb-4">"We never stopped believing," said Coach Marco Rossi in a tearful post-match interview. "Every player on this field tonight showed what can be achieved through determination and collective spirit."</p>
        `,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80',
        date: '2024-03-10',
        author: 'John Doe'
    },
    {
        id: '5',
        title: 'New Space Station Module Successfully Docked',
        excerpt: 'The international collaboration continues to bear fruit as the new research laboratory is added to the orbital station.',
        content: `
            <p className="mb-4">Mission control erupted in applause as the "Horizon" research module successfully locked into its docking port on the International Orbital Gateway. The docking procedure, which took nearly six hours of precise maneuvering, was completed autonomously using advanced laser-guided docking software.</p>
            <p className="mb-4">The module is equipped with state-of-the-art biological and physical research labs, designed to study the long-term effects of microgravity on various organisms. Astronauts are scheduled to enter the module and begin the activation sequence early tomorrow morning.</p>
        `,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
        date: '2024-03-09',
        author: 'Emily Chen'
    }
];

export const breakingNews = [
    "Breaking: Global Climate Summit announces historic agreement.",
    "Update: Tech sector sees 5% surge in early trading.",
    "Sports: Championship finals set for next Sunday.",
    "World: New peace talks scheduled for next month."
];
