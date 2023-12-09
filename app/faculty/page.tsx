'use client';

import NotApproved from '@/components/faculty/NotApproved';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';

enum Status {
  Approved = 'True',
  NotApproved = 'False',
}

export default function FacultyPage() {
  let tabs = [
    {
      id: 'not-approve',
      label: 'Submitted Application',
      content: <NotApproved status_query={Status.NotApproved} />,
    },
    {
      id: 'approved',
      label: 'Approved application',
      content: <NotApproved status_query={Status.Approved} />,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Dynamic tabs" items={tabs}>
          {(item) => (
            <Tab key={item.id} title={item.label}>
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
}
