import React from 'react';
import { client } from '../lib/client';
import {Dashboard} from '../components';


const Dashboards = ({ orders }) => {


  return (
    <div >
        <Dashboard orders={orders} />
    </div>
  );
};

// Fetch data based on the brand query parameter
export const getStaticProps = async (context) => {

  const ordersQuery = '*[_type == "orders"]'; // Fetch brands from "brand" schema
  const orders = await client.fetch(ordersQuery);

  return {
    props: { orders }
  };
};

export default Dashboards;
