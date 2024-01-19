"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { validateEmail } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

// Create agent modal
// This has a form to create a new agent
// It takes in the agent parameters like name, email, phone, description, active and creates a new agent

const CreateAgent = (props: Props) => {

    // state to store form values
    const [agentParameters, setAgentParameters] = useState<{ name: string, description: string, email: string, phone: string, active: boolean }>({
        name: "",
        description: "",
        email: "Tech",
        phone: "New",
        active: true
    })

    // state to store loading state
    const [loading, setLoading] = useState<boolean>(false)
    // state to store modal state
    const [showModal, setShowModal] = useState<boolean>(false)
    // state to store error state
    const [error, setError] = useState<{
        name: string,
        description: string,
        email: string,
        phone: string,
    }>({
        name: "",
        description: "",
        email: "",
        phone: "",
    })

    const router = useRouter()

    return (
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
            <DialogTrigger>
                <Button variant="secondary" onClick={() => setShowModal(true)}>Create ticket</Button>
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
                        <Label htmlFor="name" className="text-right mb-1">
                            Name
                        </Label>
                        <Input placeholder='Enter name' value={agentParameters?.name} className="col-span-3" onChange={(e) => {
                            setAgentParameters({ ...agentParameters, name: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, name: "" })
                        }} />
                        {error.name && (
                            <div className="text-red-500 text-sm">{error.name}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right mb-1">
                            Email
                        </Label>
                        <Input placeholder='Enter email' value={agentParameters?.email} className="col-span-3" onChange={(e) => {
                            setAgentParameters({ ...agentParameters, email: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, email: "" })
                        }} />
                        {error.email && (
                            <div className="text-red-500 text-sm">{error.email}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right mb-1">
                            Phone
                        </Label>
                        <Input type='number' placeholder='Enter phone' value={agentParameters?.phone} className="col-span-3" onChange={(e) => {
                            setAgentParameters({ ...agentParameters, phone: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, phone: "" })
                        }} />
                        {error.phone && (
                            <div className="text-red-500 text-sm">{error.phone}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right mb-1">
                            Description
                        </Label>
                        <Input placeholder='Enter description' value={agentParameters?.description} className="col-span-3" onChange={(e) => {
                            setAgentParameters({ ...agentParameters, description: e.target.value })
                            if (e.target.value.length > 0) setError({ ...error, description: "" })
                        }} />
                        {error.description && (
                            <div className="text-red-500 text-sm">{error.description}</div>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="name" className="text-right">
                            Active
                        </Label>
                        <Select value={agentParameters?.active ? "Active" : "Inactive"}
                            onValueChange={async (value: string) => {
                                setAgentParameters({ ...agentParameters, active: value === "Active" ? true : false })
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <DialogFooter>
                    <Button disabled={loading} type="submit" onClick={async () => {
                        if (!agentParameters.name || agentParameters.name.length < 1) {
                            setError({ ...error, name: "Name is required" })
                            return
                        }
                        if (!agentParameters.description || agentParameters.description.length < 1) {
                            setError({ ...error, description: "Description is required" })
                            return
                        }
                        // Validate email
                        if (!agentParameters.email || agentParameters.email.length < 1) {
                            setError({ ...error, email: "Email is required" })
                            return
                        }
                        if (!validateEmail(agentParameters.email)) {
                            setError({ ...error, email: "Email is invalid" })
                            return
                        }
                        if (!agentParameters.phone || agentParameters.phone.length < 1) {
                            setError({ ...error, phone: "Phone is required" })
                            return
                        }
                        if (agentParameters.phone.length !== 10) {
                            setError({ ...error, phone: "Phone length should be 10" })
                            return
                        }

                        setLoading(true)
                        await fetch("http://13.232.83.2/api/support-agents", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(agentParameters),
                        })
                        router.refresh()
                        setShowModal(false)
                        setLoading(false)
                        setAgentParameters({
                            name: "",
                            description: "",
                            email: "",
                            phone: "",
                            active: true
                        })
                    }}
                    >
                        Create agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default CreateAgent