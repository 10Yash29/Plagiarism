// Define the Problem interface
interface Problem {
    id: string;
    title: string;
    description: string;
}

// DescriptionPanel component
const DescriptionPanel = ({ problem }: { problem: Problem}) => {
    return (
        <div className="p-4 border-b border-gray-300 bg-white">
                <>
                    <h2 className="text-2xl text-black ">{problem.title}</h2>
                    <p className="mt-4">{problem.description}</p>
                </>
        </div>
    );
};

export default DescriptionPanel;
