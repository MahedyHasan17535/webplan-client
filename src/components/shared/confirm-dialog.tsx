"use client"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = "Confirm",
    destructive = false,
    onConfirm,
}: {
    trigger: React.ReactElement
    title: string
    description: string
    confirmLabel?: string
    destructive?: boolean
    onConfirm: () => Promise<void> | void
}) {
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState(false)

    const handleConfirm = async () => {
        setPending(true)
        try {
            await onConfirm()
        } finally {
            setPending(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={trigger} />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Back</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={pending}
                        variant={destructive ? "destructive" : "default"}
                    >
                        {pending ? "Please wait…" : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}