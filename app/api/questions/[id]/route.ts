import { NextRequest, NextResponse } from 'next/server';

// Mock questions data
const questions = [
    { id: 1, title: 'Two Sum', description: 'Given an array of integers, return indices of two numbers such that they add up to a target.' },
    { id: 2, title: 'Reverse String', description: 'Write a function that reverses a string.' },
    { id: 3, title: 'Fibonacci Sequence', description: 'Return the n-th number of the Fibonacci sequence.' },
    // Add more questions here or fetch from a real API
];

// API handler for fetching a specific question based on ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const questionId = parseInt(params.id, 10);
    const question = questions.find((q) => q.id === questionId);

    if (!question) {
        return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
}
