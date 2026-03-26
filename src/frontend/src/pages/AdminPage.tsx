import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d.ts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ExternalBlob,
  useAddProduct,
  useDeleteProduct,
  useEditProduct,
  useGetAllProducts,
  useGetCallerUserRole,
  useInitializeAccessControlWithSecret,
  useIsCallerAdmin,
} from "../hooks/useQueries";

type ProductFormData = {
  name: string;
  price: string;
  imageFile: File | null;
  imagePreview: string | null;
};

const EMPTY_FORM: ProductFormData = {
  name: "",
  price: "",
  imageFile: null,
  imagePreview: null,
};

function formatPrice(price: bigint): string {
  return `৳ ${price.toLocaleString("bn-BD")}`;
}

function RegisterAdminScreen({
  onSuccess,
  onLogout,
}: { onSuccess: () => void; onLogout: () => void }) {
  const [token, setToken] = useState("");
  const initAccess = useInitializeAccessControlWithSecret();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      toast.error("টোকেন দিন");
      return;
    }
    try {
      await initAccess.mutateAsync(token.trim());
      toast.success("অ্যাডমিন হিসেবে নিবন্ধন সফল হয়েছে!");
      onSuccess();
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      if (
        msg.includes("Invalid") ||
        msg.includes("invalid") ||
        msg.includes("wrong") ||
        msg.includes("incorrect")
      ) {
        toast.error("ভুল টোকেন। আবার চেষ্টা করুন।");
      } else {
        toast.error("নিবন্ধন ব্যর্থ হয়েছে। টোকেন সঠিক কিনা যাচাই করুন।");
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-10 max-w-md w-full"
        data-ocid="admin.card"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="text-primary" size={26} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground text-center">
            প্রথম অ্যাডমিন হিসেবে নিবন্ধন করুন
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 text-center">
            অ্যাডমিন টোকেন দিয়ে নিবন্ধন করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="admin-token" className="font-sans">
              অ্যাডমিন টোকেন
            </Label>
            <Input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="টোকেন লিখুন"
              className="font-sans"
              required
              data-ocid="admin.input"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-brand-deep text-white font-sans w-full"
            disabled={initAccess.isPending}
            data-ocid="admin.submit_button"
          >
            {initAccess.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {initAccess.isPending ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="font-sans text-muted-foreground"
            onClick={onLogout}
            data-ocid="admin.secondary_button"
          >
            লগআউট
          </Button>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground font-sans flex items-center gap-1"
            data-ocid="admin.link"
          >
            <ArrowLeft size={14} /> হোমে ফিরুন
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const {
    data: isAdmin,
    isLoading: adminLoading,
    refetch: refetchAdmin,
  } = useIsCallerAdmin();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const addProduct = useAddProduct();
  const editProduct = useEditProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  function openAddDialog() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      imageFile: null,
      imagePreview: product.image.getDirectURL(),
    });
    setDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error("নাম এবং মূল্য দিন");
      return;
    }

    const priceNum = Number.parseInt(form.price, 10);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("সঠিক মূল্য দিন");
      return;
    }

    let imageBlob: ExternalBlob;

    if (form.imageFile) {
      const arrayBuffer = await form.imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
    } else if (editingProduct) {
      imageBlob = editingProduct.image;
    } else {
      toast.error("পণ্যের ছবি আপলোড করুন");
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : BigInt(0),
      name: form.name.trim(),
      price: BigInt(priceNum),
      image: imageBlob,
    };

    try {
      if (editingProduct) {
        await editProduct.mutateAsync(productData);
        toast.success("পণ্য আপডেট হয়েছে");
      } else {
        await addProduct.mutateAsync(productData);
        toast.success("পণ্য যোগ করা হয়েছে");
      }
      setDialogOpen(false);
      setUploadProgress(0);
    } catch {
      toast.error("কিছু একটা ভুল হয়েছে");
      setUploadProgress(0);
    }
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget);
      toast.success("পণ্য মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মুছতে ব্যর্থ হয়েছে");
    } finally {
      setDeleteTarget(null);
    }
  }

  const isPending = addProduct.isPending || editProduct.isPending;

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card p-10 max-w-md w-full text-center"
          data-ocid="admin.card"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-muted-foreground font-sans mb-8">
            প্রবেশ করতে লগইন করুন
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-brand-deep text-white font-sans w-full"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoggingIn ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </Button>
          <div className="mt-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground font-sans flex items-center justify-center gap-1"
              data-ocid="admin.link"
            >
              <ArrowLeft size={14} /> হোমে ফিরুন
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Checking roles
  if (adminLoading || roleLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // User is not registered — show first admin registration screen
  if (userRole === null || userRole === undefined) {
    return (
      <RegisterAdminScreen
        onSuccess={() => refetchAdmin()}
        onLogout={() => clear()}
      />
    );
  }

  // Registered but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div
          className="bg-card rounded-2xl shadow-card p-10 max-w-md w-full text-center"
          data-ocid="admin.error_state"
        >
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            অনুমতি নেই
          </h1>
          <p className="text-muted-foreground font-sans mb-6">
            আপনার অ্যাডমিন অ্যাক্সেস নেই।
          </p>
          <Button
            variant="outline"
            onClick={() => clear()}
            className="font-sans mr-2"
          >
            লগআউট
          </Button>
          <Link to="/">
            <Button
              className="font-sans bg-primary hover:bg-brand-deep text-white"
              data-ocid="admin.link"
            >
              হোমে ফিরুন
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-white">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-serif text-xl font-bold text-white"
            data-ocid="admin.link"
          >
            Huarda Cloth
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70 font-sans hidden sm:block">
              {identity?.getPrincipal().toString().slice(0, 12)}...
            </span>
            <Button
              size="sm"
              variant="outline"
              className="font-sans text-foreground border-white/30 hover:bg-white/10 hover:text-white"
              onClick={() => clear()}
              data-ocid="admin.secondary_button"
            >
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              অ্যাডমিন প্যানেল
            </h1>
            <p className="text-muted-foreground font-sans mt-1">
              পণ্য পরিচালনা করুন
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-brand-deep text-white font-sans flex items-center gap-2"
            onClick={openAddDialog}
            data-ocid="product.open_modal_button"
          >
            <Plus size={16} />
            নতুন প্রডাক্ট যোগ করুন
          </Button>
        </motion.div>

        {/* Products Table */}
        <div
          className="bg-card rounded-xl shadow-card overflow-hidden"
          data-ocid="product.table"
        >
          {productsLoading ? (
            <div className="p-6 space-y-3" data-ocid="product.loading_state">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div
              className="p-16 text-center text-muted-foreground font-sans"
              data-ocid="product.empty_state"
            >
              কোনো পণ্য নেই। প্রথম পণ্য যোগ করুন!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans">ছবি</TableHead>
                  <TableHead className="font-sans">নাম</TableHead>
                  <TableHead className="font-sans">মূল্য</TableHead>
                  <TableHead className="font-sans text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow
                    key={String(product.id)}
                    data-ocid={`product.row.${i + 1}`}
                  >
                    <TableCell>
                      <img
                        src={product.image.getDirectURL()}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-sans font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="font-sans text-brand-deep font-semibold">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(product)}
                          data-ocid={`product.edit_button.${i + 1}`}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(product.id)}
                          data-ocid={`product.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" data-ocid="product.dialog">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingProduct ? "পণ্য সম্পাদনা" : "নতুন পণ্য যোগ করুন"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="product-name" className="font-sans">
                পণ্যের নাম
              </Label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="যেমন: লাল শাড়ি"
                className="font-sans"
                required
                data-ocid="product.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-price" className="font-sans">
                মূল্য (টাকায়)
              </Label>
              <Input
                id="product-price"
                type="number"
                min={1}
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="যেমন: 1500"
                className="font-sans"
                required
                data-ocid="product.input"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium font-sans">পণ্যের ছবি</span>
              <label
                htmlFor="product-image"
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors block"
                data-ocid="product.dropzone"
              >
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="প্রিভিউ"
                    className="max-h-40 mx-auto rounded-md object-contain"
                  />
                ) : (
                  <div className="py-4 text-muted-foreground font-sans">
                    <Upload size={24} className="mx-auto mb-2" />
                    <p className="text-sm">ছবি আপলোড করতে ক্লিক করুন</p>
                  </div>
                )}
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  data-ocid="product.upload_button"
                />
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="text-xs text-muted-foreground font-sans">
                  আপলোড হচ্ছে: {uploadProgress}%
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="font-sans"
                data-ocid="product.cancel_button"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-brand-deep text-white font-sans"
                data-ocid="product.submit_button"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="product.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              পণ্য মুছে ফেলবেন?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              এই পণ্যটি স্থায়ীভাবে মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-sans"
              data-ocid="product.cancel_button"
            >
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-sans"
              onClick={handleDelete}
              data-ocid="product.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
