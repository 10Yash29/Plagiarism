// app/api/runCode/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Judge0 API configuration
const JUDGE0_API_URL = 'https://api.judge0.com'; // Public API endpoint
const JUDGE0_API_TOKEN = ''; // Leave empty if not required for public endpoint

export async function POST(request: Request) {
    try {
        const { code, language } = await request.json();

        // Ensure the language is supported and mapped correctly
        const languageId = getLanguageId(language);
        if (!languageId) {
            throw new Error('Unsupported programming language');
        }

        const result = await executeCode({ code, languageId });

        return NextResponse.json({
            testCases: result.testCases || [],
            output: result.output || '',
        });
    } catch (error) {
        console.error('Error executing code:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Error executing code', details: error.message }, { status: 500 });
    }
}

// Function to execute code using Judge0 API
async function executeCode({ code, languageId }: { code: string; languageId: number }) {
    try {
        // Submit code for execution
        const submitResponse = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
            source_code: code,
            language_id: languageId, // Use the mapped language ID
        }, {
            headers: { 'Authorization': `Token ${JUDGE0_API_TOKEN}` } // Only needed if using a private instance
        });

        const submissionId = submitResponse.data.token; // Get the submission ID

        // Optionally, check the result with another request if needed
        const resultResponse = await axios.get(`${JUDGE0_API_URL}/submissions/${submissionId}`, {
            headers: { 'Authorization': `Token ${JUDGE0_API_TOKEN}` } // Only needed if using a private instance
        });

        const { stdout, stderr, status, compile_output } = resultResponse.data;

        return {
            testCases: [], // Add test cases if available
            output: stdout || stderr || compile_output || 'No output available',
        };
    } catch (error) {
        console.error('Error with Judge0 API:', error.response ? error.response.data : error.message);
        throw new Error('Error executing code with Judge0');
    }
}

// Map programming language to Judge0 language ID
function getLanguageId(language: string): number | null {
    const languageMap: { [key: string]: number } = {
        'python': 34, // Python
        'javascript': 63, // JavaScript
        'java': 62, // Java
        'c': 50, // C
        'cpp': 54, // C++
        'ruby': 72, // Ruby
        // Add mappings for other languages as needed
    };

    return languageMap[language.toLowerCase()] || null; // Return null if not found
}
