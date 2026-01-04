// useState useEffect hooks
import {useState, useEffect} from 'react';


type UseFetchProps = {
    url: string;
}
// 
export function useFetchDelete<T>({url}: UseFetchProps) {
    const [data, setData] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!url) return;
        async function getData() {
            setIsLoading(true);
            try {
                const response = await fetch(url, { method: "DELETE" });
                if(!response.ok){
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [url])
    
    return {data, isLoading, error};
}

