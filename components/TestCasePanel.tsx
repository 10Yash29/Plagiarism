import React from 'react';

interface TestCasePanelProps {
    testResults: { name: string; result: string }[];
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({ testResults }) => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
            <ul>
                {testResults.map((test, index) => (
                    <li key={index} className={`mb-2 ${test.result === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                        <strong>{test.name}:</strong> {test.result}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestCasePanel;
