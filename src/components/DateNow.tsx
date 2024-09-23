"use client";

import { getDateNow } from "@/utils";
import { useEffect, useState } from "react";

const DateNow = ({ time, children }: any) => {
  const [date, setDate] = useState<string>();

  useEffect(() => {
    const time = setInterval(() => {
      setDate(getDateNow());
    }, 1000);

    return () => clearInterval(time);
  }, []);

  return <div className="text-ellipsis" suppressHydrationWarning>{date ?? time}</div>;
};

export default DateNow;
