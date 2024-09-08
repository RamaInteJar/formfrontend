"use client";
import { useAuth } from "@/providers/authProvider";
import { getDashboardData } from "@/utils/apiCalls";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type DashboardType = {
  total_users: number;
  total_requested_timeoff: number;
  total_approved_timeoff: number;
  total_pending_timeoff: number;
};

const DashboardCard = () => {
  const { accessToken } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardType | null>(
    null
  );

  useEffect(() => {
    if (!accessToken) return;

    const fetchDashboardData = async () => {
      const data: DashboardType = await getDashboardData(accessToken);
      setDashboardData(data);
    };
    fetchDashboardData();
  }, [accessToken]);

  const list = [
    {
      title: "Total User",
      img: "/images/fruit-1.jpeg",
      total_item: dashboardData?.total_users.toString(),
    },
    {
      title: "Total Application",
      img: "/images/fruit-2.jpeg",
      total_item: dashboardData?.total_requested_timeoff.toString(),
    },

    {
      title: "Total Pending Timeoff",
      img: "/images/fruit-4.jpeg",
      total_item: dashboardData?.total_pending_timeoff.toString(),
    },
    {
      title: "Total Approved",
      img: "/images/fruit-3.jpeg",
      total_item: dashboardData?.total_approved_timeoff.toString(),
    },
  ];

  return (
    <div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable>
            <CardBody className="overflow-visible p-0">
              <p className="text-default-500 p-4 text-3xl font-bold">
                {item.total_item}
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
};

export default DashboardCard;
