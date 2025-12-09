// import React from "react";
// import useSWR from "swr";
// import axios from "axios";
// import Skeleton from "../components/Skeleton"; // Adjust the path as needed

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// export default function UsersList() {
//   const { data, error, isLoading } = useSWR("/api/admin/users", fetcher);

//   if (isLoading) return <Skeleton className="h-10 w-full mb-2" />;
//   if (error) return <p>Error loading users</p>;

//   return (
//     <div>
//       {data?.map((user: any) => (
//         <div key={user._id}>{user.email}</div>
//       ))}
//     </div>
//   );
// }
