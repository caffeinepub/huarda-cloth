import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import type { Product } from "../backend.d.ts";
import { useGetAllProducts } from "../hooks/useQueries";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "লাল রেশমি শাড়ি",
    price: BigInt(4500),
    image: {
      getDirectURL: () => "/assets/generated/product-saree-red.dim_400x500.jpg",
    } as any,
  },
  {
    id: BigInt(2),
    name: "নীল মসলিন শাড়ি",
    price: BigInt(3800),
    image: {
      getDirectURL: () =>
        "/assets/generated/product-saree-blue.dim_400x500.jpg",
    } as any,
  },
  {
    id: BigInt(3),
    name: "সবুজ কুর্তি",
    price: BigInt(1200),
    image: {
      getDirectURL: () =>
        "/assets/generated/product-kurti-green.dim_400x500.jpg",
    } as any,
  },
  {
    id: BigInt(4),
    name: "সাদা পাঞ্জাবি",
    price: BigInt(1800),
    image: {
      getDirectURL: () =>
        "/assets/generated/product-panjabi-white.dim_400x500.jpg",
    } as any,
  },
  {
    id: BigInt(5),
    name: "শিশুদের ঘাগরা",
    price: BigInt(950),
    image: {
      getDirectURL: () =>
        "/assets/generated/product-kids-dress.dim_400x500.jpg",
    } as any,
  },
  {
    id: BigInt(6),
    name: "জামদানি শাড়ি",
    price: BigInt(8500),
    image: {
      getDirectURL: () => "/assets/generated/product-jamdani.dim_400x500.jpg",
    } as any,
  },
];

const NAV_LINKS = [
  { label: "হোম", href: "/" },
  { label: "শাড়ি", href: "/" },
  { label: "কুর্তা", href: "/" },
  { label: "পুরুষ", href: "/" },
  { label: "শিশু", href: "/" },
  { label: "সেল", href: "/" },
  { label: "আমাদের সম্পর্কে", href: "/" },
];

const SOCIAL_LINKS = [
  { icon: SiFacebook, label: "Facebook", href: "https://facebook.com" },
  { icon: SiInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: SiYoutube, label: "YouTube", href: "https://youtube.com" },
];

function formatPrice(price: bigint): string {
  return `৳ ${price.toLocaleString("bn-BD")}`;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 group"
      data-ocid={`product.item.${index + 1}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image.getDirectURL()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-sans font-medium text-foreground text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-sans font-semibold text-brand-deep text-base mb-3">
          {formatPrice(product.price)}
        </p>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-brand-deep text-primary-foreground font-sans text-xs"
          data-ocid={`product.button.${index + 1}`}
        >
          কার্টে যোগ করুন
        </Button>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: backendProducts, isLoading } = useGetAllProducts();

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-foreground text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="font-serif text-2xl font-bold tracking-wide text-white"
              data-ocid="nav.link"
            >
              Huarda Cloth
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors font-sans"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="অনুসন্ধান"
              >
                <Search size={18} />
              </button>
              <Link
                to="/admin"
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="অ্যাকাউন্ট"
                data-ocid="nav.link"
              >
                <User size={18} />
              </Link>
              <button
                type="button"
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="কার্ট"
              >
                <ShoppingCart size={18} />
              </button>
              <button
                type="button"
                className="md:hidden text-white/80 hover:text-white transition-colors p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="মেনু"
                data-ocid="nav.toggle"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 border-t border-white/10 pt-3 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors font-sans py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          )}
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-[520px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative max-w-[1200px] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              বাংলার ঐতিহ্য উদযাপন করুন
            </h1>
            <p className="text-white/80 font-sans text-lg mb-8">
              সেরা মানের কাপড়, ঐতিহ্যবাহী ডিজাইন — আপনার প্রতিটি মুহূর্তের জন্য
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-brand-deep text-white font-sans font-semibold text-base px-8 py-3 rounded-lg"
              data-ocid="hero.primary_button"
            >
              কালেকশন দেখুন
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <main className="flex-1">
        <section className="max-w-[1200px] mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              নতুন কালেকশন
            </h2>
            <p className="text-muted-foreground font-sans">
              আমাদের সর্বশেষ পোশাক সংগ্রহ
            </p>
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              data-ocid="product.loading_state"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground font-sans"
              data-ocid="product.empty_state"
            >
              কোনো প্রডাক্ট পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white pt-12 pb-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">
                দ্রুত লিংক
              </h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">যোগাযোগ</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-white/70 font-sans">
                  <User size={14} className="text-primary flex-shrink-0" />
                  <span>MD Maruf</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/70 font-sans">
                  <Phone
                    size={14}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <div>
                      বিকাশ ১:{" "}
                      <a
                        href="tel:01325977387"
                        className="hover:text-white transition-colors"
                      >
                        01325977387
                      </a>
                    </div>
                    <div>
                      বিকাশ ২:{" "}
                      <a
                        href="tel:01764018449"
                        className="hover:text-white transition-colors"
                      >
                        01764018449
                      </a>
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70 font-sans">
                  <MapPin size={14} className="text-primary flex-shrink-0" />
                  <span>বাংলাদেশ</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">
                আমাদের অনুসরণ করুন
              </h3>
              <p className="text-sm text-white/70 font-sans mb-4">
                নতুন কালেকশন এবং অফার সম্পর্কে সর্বপ্রথম জানুন।
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-primary transition-colors"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-white/50 font-sans">
              © {currentYear} Huarda Cloth. All rights reserved.
            </p>
            <p className="text-sm text-white/50 font-sans">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
