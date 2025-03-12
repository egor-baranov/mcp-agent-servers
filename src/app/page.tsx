"use client";
import React, { useState } from 'react';

// Define types for Server, FAQItem, and Category
interface Server {
    title: string;
    description: string;
    url: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

interface Category {
    name: string;
}

export default function Page() {
    // Data arrays with explicit types
    const servers: Server[] = [
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

    const faqItems: FAQItem[] = [
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
            answer: "The main advantage is that MCP eliminates the need for custom implementations for each new data source by providing a single, standardized protocol, making it easier to scale and maintain AI systems that need to access multiple data sources."
        }
    ];

    const categories: Category[] = [
        { name: "All" },
        { name: "Search" },
        { name: "Web Scraping" },
        { name: "Communication" },
        { name: "Productivity" },
        { name: "Database" },
        { name: "Cloud Service" },
        { name: "File System" },
        { name: "Cloud Storage" },
        { name: "Version Control" },
        { name: "Other" }
    ];

    // Modal state and form data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link: '',
        category: ''
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Open and close modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Agent Details:', formData); // Replace with actual submission logic
        closeModal(); // Close the modal after submission
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
                    GigaCode MCP Server Hack
                </h1>
                <p className="text-center text-base sm:text-lg mb-5 text-balance">
                    Список репозиторев, участвующих в хакатоне по разработке агентов производственного процесса от
                    GigaCode.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={openModal}
                        className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black border border-gray-300 shadow-sm hover:bg-black hover:text-white hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                    >
                        Добавить агента
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {categories.map(({name}) => (
                    <a
                        key={name}
                        href={`/category/${name.toLowerCase().replace(' ', '-')}`}
                        className={`
                            inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                            transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                            disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2
                            ${
                            name === 'All'
                                ? 'bg-black text-white border border-black shadow hover:bg-black/90 hover:scale-105 hover:shadow-md'
                                : 'border border-gray-300 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent hover:scale-105 hover:shadow-md'
                        }
                        `}
                    >
                        {name}
                    </a>
                ))}
            </div>

            {/* Server Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-gray-300 bg-card text-card-foreground shadow flex flex-col hover:border-accent hover:shadow-md hover:scale-105 transition-all"
                    >
                        {/* Server Title and Description */}
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="font-semibold leading-none tracking-tight">
                                {server.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {server.description}
                            </div>
                        </div>
                        {/* View Details Button */}
                        <div className="flex items-center p-6 pt-0 mt-auto">
                            <a
                                href={server.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-gray-300 bg-background shadow-sm hover:bg-black hover:text-white hover:shadow-md hover:scale-105 w-full h-9 px-4 py-2"
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
                <h2 className="text-3xl font-bold text-center mb-8">Model Context Protocol FAQ</h2>
                <div className="w-full space-y-2">
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b border-gray-200">
                            <details className="group">
                                <summary
                                    className="flex items-center justify-between py-4 cursor-pointer transition-all hover:underline text-left font-semibold text-lg"
                                >
                                    <h3>{item.question}</h3>
                                    <svg
                                        className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </summary>
                                <div className="accordion-content overflow-hidden text-sm">
                                    <p className="pb-4 pt-2 text-base text-gray-700">{item.answer}</p>
                                </div>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
                    {/* Modal Container */}
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl relative border border-gray-300">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-xl font-bold mb-4">Добавить агента</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Agent Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Название агента</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Agent Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Описание агента</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>

                            {/* Agent Link */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Ссылка на агента</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Agent Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Категория агента</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}