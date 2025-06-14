import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import ProductFormModal from "../molecules/ProductFormModal"

export default function NewProductModal({ open, onOpenChange, onSave }) {
  return (
    <ProductFormModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      isEdit={false}
    />
  )
}
