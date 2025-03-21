"use client";
import React, {useCallback, useEffect, useState} from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import {MCPServer} from "@/app/types";
import Image from 'next/image';

interface FAQItem {
    question: string;
    answer: string;
}

interface Category {
    name: string;
}

interface CookieOptions {
    expires?: Date | number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

interface CookieOptions {
    expires?: Date | number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

export function useCookie(name: string): [string | null, (value: string, options?: CookieOptions) => void, () => void] {
    const [value, setValue] = useState<string | null>(null);

    const updateCookieState = useCallback(() => {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`));
        setValue(cookie ? decodeURIComponent(cookie.split('=')[1]) : null);
    }, [name]);

    useEffect(() => {
        updateCookieState();
    }, [name, updateCookieState]);

    const setCookie = (newValue: string, options: CookieOptions = {}) => {
        document.cookie = `${name}=${encodeURIComponent(newValue)}`;
        updateCookieState(); // Force immediate state update
    };

    const deleteCookie = (options: Pick<CookieOptions, 'path' | 'domain'> = {}) => {
        document.cookie = [
            `${name}=`,
            `expires=${new Date(0).toUTCString()}`,
            options.path && `path=${options.path}`,
            options.domain && `domain=${options.domain}`
        ].filter(Boolean).join('; ');

        updateCookieState(); // Force state to null
    };

    return [value, setCookie, deleteCookie];
}

export default function Page() {

    const [servers, setServers] = useState<MCPServer[]>([]);
    const [cookie, setCookie, deleteCookie] = useCookie("login")
    const [error, setError] = useState('');
    console.log(cookie);

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
        console.log("Updated servers: ", updatedServers);
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
            question: "Почему важен Model Context Protocol (MCP)?",
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
    const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
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
    const openAddAgent = () => setIsAddAgentOpen(true);
    const closeModal = () => setIsAddAgentOpen(false);

    // Open and close modal
    const openLogin = () => setLoginOpen(true);
    const closeLogin = () => setLoginOpen(false);

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
            link: formData.link,
            uid: cookie === null ? "null" : cookie,
            active: true,
            created: new Date().toISOString(),
            deleted: "null"
        };

        console.log("Add new server: ", newServer);

        handleAddServer(newServer);
        formData.name = ""
        formData.description = ""
        formData.category = ""
        formData.link = ""
        closeModal();
    };

    const encodeBase64ToUUID = (data: string): string => {
        // 1. Base64-encode the data (remove padding "=")
        const base64 = Buffer.from(data).toString("base64").replace(/=+$/, "");

        // 2. Convert Base64 string to hexadecimal
        const hex = Buffer.from(base64, "utf-8").toString("hex");

        // 3. Pad to 32 characters (UUID length) with zeros
        const paddedHex = hex.padEnd(32, "0");

        // 4. Format as UUID: 8-4-4-4-12
        return [
            paddedHex.slice(0, 8),
            paddedHex.slice(8, 12),
            paddedHex.slice(12, 16),
            paddedHex.slice(16, 20),
            paddedHex.slice(20, 32),
        ].join("-");
    };

    const decodeUUIDToBase64 = (uuid: string): string => {
        // 1. Remove hyphens and trim padding zeros
        const hex = uuid.replace(/-/g, "").replace(/0+$/, "");

        // 2. Convert hex back to the Base64 string
        const base64 = Buffer.from(hex, "hex").toString("utf-8");

        // 3. Add Base64 padding ("=") if needed
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

        // 4. Decode the Base64 string
        return Buffer.from(paddedBase64, "base64").toString("utf-8");
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const hexString = decodeUUIDToBase64(formData.link);
            const decoded = Buffer.from(hexString, "base64").toString("utf-8");

            if (!decoded.includes("gigacode")) {
                setError(encodeBase64ToUUID("Wrong password"));
                return;
            }
        } catch (error) {
            setError("Wrong password");
            return;
        }


        setCookie(formData.name);
        formData.name = ""
        formData.link = ""
        closeLogin();
    };


    const handleTrashClick = (serverId) => {
        console.log(`Deleting server with ID: ${serverId}`);
        handleDeleteServer(serverId);
    };

    const filteredServers: MCPServer[] = Array.isArray(servers)
        ? servers.filter(server =>
            (selectedCategory === "All" || server.category === selectedCategory) && server.active
        )
        : [];

    const InfoModal = ({closeInfo}) => {
        return (
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
                    <h1 className="text-5xl font-bold mb-24 text-gray-800">
                        Реализация агентов в инфраструктуре GigaCode
                    </h1>

                    {/* 1. Общий вид */}
                    <section className="mb-10">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Общий вид системы</h2>

                        <p className="text-gray-600 mb-4">
                            Архитектура агентной системы состоит из трех основных компонентов:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li><strong>MCP Host</strong>: программа, предоставляющая пользователю возможности
                                коммуникации с агентами
                            </li>
                            <li><strong>MCP Client</strong>: программа, работающая по протоколу MCP и, как правило,
                                интегрирующаяся в MCP Host. Позволяет делать запросы в MCP сервера по зарегистрированным
                                конфигурациям
                            </li>
                            <li><strong>MCP Server</strong>: легковесные программы, предоставляющие специфические
                                возможности через стандартизированный Model Context Protocol
                            </li>
                            <li><strong>Local Data Source</strong>: файлы, базы данных и сервисы вашего компьютера, к
                                которым MCP-серверы могут безопасно подключаться
                            </li>
                            <li><strong>Remote Service</strong>: внешняя система, доступная через интернет (например,
                                через API), с которой могут взаимодействовать MCP-серверы.
                            </li>
                            <li><strong>LLM</strong>: большая языковая модель, реализующая reasoning</li>
                        </ul>
                        <p className="text-gray-600 mb-4">
                            Ниже разберем популярные примеры реализаций MCP Client (по большей части MCP Host-ов со
                            встроенными MCP Client-ами) и MCP Server
                        </p>

                        <Image
                            src="/mcp-protocol.png"
                            alt="Архитектура системы"
                            width={1200}
                            height={800}
                            style={{width: '100%', height: 'auto'}}
                            className="w-full h-auto rounded-xl shadow-md border border-gray-200 mb-16"
                        />

                        <div className="space-y-6">
                            {/* Локальный MCP клиент */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">MCP Client</h3>
                                <p className="text-gray-600 mb-2">
                                    Локальный клиент (например, Claude Desktop или Zed) обеспечивает:
                                </p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                                    <a href="https://github.com/punkpeye/awesome-mcp-clients" target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:text-blue-800 font-bold">
                                        Примеры популярных MCP клиентов в репозитории awesome-mcp-clients
                                    </a>
                                </pre>
                            </div>

                            {/* Сервер пакетов */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">MCP Server</h3>
                                <p className="text-gray-600 mb-2">
                                    Непосредственно сама функциональность, которую вам будет необходимо имплементировать
                                </p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                                    <a href="https://github.com/wong2/awesome-mcp-servers" target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:text-blue-800 font-bold">
                                        Примеры популярных MCP серверов в репозитории awesome-mcp-servers
                                    </a>
                                </pre>
                            </div>

                            {/* Агенты */}
                            <div>
                                <h3 className="text-xl font-semibold mt-16 mb-2 text-gray-700">Взаимодействие
                                    компонентов</h3>
                                <Image
                                    src="/mcp-communication.png"
                                    alt="Архитектура системы"
                                    width={1200}
                                    height={800}
                                    style={{width: '100%', height: 'auto'}}
                                    className="w-full h-auto rounded-xl shadow-md border border-gray-200 mb-16"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 3. Создание агентов */}
                    <section className="mb-10">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Создание агентов</h2>
                        <div className="space-y-6">
                            {/* Шаг 1: Инициализация агента */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">Используемые
                                    библиотеки </h3>
                                <p className="text-gray-600 mb-2">Примеры популярных библиотек для реализации
                                    агентов</p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                                    <ul className="list-disc pl-6 text-gray-600">
                            <li>
                                <a href="https://github.com/mcp/mcp-sdk" target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 hover:text-blue-800">
                                    MCP SDK
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/mcp/mcp-sdk" target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 hover:text-blue-800">
                                    SmolAgents
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/mcp/mcp-sdk" target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 hover:text-blue-800">
                                    CrewAI
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/mcp/mcp-sdk" target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 hover:text-blue-800">
                                    LangChain
                                </a>
                            </li>
                        </ul>
                                </pre>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">Разработка агента</h3>
                                <p className="text-gray-600 mb-2">Пример реализации агента при помощи MCP SDK на языке
                                    Python</p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`from mcp_sdk import BaseAgent, rpc_method

class TranslationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="translator-v1",
            description="Multilingual translation service"
        )

    @rpc_method
    async def translate(self, text: str, target_lang: str) -> dict:
        # Реализация логики перевода
        return {
            "original": text,
            "translated": translated_text,
            "language": target_lang
        }

if __name__ == "__main__":
    agent = TranslationAgent()
    agent.start()`}
        </code>
      </pre>
                            </div>

                            {/* Шаг 3: Регистрация инструментов */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">Структура репозитория</h3>
                                <p className="text-gray-600 mb-2">Подключение необходимых инструментов для работы
                                    агента:</p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`/awesome-agent
  ├── agent.py
  ├── requirements.txt
  ├── mcp-config.json
  └── README.md`}
        </code>
      </pre>
                            </div>

                            {/* Шаг 4: Реализация логики */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">Пример
                                    mcp-config.json</h3>
                                <p className="text-gray-600 mb-2">Конфигурация запуска MCP-агента</p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`{
  "runtime": "python3.10",
  "entry_point": "agent:TranslationAgent",
  "dependencies": ["transformers", "torch"],
  "hardware": {
    "min_gpu_memory": 4
  }
}`}
        </code>
      </pre>
                            </div>

                            {/* Шаг 5: Сборка и экспорт */}
                            <div>
                                <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700">Запуск через pipx</h3>
                                <p className="text-gray-600 mb-2">Пример для запуска агента, размещенного на GitVerse
                                    через командную строку</p>
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`pipx run git+https://gitverse.ru/your-username/translation-agent`}
        </code>
      </pre>
                            </div>

                            {/* Шаг 6: Тестирование */}
                            <div>
                                <h3 className="text-xl font-semibold mb-2 mt-16 text-gray-700">Добавление в MCP Hub</h3>
                                <p className="text-gray-600 mb-2">Для добавления агента залогиньтесь, нажмите на кнопку
                                    "Добавить агента" на главном экране</p>

                                <Image
                                    src="/website.png"
                                    alt="Архитектура системы"
                                    width={1200}
                                    height={800}
                                    style={{width: '100%', height: 'auto'}}
                                    className="w-full h-auto rounded-xl shadow-md border border-gray-200 mb-8"
                                />
                                <p className="text-gray-600 mb-2">Затем введите его название, описание возможностей,
                                    выберите
                                    категорию и добавьте ссылку на репозиторий (для банковского контура – Bitbucket, для
                                    внешнего – GitVerse)</p>
                                <Image
                                    src="/add-agent.png"
                                    alt="Архитектура системы"
                                    width={1200}
                                    height={800}
                                    style={{width: '100%', height: 'auto'}}
                                    className="w-full h-auto rounded-xl shadow-md border border-gray-200 mb-16"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Использование сторонних агентов</h2>
                        <p className="text-gray-600 mb-2">Для подключения сторонних агентов MCP из Git-репозиториев
                            используйте менеджеры пакетов</p>

                        <p className="text-gray-600 mb-2 font-bold mt-8">Установка и запуск через pip
                            (Python-агенты):</p>
                        <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`pip install "git+https://github.com/username/repo.git@branch#subdirectory=agent_dir"  
mcp run agent_module:AgentClass  
`} </code>
        </pre>
                            <p className="text-gray-600">
                                Замените agent_dir и agent_module:AgentClass на путь к агенту в репозитории и имя
                                класса.
                            </p>
                        </div>

                        <p className="text-gray-600 mb-2 font-bold mt-8">Через npx (JS/TS-агенты):</p>
                        <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`npx github:username/repo@branch  
`} </code>
        </pre>
                            <p className="text-gray-600">
                                Для установки: npm install -g github:username/repo, затем запускайте через mcp.
                            </p>
                        </div>


