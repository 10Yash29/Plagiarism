import React, { useState } from 'react';

const Sidebar = ({ onQuestionClick }: { onQuestionClick: (id: number) => void }) => {
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

    const questions = [
        { id: 1, title: 'Two Sum' },
        { id: 2, title: 'Reverse String' },
        { id: 3, title: 'Fibonacci Sequence' },
    ];

    const handleQuestionClick = (id: number) => {
        setActiveQuestionId(id);
        onQuestionClick(id);
    };

    return (
        <div className="height-100% overflow-y-auto overflow-x-hidden bg-gray-800 text-white p-6 h-full">
            <h2 className="text-2xl font-bold mb-6">Questions</h2>
            <ul className="space-y-3">
                {questions.map((question) => (
                    <li
                        key={question.id}
                        onClick={() => handleQuestionClick(question.id)}
                        className={`p-3 rounded-md cursor-pointer transition duration-300 ${
                            question.id === activeQuestionId
                                ? 'bg-blue-500'
                                : 'hover:bg-gray-700'
                        }`}
                    >
                        {question.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
