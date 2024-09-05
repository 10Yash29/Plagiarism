import { ESLint } from 'eslint';
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const { code, language } = await request.json();

        if (language === 'javascript' || language === 'typescript') {
            const eslint = new ESLint();
            const results = await eslint.lintText(code);
            const hasErrors = results.some(result => result.errorCount > 0);

            if (hasErrors) {
                return NextResponse.json({ error: 'Syntax errors found' }, { status: 400 });
            }
        }

        // Return a success message if no syntax errors are found
        return NextResponse.json({ message: 'Code checked successfully!' });
    } catch (error) {
        return NextResponse.json({ error: 'Error checking code' }, { status: 500 });
    }
}