                        <p className="text-gray-600 mb-2 font-bold mt-8">Через uv (альтернатива pip):</p>
                        <div className="space-y-4">
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`npx github:username/repo@branch  
`} </code>
        </pre>
                            <p className="text-gray-600 mt-8 font-bold">Общее:</p>
                            <p className="text-gray-600">1. Убедитесь, что зависимости агента установлены.</p>
                            <p className="text-gray-600">
                                2. Для сложных агентов следуйте инструкциям из их README.md (например, сборка через
                                make).
                            </p>
                        </div>
                        <p className="text-gray-600">
                            Пример для кастомного репозитория:
                        </p>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="language-javascript">
          {`git clone https://github.com/username/mcp-agent.git  
cd mcp-agent && pip install -e .  
mcp run agent:CustomAgent`} </code>
        </pre>


                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-8 mt-8">
                            <a href="https://huggingface.co/docs/smolagents/tutorials/tools" target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 font-bold">
                                Примеры реализации агентов при помощи фреймворка SmolAgents
                            </a>
                        </pre>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-8 mt-8">
                            <a href="https://github.com/langchain-ai/langchain-mcp-adapters" target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 font-bold">
                                Примеры реализации агентов при помощи фреймворка LangChain (репозиторий MCP адаптера)
                            </a>
                        </pre>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-8">
                            <a href="https://docs.crewai.com/concepts/agents" target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 font-bold">
                                Документация по реализации агентов при помощи фреймворка CrewAI
                            </a>
                        </pre>
                    </section>
                </div>
            </div>
        );
    };

