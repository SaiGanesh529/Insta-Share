import React, { useEffect, useState } from 'react'

function UseCounter() {
    const [count, setCount] = useState(0);
    const [isTrue, setIsTrue]=useState(false);

    useEffect(() => {
        console.log("useEffect runs again");
        return 
    },[count,isTrue])
    
    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button className="text-white" onClick={()=>setIsTrue(!isTrue)}>{isTrue?"hello":"rendered"}</button>
        </div>
    )
}

export default UseCounter
