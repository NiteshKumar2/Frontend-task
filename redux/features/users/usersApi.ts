import api from "@/lib/api";

export const getUsers=()=>api.get("/users")
export const addUser=(data:any)=>api.post("/users",data)
export const editUser=(id:number,data:any)=>api.put(`/users/${id}`,data)
export const deleteUser=(id:string)=>api.delete(`/users/${id}`)
