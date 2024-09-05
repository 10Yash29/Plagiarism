'use client'
import React, { useState, useEffect } from 'react';
import { Editor, loader, OnChange } from '@monaco-editor/react';
import TestCasePanel from "@/components/TestCasePanel";

interface TestResult {
    name: string;
    result: string;
}

interface CodeEditorProps {
    onRunCode: (results: TestResult[]) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onRunCode }) => {
    const [code, setCode] = useState<string>('// Write your code here...');
    const [language, setLanguage] = useState<string>('javascript');
    const [theme, setTheme] = useState<string>('vs-dark');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [showTestCases, setShowTestCases] = useState(false);
    const [output, setOutput] = useState<string>('');

    useEffect(() => {
        loader.init().then((monaco) => {
            // Python Autocompletion Provider
            monaco.languages.registerCompletionItemProvider('python', {
                provideCompletionItems: (model, position) => {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    const suggestions = [
                        {
                            label: 'print',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'print(${1})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Prints output to the console',
                            range: range,
                        },
                        {
                            label: 'def',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Define a function',
                            range: range,
                        },
                    ];

                    return { suggestions: suggestions };
                },
            });

            // Java Autocompletion Provider
            monaco.languages.registerCompletionItemProvider('java', {
                provideCompletionItems: (model, position) => {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    const suggestions = [
                        {
                            label: 'System.out.println',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'System.out.println(${1:args});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Print to the console',
                            range: range,
                        },
                        {
                            label: 'class',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'class ${1:ClassName} {\n\tpublic static void main(String[] args) {\n\t\t${2:code}\n\t}\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Define a class',
                            range: range,
                        },
                    ];

                    return { suggestions: suggestions };
                },
            });
        });
    }, []);

    const handleEditorChange: OnChange = (value) => {
        setCode(value || '');
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/checkCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            const resultData = await response.json();
            console.log(resultData.message);
        } catch (error) {
            console.error('Error submitting code:', error);
        }
    };

    const handleRun = async () => {
        try {
            const response = await fetch('/api/runCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error running code:', errorText);
                alert(`Error running code: ${errorText}`);
                return;
            }

            const result = await response.json();
            setTestResults(result.testCases || []);
            setOutput(result.output || '');
            setShowTestCases(true);
            onRunCode(result.testCases || []);
        } catch (error) {
            console.error('Error running code:', error);
            alert('Error running code');
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="mb-4 flex items-center space-x-4">
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="border border-gray-300 rounded-md p-2 bg-blue-500 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <div className="flex-grow mb-4 overflow-auto">
                <Editor
                    height="400px" // Set a fixed height to make space for scrolling
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={handleEditorChange}
                    className="border border-gray-300 rounded-lg shadow-lg"
                />
            </div>
            <div className="mb-4 flex space-x-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSubmit}
                >
                    Submit Code
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={handleRun}
                >
                    Run Code
                </button>
            </div>
            {showTestCases && (
                <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <TestCasePanel testResults={testResults} />
                </div>
            )}
            {output && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Output</h2>
                    <pre>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;