// Usage example:
// <InfoModal closeInfo={handleCloseInfo} />

    useEffect(() => {
        Prism.highlightAll();
    }, [isInfoOpen]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/*<div style={{border: '1px solid red'}}>*/}
            {/*    {JSON.stringify({*/}
            {/*        cookieExists: cookie !== null,*/}
            {/*        cookieValue: cookie,*/}
            {/*        renderTime: new Date().toISOString()*/}
            {/*    })}*/}
            {/*</div>*/}
            {(cookie === null) && (<div className="flex justify-end">
                <button
                    onClick={openLogin}
                    className="text-black inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                >
                    Log In
                </button>
            </div>)}
            {(cookie !== null) && (<div className="flex justify-end">
                <button
                    onClick={deleteCookie}
                    className="text-black inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                >
                    Log Out
                </button>
            </div>)}
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
                    {cookie !== null && (<div className="flex justify-center">
                        <button
                            onClick={openAddAgent}
                            className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black border border-gray-300 shadow-sm hover:bg-black hover:text-white hover:shadow-md hover:scale-105 h-12 px-6 py-3 cursor-pointer"
                        >
                            Добавить агента
                        </button>
                    </div>)}
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
                        {(cookie !== null) && (
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
                        )}

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
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-black text-white px-3 py-1 text-xs font-bold">
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
            {isAddAgentOpen && (
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

            {isLoginOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
                    {/* Modal Container */}
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl relative border border-gray-300">
                        {/* Close Button */}
                        <button
                            onClick={closeLogin}
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
                        <h2 className="text-xl font-bold mb-4">Log In</h2>

                        {/* Form */}
                        <form onSubmit={handleLogin}>
                            {/* Agent Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Login</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Agent Link */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mb-4 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeLogin}
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
                <InfoModal closeInfo={closeInfo}/>
            )}
        </div>
    );
}