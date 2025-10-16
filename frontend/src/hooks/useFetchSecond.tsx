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
 
