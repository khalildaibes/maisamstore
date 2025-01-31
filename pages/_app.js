import '../styles/globals.css'
import React from 'react'

import { Layout } from '../components'; 

import { StateContext } from '../context/StateContext'; //Using StateContext 

import { Toaster } from 'react-hot-toast'; //Adding pop-up


function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: ${process.env.NEXT_PUBLIC_PRIMARY_COLOR};
          --secondary-color: ${process.env.NEXT_PUBLIC_SECONDARY_COLOR};
        }
      `}</style>
    <StateContext /> 
    <StateContext> 
    <Layout> 
      <Toaster />
      <Component { ...pageProps} />
    </Layout>
    </StateContext>
    </>
  )
}
export default MyApp
