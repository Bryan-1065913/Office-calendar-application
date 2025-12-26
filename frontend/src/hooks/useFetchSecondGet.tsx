import React, {useState, useEffect} from 'react';

type UseFetchProps = {
    url: string;
}
export function useFetchSecond<T>({url}: UseFetchProps) {
    const [data2, setData] = useState<T>();
    const [isLoading2, setIsLoading] = useState(false);
    const [error2, setError] = useState("");
    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            try {
                const response = await fetch(url);
                
                // Check if response is ok before parsing JSON
                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Unknown error');
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                
                // Check if response has content
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Response is not JSON');
                }
                
                const responseData = await response.json();
                setData(responseData);
            } catch (error2) {
                if (error2 instanceof Error) {
                    setError(error2.message);
                } else {
                    setError("something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [url])
    
    return {data2, isLoading2, error2};
}