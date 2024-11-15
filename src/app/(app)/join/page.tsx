'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { z } from 'zod'
import { useToast } from "@/hooks/use-toast";

// Define Zod schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function Page() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState('login') // State to track the active tab
  const router = useRouter()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    type: '/login' | '',
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;

    // Select schema based on form type
    const schema = type === '/login' ? loginSchema : registerSchema;

    // Parse and validate data with Zod
    const result = schema.safeParse({ email, password, first_name, last_name });

    if (!result.success) {
      const errorMessages = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {} as { [key: string]: string });
      setErrors(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (type == '/login') {
          router.replace('/');
        } else if(type == '') {
          localStorage.setItem('user_id', data.doc.id);
          router.replace('/verify-otp');
        } else {
          router.replace('/join');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.errors[0].message,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again!",
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <SiteHeader />
      <div className="container flex items-center justify-center min-h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleSubmit(e, '/login')}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/reset-password');
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleSubmit(e, '')}>
                <CardContent className="space-y-2">
                  <div className="flex space-x-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" name="first_name" required />
                      {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" name="last_name" required />
                      {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Register'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
