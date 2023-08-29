import { useRouter } from 'next/router'
import { useState } from 'react';

export default function Share() {
    const router = useRouter();
    const [id, setId] = useState(router.query.id);

    const checkRedirection = async () => {
        if (router.query.id) {
            localStorage.setItem("ytUrl", `https://www.youtube.com/watch?v=${router.query.id}`);
            router.push('/');
        }

        return true;
    }

    return <>{checkRedirection() && <></>}</>
}