"use client"

import CreateTicket from '@/app/components/create-ticket-modal';
import { DataTable } from '@/components/common/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import CreateAgent from '../create-agent-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type agentTypes = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    description: string,
    active: string,
    dateCreated: string
}

type Props = {
    agentsData: agentTypes[]
}

// Agent table
// This shows a table of all the agents
// It takes in the agent parameters like name, email, phone, description, active and shows them in a table
// It also has a button to create a new agent
// It also has a button to create a new ticket

const AgentTable = ({ agentsData }: Props) => {

    const router = useRouter()

    // function to update active status of an agent
    const updateActiveStatus = async (ticketId: string, status: boolean) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/support-agents/${ticketId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activeStatus: status }),
        })

        if (res.status === 200) {
            router.refresh();
        }
    }

    // Columns for the table
    const columns: ColumnDef<agentTypes>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("name") || <span className="text-neutral-300">N/A</span>}
                    </div>
                );
            }
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("email") || <span className="text-neutral-300">N/A</span>}
                    </div>
                );
            }
        },
        {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("phone") || <span className="text-neutral-300">N/A</span>}
                    </div>
                );
            }
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("description") || <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
        {
            header: "Active",
            accessorKey: "active",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        <Select value={row.getValue("active") ? "Active" : "Inactive"} onValueChange={(value: 'Active' | 'Inactive') => {
                            updateActiveStatus(row.original._id, value === "Active" ? true : false)
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div >
                );
            }
        },
        {
            header: "Date Created",
            accessorKey: "dateCreated",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("dateCreated") ? dayjs(row.getValue("dateCreated")).format("hh:mm A, D MMM YYYY") : <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
    ];


    return (
        <div>
            <div className='flex items-center justify-between mb-2'>
                <h2>Showing {agentsData.length} agents</h2>
                <div className='flex items-center gap-2'>
                    <CreateTicket />
                    <CreateAgent />
                </div>
            </div>
            <DataTable
                pagination={false}
                columns={columns}
                data={agentsData}
                onClick={(row) => { }}
            />
        </div>
    )
}

export default AgentTable