'use client'

import { useChat } from 'ai/react';
import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm';

// Define the explicit type for the selectedLLMs object
type LLMsSelection = {
    gpt3: boolean;
    gpt4: boolean;
    mistral: boolean;
    llama: boolean;
};

export default function Chat() {

    const { messages: messages3, input: input3, handleInputChange: handleInputChange3, handleSubmit: handleSubmit3 } = useChat({
        api: '/api/gpt3',
        id: "1",
    });
    
    const { messages: messages4, input: input4, handleInputChange: handleInputChange4, handleSubmit: handleSubmit4 } = useChat({
        api: '/api/gpt4',
        id: "2",
    });

    const { messages: messages_m, input: input_m, handleInputChange: handleInputChange_m, handleSubmit: handleSubmit_m } = useChat({
        api: '/api/mistral',
    });

    const { messages: messages_l_2_70, input: input_l_2_70, handleInputChange: handleInputChange_l_2_70, handleSubmit: handleSubmit_l_2_70 } = useChat({
        api: '/api/llama-2-70',
    });

    const handleUnifiedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleInputChange3(event);
        handleInputChange4(event);
        handleInputChange_m(event);
        handleInputChange_l_2_70(event);
    }

    const handleMultiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const promises = [];
            
            if (selectedLLMs.gpt3) {
                promises.push(handleSubmit3(e));
            }
    
            if (selectedLLMs.gpt4) {
                promises.push(handleSubmit4(e));
            }
    
            if (selectedLLMs.mistral) {
                promises.push(handleSubmit_m(e));
            }
    
            if (selectedLLMs.llama) {
                promises.push(handleSubmit_l_2_70(e));
            }
    
            const responses = await Promise.all(promises);
    
            if (selectedLLMs.gpt3) {
                console.log('GPT-3.5 Response:', responses.shift());
            }
    
            if (selectedLLMs.gpt4) {
                console.log('GPT-4 Response:', responses.shift());
            }
    
            if (selectedLLMs.mistral) {
                console.log('Mistral Response:', responses.shift());
            }
    
            if (selectedLLMs.llama) {
                console.log('LLAMA-2-70 Response:', responses.shift());
            }
    
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }    

    // State for selected LLMs
    const [selectedLLMs, setSelectedLLMs] = useState<LLMsSelection>({
        gpt3: true,
        gpt4: true,
        mistral: true,
        llama: false
    });

    // Specify the type for the llm parameter
    const toggleLLM = (llm: keyof LLMsSelection) => {
        setSelectedLLMs(prevState => ({ ...prevState, [llm]: !prevState[llm] }));
    }

    const numSelectedLLMs = [selectedLLMs.gpt3, selectedLLMs.gpt4, selectedLLMs.mistral, selectedLLMs.llama].filter(Boolean).length;
    const columns = Array(numSelectedLLMs).fill('1fr').join(' ');
    const textwidth = 90/numSelectedLLMs;

    return (
        <div className='overflow-hidden'>
            <div className='flex'>
                <div className="container w-[50%] rounded-md border shadow p-4" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <label style={{ flex: '1 0 calc(25% - 10px)', minWidth: 'fit-content' }}>
                        <input type="checkbox" checked={selectedLLMs.gpt3} onChange={() => toggleLLM('gpt3')} /> GPT-3.5
                    </label>
                    <label style={{ flex: '1 0 calc(25% - 10px)', minWidth: 'fit-content' }}>
                        <input type="checkbox" checked={selectedLLMs.gpt4} onChange={() => toggleLLM('gpt4')} /> GPT-4
                    </label>
                    <label style={{ flex: '1 0 calc(25% - 10px)', minWidth: 'fit-content' }}>
                        <input type="checkbox" checked={selectedLLMs.mistral} onChange={() => toggleLLM('mistral')} /> Mistral 7B
                    </label>
                    <label style={{ flex: '1 0 calc(25% - 10px)', minWidth: 'fit-content' }}>
                        <input type="checkbox" checked={selectedLLMs.llama} onChange={() => toggleLLM('llama')} /> LLAMA-2-70B
                    </label>
                </div>
            </div>
            {/* Render based on selected LLMs */}
            <div className="grid-container" style={{ gridTemplateColumns: columns, marginBottom: '70px' }}>
                {selectedLLMs.gpt3 && (
                    <div style={{ width: `${textwidth}vw`, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>ChatGPT-3</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>OpenAI's model version 3.5</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages3.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./chatgpt.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                        <ReactMarkdown 
                                            remarkPlugins={[gfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-auto">
                                                        <table className="react-markdown-table" {...props} />
                                                    </div>
                                                ),
                                                pre: ({ node, ...props }) => (
                                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                        <pre {...props} />
                                                    </div>
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                )
                                            }}
                                            className="text-sm leading-7"
                                        >
                                            {m.content || ""}
                                        </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedLLMs.gpt4 && (
                    <div style={{ width: `${textwidth}vw`, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>ChatGPT-4</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>OpenAI's model version 4</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages4.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./chatgpt.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedLLMs.mistral && (
                    <div style={{ width: `${textwidth}vw`, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>Mistral 7B</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>Mistral's first LLM, 7B parameters</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages_m.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./mistral.jpeg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                )}
                {selectedLLMs.llama && (
                    <div style={{ width: `${textwidth}vw`, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>LLAMA-2-70B</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>Meta's LLAMA-v2 LLM, 70B parameters</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages_l_2_70.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./meta.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid-container-mobile" >
                {selectedLLMs.gpt3 && (
                    <div style={{ width: `300px`, flexShrink: 0, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>ChatGPT-3</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>OpenAI's model version 3.5</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages3.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./chatgpt.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                        <ReactMarkdown 
                                            remarkPlugins={[gfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-auto">
                                                        <table className="react-markdown-table" {...props} />
                                                    </div>
                                                ),
                                                pre: ({ node, ...props }) => (
                                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                        <pre {...props} />
                                                    </div>
                                                ),
                                                code: ({ node, ...props }) => (
                                                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                )
                                            }}
                                            className="text-sm leading-7"
                                        >
                                            {m.content || ""}
                                        </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedLLMs.gpt4 && (
                    <div style={{ width: `300px`, flexShrink: 0, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>ChatGPT-4</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>OpenAI's model version 4</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages4.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./chatgpt.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedLLMs.mistral && (
                    <div style={{ width: `300px`, flexShrink: 0, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>Mistral 7B</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>Mistral's first LLM, 7B parameters</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages_m.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./mistral.jpeg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                )}
                {selectedLLMs.llama && (
                    <div style={{ width: `300px`, flexShrink: 0, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: '0', fontWeight: 'bold' }}>LLAMA-2-70B</h3>
                            <p style={{ margin: '8px 0', color: '#777' }}>Meta's LLAMA-v2 LLM, 70B parameters</p>
                        </div>
                        <div style={{ padding: '10px 0' }}>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                {messages_l_2_70.map((m, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: m.role === 'user' ? '#f4f4f5' : '#fafafa',
                                            overflowWrap: 'break-word',
                                            margin: '8px 0',
                                            borderRadius: '5px',
                                            padding: '8px 12px' // Added horizontal padding
                                        }}
                                    >
                                        <Avatar>
                                            {m.role === 'user' 
                                                ? <AvatarImage src="user_avatar.png" />
                                                : <AvatarImage src="./meta.svg" />}
                                            <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                        </Avatar>
                                        <div style={{ marginLeft: '10px', overflowX: 'scroll', }}> {/* Some spacing between the avatar and message */}
                                            <ReactMarkdown 
                                                remarkPlugins={[gfm]}
                                                components={{
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-auto">
                                                            <table className="react-markdown-table" {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({ node, ...props }) => (
                                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                            <pre {...props} />
                                                        </div>
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                                    )
                                                }}
                                                className="text-sm leading-7"
                                            >
                                                {m.content || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                )}
            </div>
            <div className="rounded-md border bg-white shadow p-2 flex items-center w-[80%] max-w-[1000px] w-full fixed bottom-10 left-1/2 transform -translate-x-1/2 mt-5 mx-4">
                <form onSubmit={handleMultiSubmit} className="flex w-full">
                    <input
                        value={input4}
                        onChange={handleUnifiedInputChange}
                        placeholder="Your message"
                        className="p-2 outline-none border-none rounded-l-md flex-grow"
                        style={{ width: 'calc(100% - 50px)' }} // Reserve space for the button
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 p-2 rounded-r-md text-white"
                    >
                        <img src="./send_white.png" alt="Submit" />
                    </button>
                </form>
            </div>

        </div>
    )
}
