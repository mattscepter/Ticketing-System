"use client"

import { DataTable } from '@/components/common/table/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowDown, ArrowDownUp, ArrowUp, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import CreateTicket from '../create-ticket-modal';

type ticketTypes = {
    _id: string,
    topic: string,
    description: string,
    status: string,
    type: string,
    severity: string,
    assignedTo: {
        _id: string,
        name: string,
    },
    dateCreated: string,
    resolvedOn: string
}

type Props = {
    ticketsData: ticketTypes[]
    page: number
    count: number
    agents: any[]
}

// Ticket table
// This is the table component that shows the tickets
// It takes in the tickets data and renders the table
// It also has a pagination component that is used to navigate between pages
// It also has a filter component that is used to filter the tickets based on type, status, severity, assigned to
// It also has a sort component that is used to sort the tickets based on date created and resolved on
// It also has a create ticket component that is used to create a new ticket

const TicketTable = ({ ticketsData, page, count, agents }: Props) => {

    const searchParams = useSearchParams()

    const router = useRouter();

    // Function to update status of ticket
    const updateStatus = async (ticketId: string, status: 'New' | 'Assigned' | 'Resolved') => {
        const res = await fetch(`http://13.232.83.2/api/support-tickets/${ticketId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })

        if (res.status === 200) {
            router.refresh();
        }
    }

    // Columns for the table
    const columns: ColumnDef<ticketTypes>[] = [
        {
            header: "Topic",
            accessorKey: "topic",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("topic") || <span className="text-neutral-300">N/A</span>}
                    </div>
                );
            }
        },
        {
            header: () => (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='flex items-center justify-between cursor-pointer'>
                            <span className="inline-flex items-center">
                                Type
                            </span>
                            <Filter className='h-4 w-4' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Type</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the status for filter.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Width</Label>
                                    {/* @ts-expect-error */}
                                    <Select defaultValue='All' value={typeof searchParams.get("type") === "string" ? searchParams.get("type") : "All"}
                                        onValueChange={async (value: 'Tech' | 'Sales' | 'Operations' | 'All') => {
                                            const params = new URLSearchParams(searchParams.toString())
                                            if (value !== "All") {
                                                params.set("type", value)
                                                router.push(`/?${params.toString()}`)
                                            } else {
                                                if (params.has("type")) {
                                                    params.delete("type")
                                                    router.push(`/?${params.toString()}`)
                                                }
                                            }
                                        }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All</SelectItem>
                                            <SelectItem value="Tech">Tech</SelectItem>
                                            <SelectItem value="Sales">Sales</SelectItem>
                                            <SelectItem value="Operations">Operations</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>


            ),
            accessorKey: "type",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("type") || <span className="text-neutral-300">N/A</span>}
                    </div>
                )
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
            header: () => (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='flex items-center justify-between cursor-pointer'>
                            <span className="inline-flex items-center">
                                Status
                            </span>
                            <Filter className='h-4 w-4' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Status</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the status for filter.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Status</Label>
                                    {/* @ts-expect-error */}
                                    <Select defaultValue='All' value={typeof searchParams.get("status") === "string" ? searchParams.get("status") : "All"}
                                        onValueChange={async (value: 'New' | 'Assigned' | 'Resolved' | 'All') => {
                                            const params = new URLSearchParams(searchParams.toString())
                                            if (value !== "All") {
                                                params.set("status", value)
                                                router.push(`/?${params.toString()}`)
                                            } else {
                                                if (params.has("status")) {
                                                    params.delete("status")
                                                    router.push(`/?${params.toString()}`)
                                                }
                                            }
                                        }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All</SelectItem>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Assigned">Assigned</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            ),
            accessorKey: "status",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        <Select value={row.getValue("status")} onValueChange={(value: 'New' | 'Assigned' | 'Resolved') => {
                            updateStatus(row.original._id, value)
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div >
                )
            }
        },
        {
            header: () => (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='flex items-center justify-between cursor-pointer'>
                            <span className="inline-flex items-center">
                                Severity
                            </span>
                            <Filter className='h-4 w-4' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Severity</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the severity for filter.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Severity</Label>
                                    {/* @ts-expect-error */}
                                    <Select defaultValue='All' value={typeof searchParams.get("severity") === "string" ? searchParams.get("severity") : "All"}
                                        onValueChange={async (value: 'Low' | 'Moderate' | 'High' | 'All') => {
                                            const params = new URLSearchParams(searchParams.toString())
                                            if (value !== "All") {
                                                params.set("severity", value)
                                                router.push(`/?${params.toString()}`)
                                            } else {
                                                params.delete("severity")
                                                router.push(`/?${params.toString()}`)
                                            }
                                        }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select severity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Moderate">Moderate</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            ),
            accessorKey: "severity",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("severity") || <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
        {
            header: () => (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='flex items-center justify-between cursor-pointer'>
                            <span className="inline-flex items-center">
                                Assigned To
                            </span>
                            <Filter className='h-4 w-4' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Assigned To</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the assigned for filter.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Assigned To</Label>
                                    {/* @ts-expect-error */}
                                    <Select defaultValue='All' value={typeof searchParams.get("assignedTo") === "string" ? searchParams.get("assignedTo") : "All"}
                                        onValueChange={async (value: string) => {
                                            const params = new URLSearchParams(searchParams.toString())
                                            if (value !== "All") {
                                                params.set("assignedTo", value)
                                                router.push(`/?${params.toString()}`)
                                            } else {
                                                params.delete("assignedTo")
                                                router.push(`/?${params.toString()}`)
                                            }
                                        }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select assigned agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All</SelectItem>
                                            {agents.map((agent) => (
                                                <SelectItem key={agent._id} value={agent._id}>{agent.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            ),
            accessorKey: "assignedTo",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {/* @ts-expect-error */}
                        {row.getValue("assignedTo") ? row.getValue("assignedTo").name : <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
        {
            header: ({ column }) => {
                return (
                    <>
                        <div className="w-32 flex md:hidden items-center justify-between cursor-pointer">
                            <span className="inline-flex items-center">
                                Date created
                            </span>
                        </div>
                        <div onClick={() => {
                            const params = new URLSearchParams(searchParams.toString())

                            if (searchParams.has("sortBy") && searchParams.get("sortBy") === "dateCreated") {
                                if (searchParams.get("sortOrder") === "-1") {
                                    params.set("sortBy", "dateCreated")
                                    params.set("sortOrder", "1")
                                } else if (searchParams.get("sortOrder") === "1") {
                                    params.delete("sortBy")
                                    params.delete("sortOrder")
                                }
                            } else {
                                params.set("sortBy", "dateCreated")
                                params.set("sortOrder", "-1")
                            }
                            router.push(
                                `/?${params
                                    .toString()}`,
                                {
                                    scroll: false
                                }
                            );

                        }} className="w-32 hidden md:flex items-center justify-between cursor-pointer">
                            <span className="inline-flex items-center">
                                Date created
                            </span>
                            {searchParams.has("sortBy") && searchParams.get("sortBy") === "dateCreated" && searchParams.get("sortOrder") === "-1" ? <ArrowDown className="h-4 w-4" /> : searchParams.has("sortBy") && searchParams.get("sortBy") === "dateCreated" && searchParams.get("sortOrder") === "1" ? <ArrowUp className="h-4 w-4 transform" /> : <ArrowDownUp className="h-4 w-4 transform" />}
                        </div>
                    </>
                );
            },
            accessorKey: "dateCreated",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("dateCreated") ? dayjs(row.getValue("dateCreated")).format("hh:mm A, D MMM YYYY") : <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
        {
            header: ({ column }) => {
                return (
                    <>
                        <div className="w-32 flex md:hidden items-center justify-between cursor-pointer">
                            <span className="inline-flex items-center">
                                Resolved On
                            </span>
                        </div>
                        <div onClick={() => {
                            const params = new URLSearchParams(searchParams.toString())

                            if (searchParams.has("sortBy") && searchParams.get("sortBy") === "resolvedOn") {
                                if (searchParams.get("sortOrder") === "-1") {
                                    params.set("sortBy", "resolvedOn")
                                    params.set("sortOrder", "1")
                                } else if (searchParams.get("sortOrder") === "1") {
                                    params.delete("sortBy")
                                    params.delete("sortOrder")
                                }
                            } else {
                                params.set("sortBy", "resolvedOn")
                                params.set("sortOrder", "-1")
                            }
                            router.push(
                                `/?${params
                                    .toString()}`,
                                {
                                    scroll: false
                                }
                            );

                        }} className="w-32 hidden md:flex items-center justify-between cursor-pointer">
                            <span className="inline-flex items-center">
                                Resolved On
                            </span>
                            {searchParams.has("sortBy") && searchParams.get("sortBy") === "resolvedOn" && searchParams.get("sortOrder") === "-1" ? <ArrowDown className="h-4 w-4" /> : searchParams.has("sortBy") && searchParams.get("sortBy") === "resolvedOn" && searchParams.get("sortOrder") === "1" ? <ArrowUp className="h-4 w-4 transform" /> : <ArrowDownUp className="h-4 w-4 transform" />}
                        </div>
                    </>
                );
            },
            accessorKey: "resolvedOn",
            cell: ({ row }) => {
                return (
                    <div className="w-32 sm:w-auto">
                        {row.getValue("resolvedOn") ? dayjs(row.getValue("resolvedOn")).format("hh:mm A, D MMM YYYY") : <span className="text-neutral-300">N/A</span>}
                    </div>
                )
            }
        },
    ];


    return (
        <div>
            <div className='flex items-center justify-between mb-2'>
                <h2>Showing {count} tickets</h2>
                <div className='flex items-center gap-2'>
                    <Button variant="destructive" onClick={() => router.push("/")}>Reset</Button>
                    <CreateTicket />
                </div>
            </div>
            <DataTable
                pagination
                columns={columns}
                data={ticketsData}
                page={page}
                count={count}
                onChange={(newPage) => {
                    if (searchParams.has("page"))
                        router.push(
                            `/?${searchParams
                                .toString()
                                .replace(/page=\d+/, `page=${newPage}`)}`
                        );
                    else
                        router.push(
                            `/?${searchParams.toString()}${searchParams.toString().length === 0 ? "" : "&"
                            }page=${newPage}`
                        );
                }}

                onClick={(row) => { }}
            />
        </div>
    )
}

export default TicketTable