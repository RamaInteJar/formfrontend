import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import React from 'react';

type Props = {};

const list = [
  {
    title: 'Total User',
    img: '/images/fruit-1.jpeg',
    price: '50',
  },
  {
    title: 'Total Application',
    img: '/images/fruit-2.jpeg',
    price: '30',
  },

  {
    title: 'Requested Timeoff',
    img: '/images/fruit-4.jpeg',
    price: '20',
  },
  {
    title: 'Total Approved',
    img: '/images/fruit-3.jpeg',
    price: '10',
  },
];

function DashboardPage({}: Props) {
  return (
    <div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable>
            <CardBody className="overflow-visible p-0">
              <p className="text-default-500 p-4 text-3xl font-bold">
                {item.price}
              </p>
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
