'use client';
import { useClerk } from "@clerk/nextjs";
import { useState } from 'react';
import CodeEditor from "@/components/CodeEditor";
import Sidebar from "@/components/Sidebar";
import TestCasePanel from "@/components/TestCasePanel";

interface TestResult {
    name: string;
    result: string;
}

interface Question {
    id: number;
    title: string;
    description: string;
}

export default function Home() {
    const { signOut } = useClerk();
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [showTestCases, setShowTestCases] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    const handleRunCode = (results: TestResult[]) => {
        setTestResults(results);
        setShowTestCases(true);
    };

    const fetchQuestion = async (id: number) => {
        const res = await fetch(`/api/questions/${id}`);
        if (res.ok) {
            const questionData = await res.json();
            setSelectedQuestion(questionData);
        } else {
            console.error('Error fetching question');
        }
    };

    return (
        <main className="h-screen flex bg-gray-100 p-4 space-x-4">
            {/* Sidebar */}
            <div className="w-1/4 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <Sidebar onQuestionClick={fetchQuestion} />
            </div>

            {/* Main content */}
            <div className="w-3/4 flex flex-col space-y-4">
                {/* Header section */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-600 flex-grow text-center">
                        CodingBit
                    </h1>
                    <button
                        onClick={() => signOut()}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Question description and code editor */}
                <div className="flex-grow flex flex-col border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    {/* Show selected question description */}
                    {selectedQuestion ? (
                        <div className="p-4 bg-white border-b border-gray-300">
                            <h2 className="text-2xl font-bold">{selectedQuestion.title}</h2>
                            <p className="mt-4">{selectedQuestion.description}</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-white border-b border-gray-300">
                            <p>Select a question to view its details.</p>
                        </div>
                    )}

                    {/* Code editor */}
                    <CodeEditor onRunCode={handleRunCode} />

                    {/* Test case panel */}
                    {showTestCases && (
                        <div className="border-t border-gray-300">
                            <TestCasePanel testResults={testResults} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
