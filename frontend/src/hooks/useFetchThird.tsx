import { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';

type UseFetchProps = {
    url: string;
}

export function useFetchThird<T>({ url }: UseFetchProps) {
    const { token } = useAuth();
    const [data3, setData] = useState<T>();
    const [isLoading3, setIsLoading] = useState(false);
    const [error3, setError] = useState("");

    useEffect(() => {
        if (!token) return; // wacht tot token beschikbaar is

        async function getData() {
            setIsLoading(true);
            try {
                const responsetwo = await fetch(`${url}/me`, {
                    headers: {
                        "Content-Type": "application/json", // voeg toe
                        "Accept": "application/json",       // voeg toe
                        "Authorization": `Bearer ${token}`, // JWT header
                    },
                });
                console.log(responsetwo);
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json", // voeg toe
                        "Accept": "application/json",       // voeg toe
                        "Authorization": `Bearer ${token}`, // JWT header
                    },
                });

                if (!response.ok) {
                    const text = await response.text().catch(() => 'Unknown error');
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }

                const responseData = await response.json();
                setData(responseData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        getData();
    }, [url, token]); // 🔑 voeg token toe in dependency array

    return { data3, isLoading3, error3 };
}
