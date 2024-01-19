"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

// Create ticket modal
// This has a form to create a new ticket
// It takes in the ticket parameters like topic, description, type, status, severity and creates a new ticket

const CreateTicket = (props: Props) => {

    // state t store form values
    const [ticketParameters, setTicketParameters] = useState<{ topic: string, description: string, type: string, status: string, severity: string }>({
        topic: "",
        description: "",
        type: "Tech",
        status: "New",
        severity: "Low"
    })

    // state to store loading state
    const [loading, setLoading] = useState<boolean>(false)
    // state to store modal state
    const [showModal, setShowModal] = useState<boolean>(false)
    // state to store error state
    const [error, setError] = useState<{
        topic: string,
        description: string,
        type: string,
        status: string,
        severity: string
    }>({
        topic: "",
        description: "",
        type: "",
        status: "",
        severity: ""
    })

    const router = useRouter()

    return (
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
            <DialogTrigger>
                <Button variant="default" onClick={() => setShowModal(true)}>Create ticket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create ticket</DialogTitle>
                    <DialogDescription>
                        Create a new ticket.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Topic
                        </Label>
                        <Input placeholder='Enter topic' value={ticketParameters?.topic} className="col-span-3" onChange={(e) => {
                            setTicketParameters({ ...ticketParameters, topic: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, topic: "" })
                        }} />
                        {error.topic && (
                            <div className="text-red-500 text-sm">{error.topic}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Description
                        </Label>
                        <Input placeholder='Enter description' value={ticketParameters?.description} className="col-span-3" onChange={(e) => {
                            setTicketParameters({ ...ticketParameters, description: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, description: "" })
                        }} />
                        {error.description && (
                            <div className="text-red-500 text-sm">{error.description}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Type
                        </Label>
                        <Select value={ticketParameters?.type}
                            onValueChange={async (value: string) => {
                                setTicketParameters({ ...ticketParameters, type: value })
                                if (value.length > 0) setError({ ...error, type: "" })
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Tech">Tech</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                            </SelectContent>
                        </Select>
                        {error.type && (
                            <div className="text-red-500 text-sm">{error.type}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Status
                        </Label>
                        <Select value={ticketParameters?.status}
                            onValueChange={async (value: string) => {
                                setTicketParameters({ ...ticketParameters, status: value })
                                if (value.length > 0) setError({ ...error, status: "" })
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                        {error.status && (
                            <div className="text-red-500 text-sm">{error.status}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Severity
                        </Label>
                        <Select value={ticketParameters?.severity}
                            onValueChange={async (value: string) => {
                                setTicketParameters({ ...ticketParameters, severity: value })
                                if (value.length > 0) setError({ ...error, severity: "" })
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                        {error.severity && (
                            <div className="text-red-500 text-sm">{error.severity}</div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} type="submit" onClick={async () => {
                        if (!ticketParameters.topic || ticketParameters.topic.length < 1) {
                            setError({ ...error, topic: "Topic is required" })
                            return
                        }
                        if (!ticketParameters.description || ticketParameters.description.length < 1) {
                            setError({ ...error, description: "Description is required" })
                            return
                        } if (!ticketParameters.type || ticketParameters.type.length < 1) {
                            setError({ ...error, type: "Type is required" })
                            return
                        }
                        if (!ticketParameters.status || ticketParameters.status.length < 1) {
                            setError({ ...error, status: "Status is required" })
                            return
                        }
                        if (!ticketParameters.severity || ticketParameters.severity.length < 1) {
                            setError({ ...error, severity: "Severity is required" })
                            return
                        }
                        setLoading(true)
                        // Create ticket
                        await fetch("http://13.232.83.2/api/support-tickets", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(ticketParameters),
                        })
                        router.refresh()
                        setShowModal(false)
                        setLoading(false)
                        setTicketParameters({
                            topic: "",
                            description: "",
                            type: "Tech",
                            status: "New",
                            severity: "Low"
                        })
                    }}
                    >
                        Create ticket
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default CreateTicket