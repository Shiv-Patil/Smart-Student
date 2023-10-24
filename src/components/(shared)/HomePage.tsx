"use client";

import { useEffect, useState } from "react";
import moment from "moment";

const HomePage = () => {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const currentHour = parseFloat(moment(new Date()).format("HH"));
    if (currentHour >= 12 && currentHour < 18) setGreeting("Good Afternoon.");
    else if (currentHour >= 18) setGreeting("Good Evening.");
    else setGreeting("Good Morning.");
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-2">
      <p className="text-5xl animate-fade-in">{greeting}</p>
      <p className="text-xs text-secondary-foreground">
        use the naviagtion buttons to proceed.
      </p>
    </div>
  );
};

export default HomePage;
