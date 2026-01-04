import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';

type UseFetchProps = {
    url: string;
}

export function useFetch<T>({ url }: UseFetchProps) {
    const { token } = useAuth();
    const [data, setData] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return; // wacht tot token beschikbaar is

        async function getData() {
            setIsLoading(true);
            try {
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
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
    }, [url, token]); // 🔑 token toevoegen als dependency

    return { data, isLoading, error };
}
