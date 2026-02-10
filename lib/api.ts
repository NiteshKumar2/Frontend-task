import axios from 'axios'
import React from 'react'

const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_BASEURL,
})

export default api
