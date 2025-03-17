"use client";
import React, {useEffect, useState} from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import {MCPServer} from "@/app/types";

interface FAQItem {
    question: string;
    answer: string;
}

interface Category {
    name: string;
}

export default function Page() {

    const [servers, setServers] = useState<MCPServer[]>([]);

    useEffect(() => {
        fetch('/api/servers')
            .then((res) => res.json())
            .then((data) => setServers(data));
    }, []);

    // Add a server
    const handleAddServer = async (newServer: MCPServer) => {
        await fetch('/api/servers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newServer),
        });
        // Refetch data to update the list
        const updatedServers = await (await fetch('/api/servers')).json();
        setServers(updatedServers);
    };

    // Delete a server
    const handleDeleteServer = async (id: number) => {
        await fetch('/api/servers', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id}),
        });
        // Refetch data to update the list
        const updatedServers = await (await fetch('/api/servers')).json();
        setServers(updatedServers);
    };

    const faqItems: FAQItem[] = [
        {
            question: "Что такое Model Context Protocol (MCP)?",
            answer: "Model Context Protocol (MCP) — это открытый протокол, разработанный для обеспечения бесшовной интеграции между приложениями больших языковых моделей (LLM) и внешними источниками данных и инструментами. Он служит стандартизированным способом подключения LLM к необходимому контексту."
        },
        {
            question: "Какую проблему решает MCP?",
            answer: "MCP решает проблему фрагментированных интеграций между системами ИИ и источниками данных. Он устраняет вызов изоляции моделей ИИ от данных и их закрытия в информационных силосах, заменяя множество индивидуальных реализаций одним универсальным протоколом."
        },
        {
            question: "Кто разработал Model Context Protocol?",
            answer: "Model Context Protocol (MCP) был разработан компанией Anthropic."
        },
        {
            question: "Какие существуют варианты использования MCP?",
            answer: "MCP может использоваться в различных сценариях, включая: создание IDE с поддержкой ИИ, улучшение чат-интерфейсов, создание пользовательских рабочих процессов ИИ, подключение систем ИИ к внешним источникам данных."
        },
        {
            question: "Почему MCP важен для разработки ИИ?",
            answer: "Model Context Protocol (MCP) — это открытый протокол, предназначенный для обеспечения бесшовной интеграции между приложениями LLM и внешними источниками данных и инструментами. Он служит стандартизированным способом подключения LLM к необходимому контексту."
        },
        {
            question: "Что такое Model Context Protocol (MCP)?",
            answer: "MCP важен, потому что он предоставляет универсальный открытый стандарт, который упрощает и делает более надежным предоставление системам ИИ доступа к необходимым данным, обеспечивая лучшее масштабирование связанных систем."
        },
        {
            question: "Какое главное преимущество использования MCP перед традиционными методами интеграции?",
            answer: "Главное преимущество заключается в том, что MCP устраняет необходимость в индивидуальных реализациях для каждого нового источника данных, предоставляя единый стандартизированный протокол, что облегчает масштабирование и обслуживание систем ИИ, которым требуется доступ к нескольким источникам данных."
        }
    ];

    const categories: Category[] = [
        {name: "All"},
        {name: "Search"},
        {name: "Web Scraping"},
        {name: "Communication"},
        {name: "Productivity"},
        {name: "Database"},
        {name: "Cloud Service"},
        {name: "File System"},
        {name: "Cloud Storage"},
        {name: "Version Control"},
        {name: "Other"}
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    // Modal state and form data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link: '',
        category: ''
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        console.log("Handle input change: ", value);
        setFormData({...formData, [name]: value});
    };

    // Open and close modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Open and close info
    const openInfo = () => setIsInfoOpen(true);
    const closeInfo = () => setIsInfoOpen(false);

    // In your handleSubmit function
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newServer: MCPServer = {
            id: Math.random(),
            title: formData.name,
            description: formData.description,
            category: formData.category,
            link: formData.link // Match the MCPServer interface
        };

        handleAddServer(newServer).then(r => {
        });
        closeModal();
    };

    const handleTrashClick = (serverId) => {
        console.log(`Deleting server with ID: ${serverId}`);
        handleDeleteServer(serverId);
        // Add logic to remove the server from your data source
    };

    const filteredServers: MCPServer[] = Array.isArray(servers)
        ? servers.filter(server =>
            selectedCategory === "All" || server.category === selectedCategory
        )
        : [];

    useEffect(() => {
        Prism.highlightAll();
    }, [isInfoOpen]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mt-20 mb-20">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
                    GigaCode MCP Server Hack
                </h1>
                <p className="text-center text-base sm:text-lg mb-5 text-balance">
                    Список репозиторев, участвующих в хакатоне по разработке агентов производственного процесса от
                    GigaCode.
                </p>
                <div className="mb-8 flex flex-wrap gap-2 justify-center">
                    <div className="flex justify-center">
                        <button
                            onClick={openModal}
                            className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black border border-gray-300 shadow-sm hover:bg-black hover:text-white hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                        >
                            Добавить агента
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={openInfo}
                            className="text-black inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                        >
                            Инструкция
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {categories.map(({name}) => (
                    <button
                        key={name}
                        onClick={() => setSelectedCategory(name)}
                        className={`
                        inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
                        transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                        disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2
                        ${
                            selectedCategory === name
                                ? 'cursor-pointer bg-black text-white border border-black shadow hover:bg-black/90 hover:scale-105 hover:shadow-md'
                                : 'cursor-pointer border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 hover:scale-105 hover:shadow-md'
                        }
                    `}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Server Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServers.map((server, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-gray-300 bg-card text-card-foreground shadow flex flex-col hover:border-accent hover:shadow-md hover:scale-105 transition-all relative"
                    >
                        {/* Trash Button */}
                        <button
                            className="absolute top-3 right-3 p-1 bg-white text-black rounded-full hover:bg-white transition-all cursor-pointer"
                            onClick={() => handleTrashClick(server.id)} // Replace with your trash handler function
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
                                className="h-5 w-5"
                            >
                                <path d="M3 6h18"></path>
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>

                        {/* Server Title and Description */}
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="font-semibold leading-none tracking-tight">
                                {server.title}
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                {server.description}
                            </div>
                            {/* Category Chip */}
                            <div className="mt-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-black text-white px-3 py-1 text-xs font-bold">
                                    {server.category}
                                </span>
                            </div>
                        </div>

                        {/* View Details Button */}
                        <div className="flex items-center p-6 pt-0 mt-auto">
                            <a
                                href={server.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-all border border-gray-300 bg-background shadow-sm hover:bg-black hover:text-white hover:shadow-md hover:scale-105 w-full h-9 px-4 py-2"
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
                    <span className="text-gray-500">Хакатон агентов для интеграции в </span>
                    <a href="https://gigacode.ru" target="_blank" className="underline">
                        GigaCode
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

            {/* Info */}
            {isInfoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <button
                        onClick={closeInfo}
                        className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
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

                    <div className="max-w-4xl w-full p-8 overflow-y-auto max-h-[90vh]">
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">
                            Реализация агентов в инфраструктуре GigaCode
                        </h1>

                        {/* 1. Общий вид */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Общий вид системы</h2>
                            <p className="text-gray-600 mb-4">
                                Архитектура системы состоит из трех основных компонентов:
                            </p>

                            <div className="space-y-6">
                                {/* Локальный MCP клиент */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Локальный MCP клиент</h3>
                                    <p className="text-gray-600 mb-2">
                                        Локальный клиент (например, Claude Desktop или Zed) обеспечивает:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                                        <li>Управление агентами</li>
                                        <li>Локальное выполнение задач</li>
                                        <li>Интеграцию с IDE</li>
                                        <li>Отладку и мониторинг</li>
                                    </ul>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
        {`#  Пример конфигурации клиента
mcp-client {
  version: "2.3.1"
  storage: "/Users/username/.mcp"
  cache: {
    size: "2GB"
    ttl: "24h"
  }
}`} </code>
      </pre>
                                </div>

                                {/* Сервер пакетов */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Сервер пакетов</h3>
                                    <p className="text-gray-600 mb-2">
                                        Централизованный репозиторий для хранения и распространения агентов:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                                        <li>Хостинг пакетов (аналогично pip/conda)</li>
                                        <li>Версионность агентов</li>
                                        <li>Система зависимостей</li>
                                        <li>Интеграция с Bitbucket/GitHub</li>
                                    </ul>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
        {`# Пример структуры пакета
/agents
  /my-agent
    /v1.0.0
      manifest.json
      agent.js
      dependencies.json
      README.md`} </code>
      </pre>
                                </div>

                                {/* Агенты */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Агенты</h3>
                                    <p className="text-gray-600 mb-2">
                                        Агенты распространяются в виде архивов и содержат:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-600 mb-4">
                                        <li>Исполняемый код</li>
                                        <li>Конфигурационные файлы</li>
                                        <li>Зависимости</li>
                                        <li>Документацию</li>
                                    </ul>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
        {`#  Пример manifest.json
{
  "name": "data-processor",
  "version": "1.0.2",
  "main": "agent.js",
  "dependencies": {
    "mcp-sdk": "^3.1.0",
    "langchain": "^0.0.84"
  },
  "config": {
    "memory": "512MB",
    "timeout": "30s"
  }
}`} </code>
      </pre>
                                </div>

                                {/* Взаимодействие компонентов */}
                                <div>
                                    <h3 className="text-xl font-medium mb-2 text-gray-700">Взаимодействие
                                        компонентов</h3>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
        {`[Локальный клиент] -> (Запрос) -> [Сервер пакетов]
[Сервер пакетов] -> (Пакет агента) -> [Локальный клиент]
[Локальный клиент] -> (Запуск) -> [Агент]
[Агент] -> (Результаты) -> [Локальный клиент]`} </code>
      </pre>
                                </div>
                            </div>
                        </section>

                        {/* 2. Стек для реализации */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Стек для реализации</h2>
                            <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`{
  "dependencies": {
    "mcp-sdk": "^3.1.5",
    "crewai": "^0.12.0",
    "smolagents": "^1.2.3",
    "@langchain/core": "^0.1.0"
  }
}`} </code>
        </pre>
                                <p className="text-gray-600">
                                    Основные версии компонентов:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600">
                                    <li>MCP SDK: 3.1.5</li>
                                    <li>CrewAI: 0.12.0</li>
                                    <li>LangChain: 0.1.0</li>
                                    <li>SmolAgents: 1.2.3</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Создание агентов */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Создание агентов</h2>
                            <div className="space-y-6">
                                {/* Шаг 1: Инициализация агента */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.1 Инициализация
                                        агента</h3>
                                    <p className="text-gray-600 mb-2">Создание базовой структуры агента с использованием
                                        MCP SDK:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`import { createAgent } from 'mcp-sdk';
import { LangChainAdapter } from 'crewai';

const agentConfig = {
  id: 'research-agent',
  version: '1.0.0',
  metadata: {
    author: 'Your Name',
    description: 'Agent for research tasks',
    repository: 'https://github.com/your-repo'
  }
};`}
        </code>
      </pre>
                                </div>

                                {/* Шаг 2: Конфигурация LLM */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.2 Настройка языковой
                                        модели</h3>
                                    <p className="text-gray-600 mb-2">Интеграция с LangChain и настройка параметров
                                        модели:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`const llmConfig = LangChainAdapter({
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4000,
  timeout: 30000,
  cache: true
});`}
        </code>
      </pre>
                                </div>

                                {/* Шаг 3: Регистрация инструментов */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.3 Добавление
                                        инструментов</h3>
                                    <p className="text-gray-600 mb-2">Подключение необходимых инструментов для работы
                                        агента:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`const tools = [
  {
    name: 'web-search',
    version: '1.2.0',
    config: {
      provider: 'google',
      apiKey: process.env.SEARCH_API_KEY
    }
  },
  {
    name: 'data-analysis',
    version: '2.1.0',
    config: {
      maxDatasetSize: '10MB'
    }
  }
];`}
        </code>
      </pre>
                                </div>

                                {/* Шаг 4: Реализация логики */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.4 Реализация основной
                                        логики</h3>
                                    <p className="text-gray-600 mb-2">Создание execute-функции для обработки задач:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`async function execute(task) {
  const context = await this.getContext();
  const prompt = \`Research task: $\{task\}
Context: $\{context}\`;
  const results = await this.llm.generate(prompt);
  return {
    status: 'success',
    data: this.formatResults(results),
    metadata: {
      processingTime: Date.now() - startTime,
      tokensUsed: results.usage.total_tokens
    }
  };
}`}
        </code>
      </pre>
                                </div>

                                {/* Шаг 5: Сборка и экспорт */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.5 Финальная сборка
                                        агента</h3>
                                    <p className="text-gray-600 mb-2">Экспорт готового агента для использования в
                                        системе:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`export const researchAgent = createAgent({
  ...agentConfig,
  config: {
    llm: llmConfig,
    tools
  },
  execute
});

MCP.registerAgent(researchAgent);`}
        </code>
      </pre>
                                </div>

                                {/* Шаг 6: Тестирование */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-700">3.6 Тестирование
                                        агента</h3>
                                    <p className="text-gray-600 mb-2">Пример тестового запуска агента:</p>
                                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`const testTask = 'Analyze market trends for Q2 2024';
const result = await researchAgent.execute(testTask);

console.log('Test results:', {
  status: result.status,
  data: result.data,
  metrics: result.metadata
});`}
        </code>
      </pre>
                                </div>
                            </div>
                        </section>

                        {/* 4. Загрузка в Bitbucket */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Загрузка в Bitbucket</h2>
                            <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`# Клонирование репозитория
git clone https://stash.sigma.sbrf.ru/your-agent.git
cd your-repo

# Создание новой ветки
git checkout -b feature/new-agent

# Добавление изменений
git add .
git commit -m "Добавлен новый агент"

# Отправка изменений
git push origin feature/new-agent`} </code>
        </pre>
                                <p className="text-gray-600">
                                    После создания pull request в Bitbucket, изменения будут проверены и включены в
                                    основную ветку.
                                </p>
                            </div>
                        </section>

                        {/* 5. Установка и локальный запуск */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Установка и локальный
                                запуск</h2>
                            <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Редактируйте .env файл

# Запуск локального сервера
npm run dev

# Сборка для production
npm run build
npm run start`} </code>
        </pre>
                                <p className="text-gray-600">
                                    Для локальной разработки рекомендуется использовать Node.js версии 18+.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}