import React, { useEffect, useState } from 'react'

const UseEffect = () => {
    const [data, setData] = useState([]);

    async function fetchData() {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const val = await response.json();
        setData(val);
    }
    console.log(data);

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => (
                <div
                    key={post.id}
                    className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                >
                    <h1 className="text-xl font-semibold text-gray-800 mb-2">
                        {post.title}
                    </h1>
                    <p className="text-gray-600">{post.body}</p>
                </div>
            ))}
        </div>
    )
}

export default UseEffect
