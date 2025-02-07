"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getProductNameByID } from "@/lib/investment-products/dynamicFundQuery"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowDownCircle } from 'lucide-react'

interface InvestmentDetails {
    userId: number
    productId: number
    expected_return: number
    amount: number
    term: number
    startDate: Date
    endDate: Date
    periods: number
}

export default function ConfirmInvestment() {
    const [investment, setInvestment] = useState<InvestmentDetails | null>(null);
    const [total, setTotal] = useState(0);
    const [productName, setProductName] = useState('');
    const [insurance, setInsurance] = useState(false);

    useEffect(() => {
        const fetchInvestmentData = async () => {
            const investmentData = sessionStorage.getItem('investmentData');
            sessionStorage.removeItem('investmentData');
            if (investmentData) {
                const product = await getProductNameByID(JSON.parse(investmentData).productId);

                setProductName(product);
                setInvestment(JSON.parse(investmentData));
                setTotal(JSON.parse(investmentData).amount);
            }
        };
        fetchInvestmentData();
    }, []);

    const handleConfirm = () => {
        if (investment) {
            const finalAmount = insurance ? investment.amount * 1.1 : investment.amount;
            console.log("Investment confirmed:", { ...investment, amount: finalAmount });
        }
    }

    return (
        <>
            <SiteHeader />
            <h1 className="text-3xl font-bold mb-6 text-center mt-10">CONFIRM INVESTMENT</h1>
            <Card className="w-full max-w-5xl mx-auto mb-4">
                <CardHeader>
                    <CardTitle className="text-gray-400">Please review your investment details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            {investment ? (
                                <>
                                    <div className="flex space-x-4">
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="productId">Product</Label>
                                            <Input
                                                id="productId"
                                                value={productName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="periods">Periods</Label>
                                            <Input
                                                id="periods"
                                                value={investment.periods}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                value={investment.amount}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="term">Term</Label>
                                            <Input
                                                id="term"
                                                value={investment.term}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input
                                                id="startDate"
                                                value={new Date(investment.startDate).toLocaleDateString()}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="endDate">End Date</Label>
                                            <Input
                                                id="endDate"
                                                value={new Date(investment.endDate).toLocaleDateString()}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex flex-col w-1/2 space-y-1.5">
                                            <Label htmlFor="expected_return">Expected Return</Label>
                                            <Input
                                                id="expected_return"
                                                value={investment.expected_return}
                                                readOnly
                                            />
                                        </div>

                                    </div>


                                </>
                            ) : (
                                <p>Loading investment details...</p>
                            )}
                        </div>
                    </form>
                    <div className="border-b border-gray-500 mt-4"></div>
                    <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Insurance</AlertTitle>
                        <AlertDescription>
                            Insurance description
                        </AlertDescription>
                    </Alert>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="insurance"
                            className="w-3 h-3 mt-3 ml-1 mr-1 scale-150 transform"
                            checked={insurance}
                            onChange={() => {
                                setInsurance(!insurance);
                                setTotal(insurance ? investment.amount - (investment.amount * 0.1) : investment.amount + (investment.amount * 0.1));
                            }}
                        />
                        <Label className=" mt-3" htmlFor="insurance">Activate Insurance (-10%)</Label>
                    </div>
                    <div className="border-b border-gray-500 mt-4"></div>
                </CardContent>
                <CardFooter className="flex justify-between mb-5">
                    <div className="flex flex-col w-full">
                    <Label className="text-right w-full">Total: {total.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,})} </Label>
                    
                    <div className="flex flex-row justify-between mt-5">
                    <Button className="bg-red-600 hover:bg-red-500 text-white p-5">Cancel</Button>
                    <Button className="bg-green-600 text-white hover:bg-green-500 p-5" onClick={handleConfirm}>Confirm Investment</Button>
                    </div>
                    </div>
                    
                </CardFooter>
            </Card>
            <SiteFooter />
        </>
    )
}