import React from 'react'
import AgentTable from './components/table'

type Props = {}

const Agents = async (props: Props) => {

    const data = await getAllAgents()

    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-4 py-20 sm:p-20 md:p-24 w-full">
            <div className='w-full '>
                <AgentTable agentsData={data.agents} />
            </div>
        </main>
    )
}

export default Agents

async function getAllAgents() {

    // Fetch the agents
    const res = await fetch(
        `${process.env.NEXT_BASE_URL}/api/support-agents`,
        {
            method: "GET",
            next: {
                revalidate: 0
            }
        }
    );

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const agentsResponse = await res.json();

    return agentsResponse
}
