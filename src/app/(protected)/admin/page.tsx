"use client"
import { useEffect, useState } from "react";
import { OrderT } from "@/utils/types";
import ActionBtns from "@/components/ActionBtns";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

const Admin = () => {
    const router = useRouter()
    const [orders, setOrders] = useState<OrderT[] | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<OrderT[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const verify = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            credentials:"include",
            body: JSON.stringify("verify")
        })
        if(res.ok){
            const data =await res.json()
            console.log(data);
            return
        }else{
            router.back()
        }
    }
    
    const logout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`, {
                method: "GET",
                headers: {"Content-Type": "application/json",},
            });
            if (res.ok) {
                router.push("/")
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    };
    
    
    const getData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (res.status === 401) {
                console.log("fetch failed 401");
                setLoading(false);
                router.push("/");
            }
            
            if (res.ok) {
                console.log("fetched");
                const data = await res.json();
                setOrders(data);
                setFilteredOrders(data);
            }
        } catch (error) {
            setError("Failed to fetch orders. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        verify()
        getData();
    }, []);
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (orders) {
            const filtered = orders.filter(
                (order) =>
                    order.orderData.labelID.toLowerCase().includes(term) ||
                    order.email.toLowerCase().includes(term) ||
                    order.phone.toLowerCase().includes(term)
            );
            setFilteredOrders(filtered);
        }
    };

    const toggleExpandOrder = (orderId: string) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const sortedOrders = filteredOrders?.sort((a, b) => {
        const dateA = new Date(a._createdAt).getTime();
        const dateB = new Date(b._createdAt).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="lg:p-12 p-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <form onSubmit={logout}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </form>
                </div>

                <div className="w-full flex flex-col md:flex-row gap-6">
                    <div className="md:w-64 w-full bg-white rounded-lg shadow-md p-4">
                        <h4 className="font-medium text-lg mb-4">Tools</h4>
                        <input
                            type="text"
                            placeholder="Search by Label ID, Email, or Phone"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Sort by Date:</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                        <h4 className="font-medium text-lg mb-4">Orders</h4>
                        <div className="space-y-4">
                            {sortedOrders && sortedOrders.length > 0 ? (
                                sortedOrders.map((data: OrderT, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row justify-between items-start p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-full">
                                            <p className="font-medium truncate">{data.email}</p>
                                            <p className="font-medium truncate">{data.phone}</p>
                                            <p className="text-sm">
                                                <span className="font-medium text-gray-800">Label ID: </span>
                                                {data.orderData.labelID}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-4 max-h-40 overflow-y-auto">
                                                {data.packages
                                                    .slice(0, expandedOrderId === data._id ? data.packages.length : 5)
                                                    .map((packageData, index) => (
                                                        <div className="flex flex-col items-center" key={index}>
                                                            <div className="w-16 h-16 shadow-sm shadow-gray-300 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={packageData.image}
                                                                    alt="product"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm mt-1">
                                                                <span className="text-xs text-gray-500">{packageData.id}</span> x
                                                                {packageData.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                {data.packages.length > 5 && (
                                                    <button
                                                        onClick={() => toggleExpandOrder(data._id)}
                                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                                    >
                                                        {expandedOrderId === data._id ? "Show Less" : "Show More"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs">
                                            <span className="font-medium">Created At: </span>
                                            {new Date(data._createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                                            <ActionBtns labelLink={data.orderData.label.pdf} />
                                            <div className="w-20 h-24 overflow-hidden rounded-lg shadow-sm">
                                                <img
                                                    src={data.orderData.label.png}
                                                    alt="label"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No orders found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;