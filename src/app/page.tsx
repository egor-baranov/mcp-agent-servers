export default function Home() {
    const servers = [
        {
            title: "Example 1",
            description: "Retrieving and analyzing issues from Sentry.io",
            url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry"
        },
        {
            title: "Example 2",
            description: "Retrieving and analyzing issues from Sentry.io",
            url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry"
        },
        {
            title: "Example 3",
            description: "Retrieving and analyzing issues from Sentry.io",
            url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry"
        }
    ];

    const faqItems = [
        {
            question: "What is the Model Context Protocol (MCP)?",
            answer: "The Model Context Protocol (MCP) is an open protocol designed to enable seamless integration between LLM applications and external data sources and tools. It serves as a standardized way to connect LLMs with the context they need."
        },
        {
            question: "What problem does MCP solve?",
            answer: "MCP solves the problem of fragmented integrations between AI systems and data sources. It addresses the challenge of AI models being isolated from data and trapped behind information silos, replacing multiple custom implementations with a single universal protocol."
        },
        {
            question: "Who developed the Model Context Protocol?",
            answer: "The Model Context Protocol (MCP) was developed by Anthropic."
        },
        {
            question: "What are some use cases for MCP?",
            answer: "MCP can be used in various scenarios including: building AI-powered IDEs, enhancing chat interfaces, creating custom AI workflows, connecting AI systems with external data sources."
        },
        {
            question: "Why is MCP important for AI development?",
            answer: "The Model Context Protocol (MCP) is an open protocol designed to enable seamless integration between LLM applications and external data sources and tools. It serves as a standardized way to connect LLMs with the context they need."
        },
        {
            question: "What is the Model Context Protocol (MCP)?",
            answer: "MCP is important because it provides a universal, open standard that makes it simpler and more reliable to give AI systems access to the data they need, enabling better scaling of connected systems."
        },
        {
            question: "What is the main advantage of using MCP over traditional integration methods?",
            answer: "The main advantage is that MCP eliminates the need for custom implementations for each new data source by providing a single, standardized protocol, making it easier to scale and maintain AI systems that need to access multiple data sources.\n"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
                    GigaCode MCP Server Hack
                </h1>
                <p className="text-center text-base sm:text-lg mb-5 text-balance">
                    A collection of servers for the Model Context Protocol.
                </p>
                <div className="flex justify-center">
                    <a
                        href="https://github.com/wong2/awesome-mcp-servers"
                        target="_blank"
                        className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        Submit your agent
                    </a>
                </div>
            </div>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {['All', 'Search', 'Web Scraping', 'Development'].map((category) => (
                    <a
                        key={category}
                        href={`/category/${category.toLowerCase()}`}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${
                            category === 'All' ? 'bg-black text-white text-primary-foreground' : ''
                        }`}
                    >
                        {category}
                    </a>
                ))}
            </div>

            {/* Server Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server, index) => (
                    <div key={index} className="rounded-xl border bg-card text-card-foreground shadow flex flex-col">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="font-semibold leading-none tracking-tight">
                                {server.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {server.description}
                            </div>
                        </div>
                        <div className="flex items-center p-6 pt-0 mt-auto">
                            <a
                                href={server.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-full h-9 px-4 py-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M15 3h6v6"></path>
                                    <path d="M10 14 21 3"></path>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                </svg>
                                View Details
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <section className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-10">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Model Context Protocol FAQ
                </h2>
                <div className="w-full">
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b">
                            <details className="group">
                                <summary className="flex items-center justify-between py-4 cursor-pointer">
                                    <h3 className="font-semibold text-lg">{item.question}</h3>
                                    <svg
                                        className="h-4 w-4 transition-transform group-open:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </summary>
                                <p className="pb-4 text-sm">{item.answer}</p>
                            </details>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <div className="mt-3">
                <p className="text-center text-sm">
                    <span className="text-gray-500">Unlock the Power of Multiple AIs with </span>
                    <a href="https://chathub.gg/?utm_source=mcpservers" target="_blank" className="underline">
                        ChatHub
                    </a>
                </p>
            </div>
        </div>
    );
}