import Image from 'next/image'
import TicketTable from './components/table';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Home = async ({ searchParams }: Props) => {

  const { tickets, agents } = await getAllTickets(searchParams);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 py-20 sm:p-20 md:p-24 w-full">
      <div className='w-full '>
        <TicketTable ticketsData={tickets.tickets} page={tickets.currentPage} count={tickets.count} agents={agents.agents} />
      </div>
    </main>
  )
}

export default Home

async function getAllTickets(searchParams: {
  [key: string]: string | string[] | undefined;
}) {

  // Fetch all the parameters from searchParams
  const limit = 10
  const page = searchParams.page ? searchParams.page : 1;
  const sortBy = searchParams.sortBy ? searchParams.sortBy : null;
  const sortOrder = searchParams.sortOrder ? searchParams.sortOrder : null;
  const status = searchParams.status ? searchParams.status : null;
  const type = searchParams.type ? searchParams.type : null;
  const severity = searchParams.severity ? searchParams.severity : null;
  const assignedTo = searchParams.assignedTo ? searchParams.assignedTo : null;

  // Create query string
  let queryString = ""
  if (page) {
    queryString += `page=${page}`
  }
  if (limit) {
    queryString += `&limit=${limit}`
  }
  if (sortBy) {
    queryString += `&sortBy=${sortBy}`
  }
  if (sortOrder) {
    queryString += `&sortOrder=${sortOrder}`
  }
  if (status) {
    queryString += `&status=${status}`
  }
  if (type) {
    queryString += `&type=${type}`
  }
  if (severity) {
    queryString += `&severity=${severity}`
  }
  if (assignedTo) {
    queryString += `&assignedTo=${assignedTo}`
  }

  // Fetch data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/support-tickets?${queryString}`,
    {
      method: "GET",
      next: {
        revalidate: 0
      }
    }
  );

  const agents = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/support-agents?active=true`,
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

  if (!agents.ok) {
    throw new Error("Failed to fetch data");
  }

  const response = await res.json();
  const agentsResponse = await agents.json();

  return {
    tickets: response,
    agents: agentsResponse
  }
}
