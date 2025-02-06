import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wealth Farming</h3>
            <p className="text-sm text-muted-foreground">Grow your wealth with sustainable investment strategies.</p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/p/BeQ-Holdings-61555802044845/" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:underline">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/investment-contracts" className="hover:underline">
                  Investment Contracts
                </Link>
              </li>
              <li>
                <Link href="/account/referral" className="hover:underline">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest news and offers.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="max-w-[180px]" />
              <Button type="submit" variant="default">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wealth Farming. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
