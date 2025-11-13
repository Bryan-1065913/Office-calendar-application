import React, {useState, useEffect} from 'react';

type UseFetchProps = {
    url: string;
}
export function useFetchThird<T>({url}: UseFetchProps) {
    const [data3, setData] = useState<T>();
    const [isLoading3, setIsLoading] = useState(false);
    const [error3, setError] = useState("");
    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            try {
                const response = await fetch(url);
                const responseData = await response.json();
                setData(responseData);
            } catch (error3) {
                if (error3 instanceof Error) {
                    setError(error3.message);
                } else {
                    setError("something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [url])
    
    return {data3, isLoading3, error3};
}

